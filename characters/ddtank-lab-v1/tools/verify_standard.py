"""Verify the immutable character baseline. Python standard library only."""
from pathlib import Path
import argparse
import hashlib
import json
import struct
import tempfile
from html.parser import HTMLParser
from urllib.parse import urlsplit

PACK = Path(__file__).resolve().parents[1]
REPO = PACK.parents[1]

class LinkCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ['href','src'] and value:
                self.targets.append(value)

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def check_file(path, entry):
    if not path.is_file():
        return ['missing: '+str(path)]
    errors = []
    if digest(path) != entry['sha256']:
        errors.append('SHA-256 changed: '+str(path))
    if path.stat().st_size != entry['bytes']:
        errors.append('byte length changed: '+str(path))
    if 'png_size' in entry:
        header = path.read_bytes()[:24]
        if len(header) < 24 or header[:8] != b'\x89PNG\r\n\x1a\n':
            errors.append('not a PNG: '+str(path))
        elif list(struct.unpack('>II', header[16:24])) != entry['png_size']:
            errors.append('PNG dimensions changed: '+str(path))
    return errors

def verify(live_root=None):
    baseline = json.loads((PACK/'baseline-lock.json').read_bytes())
    errors = []
    checked = 0
    live_checked = 0
    external_checked = 0
    for entry in baseline['files']:
        path = REPO/entry['repository_path'] if 'repository_path' in entry else PACK/entry['path']
        errors.extend(check_file(path, entry))
        checked += 1
        if live_root is not None and 'live_path' in entry:
            errors.extend(check_file(live_root/entry['live_path'], entry))
            live_checked += 1
    if live_root is not None:
        for entry in baseline.get('external_files',[]):
            errors.extend(check_file(live_root/entry['live_path'],entry))
            external_checked += 1
    contract = json.loads((PACK/'contract.json').read_bytes())
    catalog = json.loads((PACK/'web/modular-catalog.json').read_bytes())
    lock = json.loads((PACK/'web/character-standard-lock.json').read_bytes())
    if digest(PACK/'web/modular-catalog.json') != lock['catalog_sha256']:
        errors.append('catalog does not match runtime lock')
    for key in ['frame_size','frame_count','cycle_seconds','head_anchor','head_source_anchor','head_scale','layer_order','defaults']:
        if catalog[key] != contract['registration'][key] or catalog[key] != lock['settings'][key]:
            errors.append('registration mismatch: '+key)
    slots = ['cloth','hair','face','eff','head']
    for slot in slots:
        if [entry['id'] for entry in catalog[slot]] != contract['inventory']['slots'][slot]:
            errors.append('inventory mismatch: '+slot)
        for entry in catalog[slot]:
            if [entry['icon']['width'],entry['icon']['height']] != [78,78]:
                errors.append('inventory icon must be 78x78: '+entry['id'])
            if slot in ['hair','face','eff','head'] and entry['icon_preview_layers'] != ['base_head',slot]:
                errors.append('icon is missing the standard head: '+entry['id'])
    if any(entry.get('already_closed',False) for entry in catalog['face']):
        errors.append('closed-eye state leaked into inventory')
    if any(entry.get('inventory',True) for entry in catalog['animation_faces']):
        errors.append('animation face is marked as an inventory item')
    if sum(len(catalog[slot]) for slot in slots) != 9:
        errors.append('v1 must contain 9 inventory items')
    for relative, expected in lock['assets'].items():
        path = PACK/'web'/relative
        if digest(path) != expected['sha256']:
            errors.append('runtime image lock mismatch: '+relative)
    for html in (PACK/'web').glob('*.html'):
        links = LinkCollector()
        links.feed(html.read_text(encoding='utf-8'))
        for target in links.targets:
            parsed = urlsplit(target)
            if not parsed.scheme and parsed.path and not (html.parent/parsed.path).exists():
                errors.append('broken snapshot link: '+html.name+' -> '+target)
    result = {'standard':baseline['id'],'passed':not errors,'snapshot_files_checked':checked,'live_files_checked':live_checked,'external_metadata_and_config_checked':external_checked,'registered_pngs':len(lock['assets']),'inventory_items':9,'open_eye_sets':len(catalog['face']),'stand_looks':48,'walk_pose_compositions':384,'errors':errors}
    return result

def self_test():
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory)/'fixture.png'
        original = b'\x89PNG\r\n\x1a\n'+b'\x00\x00\x00\rIHDR'+struct.pack('>II',250,342)
        path.write_bytes(original)
        entry = {'sha256':digest(path),'bytes':len(original),'png_size':[250,342]}
        assert not check_file(path,entry)
        path.write_bytes(original[:-1]+b'X')
        assert any('SHA-256' in error for error in check_file(path,entry))
        assert any('dimensions' in error for error in check_file(path,entry))
        path.write_bytes(original+b'changed')
        assert any('byte length' in error for error in check_file(path,entry))
        path.unlink()
        assert any('missing' in error for error in check_file(path,entry))
    print('Guard self-test PASS: missing file, altered pixels/bytes and dimensions rejected')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--live-root',type=Path,help='Also verify the running DDTank lab against this baseline')
    parser.add_argument('--report',type=Path)
    parser.add_argument('--self-test',action='store_true')
    args = parser.parse_args()
    if args.self_test:
        self_test()
    result = verify(args.live_root)
    if args.report:
        args.report.parent.mkdir(parents=True,exist_ok=True)
        args.report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps(result,ensure_ascii=False,indent=2))
    raise SystemExit(0 if result['passed'] else 1)
