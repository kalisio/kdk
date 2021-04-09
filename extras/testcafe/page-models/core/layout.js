import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class Layout extends BasePage {
  constructor () {
    super()
    // Openers
    this.leftOpener = Selector('#left-opener')
    this.rightOpener = Selector('#right-opener')
    this.topOpener = Selector('#top-opener')
    this.bottomOpener = Selector('#bottom-opener')
    // Panes
    this.leftPanel = Selector('#left-panel')
    this.topPanel = Selector('#top-panel')
    this.rightPanel = Selector('#right-panel')
    this.bottomPanel = Selector('#bottom-panel')
    // Fab
    this.fab = Selector('#fab')
    // SignupAlert
    this.signupAlert = VueSelector('k-signup-alert')
  }

  static get ABOUT () {
    return 'about'
  }

  static get LOGOUT () {
    return 'logout'
  }

  // Openers
  async clickLeftOpener (test) {
    await test
      .click(this.leftOpener)
      .wait(Layout.SHORT_WAIT)
  }

  async clickRightOpener (test) {
    await test
      .click(this.rightOpener)
      .wait(Layout.SHORT_WAIT)
  }

  async clickTopOpener (test) {
    await test
      .click(this.topOpener)
      .wait(Layout.SHORT_WAIT)
  }

  async clickBottomOpener (test) {
    await test
      .click(this.bottomOpener)
      .wait(Layout.SHORT_WAIT)
  }

  // Leftdrawer
  async isLeftPaneOpened () {
    const isVisible = await this.leftPanel.visible
    return isVisible
  }

  async clickLeftPaneAction (test, action) {
    await test
      .click(this.leftPanel.find(`#${action}`))
      .wait(Layout.SHORT_WAIT)
  }

  async clickLeftPaneMenuEntry (test, menu, entry) {
    await this.clickLeftPaneAction(test, menu)
    await test
      .click(Selector(`#${entry}`))
      .wait(Layout.SHORT_WAIT)
  }

  // TopPane
  async isTopPaneOpened () {
    const isVisible = await this.topPanel.visible
    return isVisible
  }

  async clickTopPaneAction (test, action) {
    await test
      .click(this.topPanel.find(`#${action}`))
      .wait(Layout.SHORT_WAIT)
  }

  async clickTopPaneMenuEntry (test, menu, entry) {
    await this.clickTopPaneAction(test, menu)
    await test
      .click(Selector(`#${entry}`))
      .wait(Layout.SHORT_WAIT)
  }

  // RightPane
  async isRightPaneOpened () {
    const isVisible = await this.rightPanel.visible
    return isVisible
  }

  async clickRightPaneAction (test, action) {
    await test
      .click(this.rightPanel.find(`#${action}`))
      .wait(Layout.SHORT_WAIT)
  }

  // BottomPane
  async isBottomPaneOpened () {
    const isVisible = await this.bottomPanel.visible
    return isVisible
  }

  async clickBottomPaneAction (test, action) {
    await test
      .click(this.bottomPanel.find(`#${action}`))
      .wait(Layout.SHORT_WAIT)
  }

  // Fab
  async clickFab (test, action) {
    await test
      .click(Selector(action))
      .wait(Layout.SHORT_WAIT)
  }

  async openAndClickFab (test, action) {
    await test
      .click(Selector(this.fab))
      .wait(Layout.SHORT_WAIT)
      .click(this.fab.find(`#${action}`))
      .wait(Layout.SHORT_WAIT)
  }

  // Misc
  async closeSignupAlert (test) {
    await test
      .click(Selector('#close-signup-alert'))
      .wait(Layout.SHORT_WAIT)
  }

  async closeWelcomeDialog (test) {
    await test
      .click(Selector('.q-dialog .q-card button[type=button]').nth(0))
  }
}
