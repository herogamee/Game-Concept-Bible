/** Engineering annotation of the shared cheek regions, not character artwork. */
import {createCanvas, loadImage} from '@napi-rs/canvas';
import {readFile, writeFile} from 'node:fs/promises';
const image = await loadImage(await readFile('assets/fixed-template-v1/head-template.png'));
const c = createCanvas(image.width, image.height), ctx = c.getContext('2d');
ctx.drawImage(image, 0, 0);
ctx.strokeStyle = '#007cff'; ctx.lineWidth = 2;
for (const x of [481, 729]) ctx.strokeRect(x, 458, 40, 24);
await writeFile('assets/fixed-template-v1/cheek-placement-guide.png', c.toBuffer('image/png'));
console.log('Exported cheek placement guide on the shared registered canvas.');
