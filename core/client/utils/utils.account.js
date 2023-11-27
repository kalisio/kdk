import { api } from '../api.js'

export async function verifyEmail (email) {
  const response = await api.getService('account').verifyEmail({ email })
  return response.status === 200
}

export function resendVerifySignup (email) {
  return api.getService('account').create({
    action: 'resendVerifySignup',
    value: { email }
  })
}

export function verifySignup (token, email) {
  return api.getService('account').create({
    action: 'verifySignupShort',
    value: { user: { email }, token }
  })
}

export function sendResetPassword (email) {
  return api.getService('account').create({
    action: 'sendResetPwd',
    value: { email }
  })
}

export function resetPassword (email, token, password) {
  return api.getService('account').create({
    action: 'resetPwdShort',
    value: { user: { email }, token, password }
  })
}

export function changePassword (email, oldPassword, password) {
  return api.getService('account').create({
    action: 'passwordChange',
    value: { user: { email }, oldPassword, password }
  })
}

export function sendChangeIdentity (oldEmail, email, password) {
  return api.getService('account').create({
    action: 'identityChange',
    value: { user: { email: oldEmail }, changes: { email }, password }
  })
}

export function changeIdentity (token) {
  return verifySignup(token)
}
