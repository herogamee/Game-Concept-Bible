import assert from 'node:assert/strict'
import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { test } from 'node:test'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, preview } from 'vite'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const configFile = join(projectRoot, 'vite.config.ts')
const oldThemePath = '@rpgjs/ui-css/src/theme-default/theme.css'
const themePath = '@rpgjs/ui-css/theme-default/theme.css'
const themeMarker = '--rpg-ui-body-bg:'

const stylesheetUrls = (html, indexUrl) => [...html.matchAll(/<link\b[^>]*>/gi)]
  .map(([tag]) => {
    if (!/\brel=["']stylesheet["']/i.test(tag)) return null
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1]
    return href ? new URL(href, indexUrl) : null
  })
  .filter(url => url && url.origin === indexUrl.origin)

const closePreview = server => new Promise((resolve, reject) => {
  server.httpServer.close(error => error ? reject(error) : resolve())
})

test('production previews serve maps and the UI theme at root and subpath', async () => {
  const sourceHtml = await readFile(join(projectRoot, 'index.html'), 'utf8')
  assert.equal(sourceHtml.includes(oldThemePath), false)
  assert.equal(sourceHtml.includes(themePath), true)
  await access(join(projectRoot, 'node_modules', '@rpgjs', 'ui-css', 'theme-default', 'theme.css'))

  const temporaryOutput = await mkdtemp(join(tmpdir(), 'rpgjs-starter-production-'))

  try {
    for (const variant of [
      { name: 'root', base: '/', route: '/' },
      { name: 'subpath', base: '/quest/', route: '/quest/' }
    ]) {
      const outDir = join(temporaryOutput, variant.name)
      await build({
        root: projectRoot,
        configFile,
        base: variant.base,
        build: { outDir, emptyOutDir: true }
      })
      await access(join(outDir, 'map', 'village.tmx'))

      const server = await preview({
        root: projectRoot,
        configFile: false,
        base: variant.base,
        build: { outDir },
        preview: {
          host: '127.0.0.1',
          port: 0,
          strictPort: true
        }
      })

      try {
        const address = server.httpServer.address()
        assert(address && typeof address === 'object')
        const origin = new URL(`http://127.0.0.1:${address.port}`)
        const indexUrl = new URL(variant.route, origin)

        const indexResponse = await fetch(indexUrl)
        assert.equal(indexResponse.status, 200, `${variant.name} index status`)
        const builtHtml = await indexResponse.text()
        assert.doesNotMatch(builtHtml, /node_modules\/@rpgjs\/ui-css/)

        const mapResponse = await fetch(new URL(`${variant.route}map/village.tmx`, origin))
        assert.equal(mapResponse.status, 200, `${variant.name} map status`)
        assert.match(await mapResponse.text(), /<map\b/)

        const tileset=await fetch(new URL(`${variant.route}map/village-ground.tsx`,origin))
        assert.equal(tileset.status,200)
        assert.match(await tileset.text(), /collision/)
        for(const path of ['map/village-ground.png','map/meadow-ground.png','willowbrook/adventurer.png','willowbrook/npc-elder.png','willowbrook/hd/chibi-hero-v2.png','willowbrook/hd/hero-avatar-v2.png','willowbrook/hd/npc-elder.png','willowbrook/hd/slime.png','willowbrook/hd/tree.png','willowbrook/hd/village-ground.png','willowbrook/hd/meadow-ground.png']){
          const response=await fetch(new URL(`${variant.route}${path}`,origin))
          assert.equal(response.status,200,`${variant.name} ${path}`)
          const bytes=new Uint8Array(await response.arrayBuffer())
          assert.deepEqual([...bytes.slice(0,8)],[137,80,78,71,13,10,26,10],`${path} must be PNG, not HTML fallback`)
        }

        const localStylesheets = stylesheetUrls(builtHtml, indexUrl)
        assert(localStylesheets.length > 0, `${variant.name} emitted no local stylesheets`)
        let fetchedTheme = false
        for (const stylesheetUrl of localStylesheets) {
          const response = await fetch(stylesheetUrl)
          assert.equal(response.status, 200, `${variant.name} stylesheet status: ${stylesheetUrl}`)
          assert.match(response.headers.get('content-type') ?? '', /^text\/css\b/)
          if ((await response.text()).includes(themeMarker)) fetchedTheme = true
        }
        assert.equal(fetchedTheme, true, `${variant.name} did not fetch the bundled default theme`)
      } finally {
        await closePreview(server)
      }
    }
  } finally {
    await rm(temporaryOutput, { recursive: true, force: true })
  }
})
