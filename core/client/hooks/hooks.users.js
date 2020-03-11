export async function checkUnique (hook) {
  const accountService = hook.app.getService('account')
  await accountService.create({
    action: 'checkUnique',
    value: { email: hook.data.email }
  })
  return hook
}
