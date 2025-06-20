import * as core from '../core/index.mjs'

/* Moves the map for a specific times:
- in a choosen direction (left, right, up, down)
- zoom in or out
 */
export async function moveMap (page, direction, times, wait = 500) {
  let dir
  if (direction === 'up') { dir = 'ArrowUp' } else if (direction === 'down') { dir = 'ArrowDown' } else if (direction === 'left') { dir = 'ArrowLeft' } else if (direction === 'right') { dir = 'ArrowRight' } else if (direction === 'in') { dir = '+' } else if (direction === 'out') { dir = '-' }
  await page.focus('#map')
  await core.waitForTimeout(wait)
  let i = 0
  for (i = 0; i < times; i++) {
    await page.keyboard.press(dir)
    await core.waitForTimeout(wait)
  }
}

/* Zooms the map to a specific level
 */
export async function zoomToLevel (page, storePath, level, wait = 500) {
  // FIXME: better way to get activity state ?
  // At current time the activity should implement state saving to make it work
  const zoom = await core.getFromStore(page, `${storePath}.state.zoom`)
  const diff = level - zoom
  const action = (level > zoom) ? 'in' : 'out'
  await moveMap(page, action, Math.abs(diff), wait)
  await core.waitForTimeout(wait)
}
