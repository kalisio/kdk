// Helper function to check wether an element exists
// see: https://github.com/puppeteer/puppeteer/issues/545
export async function elementExists (page, selector) {
  return !!(await page.$(selector))
}

// Helper function to check wether an element is visible
// see: https://github.com/puppeteer/puppeteer/issues/545
export async function isElementVisible (page, selector) {
  return page.evaluate((selector) => {
    const element = document.querySelector(selector)
    if (!element) return false
    const style = window.getComputedStyle(element)
    return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
  }, selector)
}

