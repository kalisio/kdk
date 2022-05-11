import * as core from '../core'

/* Moves the map for a specific times: 
- in a choosen direction (left, right, up, down)
- zoom in or out
 */
export async function mapInteraction (page, direction, times, wait = 250) {
  let dir
  if (direction === 'up') {const dir = 'ArrowUp'}
  else if (direction === 'down') {const dir = 'ArrowDown'}
  else if (direction === 'left') {const dir = 'ArrowLeft'}
  else if (direction === 'right') {const dir = 'ArrowRight'}
  else if (direction === 'in') {const dir = '+'}
  else if (direction === 'out') {const dir = '-'}
  await page.focus('#map')
  await page.waitForTimeout(wait)
  var i = 0;
  for (i = 0; i < times; i++) {
    await page.keyboard.press(dir)
    await page.waitForTimeout(wait)
  }
}

/* Zooms the map to a specific level
 */
export async function zoomToLevel (page, level, wait = 250) {
  const zoom = await core.getFromStore(page, 'mapActivity.zoom')
  const diff = level-zoom;
  const action = (level > zoom) ? 'in':'out';
  await mapInteraction(page, action, Math.abs(diff),500)
  await page.waitForTimeout(wait)
}