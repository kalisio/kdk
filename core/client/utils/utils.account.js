import { api } from '../api.js'

export function resendVerifySignup (email) {
  return api.getService('account').create({
    action: 'resendVerifySignup',
    value: { email }
  })
}

export function verifySignup (token) {
  return api.getService('account').create({
    action: 'verifySignupLong',
    value: token
  })
}

export function sendResetPassword (email) {
  return api.getService('account').create({
    action: 'sendResetPwd',
    value: { email }
  })
}

export function resetPassword (token, password) {
  return api.getService('account').create({
    action: 'resetPwdLong',
    value: { token, password }
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
