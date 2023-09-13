module.exports = [{
  target: '#manage-account',
  title: 'tours.account.ACCOUNT_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: ['#left-opener', '#manage-account'],
    clickOnPrevious: '#left-opener',
    nextDelay: 500
  },
}, {
  target: '#verify-email-manager',
  title: 'tours.account.VERIFY_EMAIL_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: ['#ok-action', '#left-opener'],
    previousDelay: 500
  },
}, {
  target: '#token-field',
  title: 'tours.account.TOKEN_FIELD_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#resend-verify-signup',
  title: 'tours.account.RESEND_VERIFY_SIGNUP_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#verify-email',
  title: 'tours.account.CONFIRM_VERIFY_EMAIL_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#password-manager > div > div',
    nextDelay: 500
  },
}, {
  target: '#password-manager',
  title: 'tours.account.PASSWORD_PROCEDURE_LABEL',
  params: {
    placement: 'top',
    clickOn: '#password-manager',
    clickOnPrevious: '#verify-email-manager > div > div',
    previousDelay: 500
  },
}, {
  target: '#oldPassword-field',
  title: 'tours.account.OLD_PASSWORD_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#password-field',
  title: 'tours.account.NEW_PASSWORD_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#confirmPassword-field',
  title: 'tours.account.CONFIRM_NEW_PASSWORD_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#confirmPassword-field-visibility',
  title: 'tours.account.NEW_PASSWORD_VISIBILITY_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#change-password',
  title: 'tours.account.CHANGE_PASSWORD_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#email-manager > div > div',
    nextDelay: 500
  },
}, {
  target: '#email-manager',
  title: 'tours.account.CHANGE_IDENTITY_PROCEDURE_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#password-manager > div > div',
    previousDelay: 500
  },
}, {
  target: '#password-field',
  title: 'tours.account.PASSWORD_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#password-field-visibility',
  title: 'tours.account.PASSWORD_VISIBILITY_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#email-field',
  title: 'tours.account.EMAIL_LABEL',
  params: {
    placement: 'top'
  },
}, {
  target: '#modify-email',
  title: 'tours.account.CHANGE_EMAIL_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#subscriptions-manager > div > div',
    nextDelay: 500
  },
}, {
  target: '#subscriptions-manager',
  title: 'tours.account.SUBSCRIPTIONS_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#email-manager > div > div',
    previousDelay: 500
  },
}, {
  target: '#unsubscribe',
  title: 'tours.account.UNSUBSCRIBE_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#delete-account-manager > div > div',
    nextDelay: 500
  },
}, {
  target: '#delete-account-manager',
  title: 'tours.account.DANGER_ZONE_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#subscriptions-manager > div > div',
    previousDelay: 500
  },
}, {
  target: '#delete-account',
  title: 'tours.account.DELETE_LABEL',
  params: {
    placement: 'top'
  },
}]
