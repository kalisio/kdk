module.exports = [{
  target: '#logout',
  title: 'tours.side-nav.LOGOUT_LABEL',
  content: 'tours.side-nav.SESSION_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#left-opener'
  }
}, {
  target: '#contextual-help',
  content: 'tours.side-nav.CONTEXT_HELP_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#left-opener',
    clickOnNext: '#left-opener'
  }
}, {
  target: '#about',
  content: 'tours.side-nav.ABOUT_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#left-opener',
    clickOnNext: ['#left-opener', '#about', '#left-opener'],
    nextDelay: 500
  }
}, {
  target: '#report-bug',
  content: 'tours.side-nav.BUG_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: ['#ok-action', '#left-opener'],
    previousDelay: 500,
    clickOnNext: ['#ok-action', '#left-opener'],
    nextDelay: 500
  }
}]