export async function login (page, email, password, wait = 2000) {
  await page.waitForSelector('#email-field')
  await page.type('#email-field', email)
  await page.waitForSelector('#password-field')
  await page.type('#password-field', password)
  await page.waitForSelector('button')
  await page.click('button')
  await page.waitForTimeout(wait)
}



