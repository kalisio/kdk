export async function login (page, email, password) {
  await page.waitForSelector('#email-field')
  await page.type('#email-field', email)
  await page.waitForSelector('#password-field')
  await page.type('#password-field', password)
  await page.waitForSelector('button')
  await page.click('button')
  await page.waitForTimeout(2000)
}

export async function logout (page) {
  await clickOpener(page, 'left')
  const selector = '#logout'
  await page.waitForSelector(selector)
  await page.click(selector)
  await page.waitForTimeout(1000)
}

export async function clickOpener (page, opener) {
  const selector = `#${opener}-opener`
  await page.evaluate((selector) => document.querySelector(selector).click(), selector)
  await page.waitForTimeout(1000)
}

export async function closeWelcomeBanner (page) {
  const selector = '.q-dialog .q-card button[type=button]'
  await page.waitForSelector(selector)
  await page.click(selector)
}

export async function capture (page, name) {
  await page.screenshot({
    path: `./test/data/screenshots/${name}.png`,
    fullPage: true,
    type: 'png'
  })
}
