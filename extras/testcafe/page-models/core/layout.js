import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class Layout extends BasePage {
  constructor () {
    super()
    // Drawer
    this.leftDrawer = Selector('.q-drawer--left')
    // Openers
    this.leftOpener = Selector('#left-opener')
    this.rightOpener = Selector('#right-opener')
    this.topOpener = Selector('#top-opener')
    this.bottomOpener = Selector('#bottom-opener')
    // Panes
    this.topPane = Selector('#top-pane')
    this.rightPane = Selector('#right-pane')
    this.bottomPane = Selector('#bottom-pane')
    // Fab
    this.fab = Selector('#fab')
    // SignupAlert
    this.signupAlert = VueSelector('k-signup-alert')
  }

  static get ABOUT () {
    return '#about'
  }

  static get LOGOUT () {
    return '#logout'
  }

  // Openers
  async clickLeftOpener (test) {
    await test
      .click(this.leftOpener)
      .wait(500)
  }

  async clickRightOpener (test) {
    await test
      .click(this.rightOpener)
      .wait(500)
  }

  async clickTopOpener (test) {
    await test
      .click(this.topOpener)
      .wait(500)
  }

  async clickBottomOpener (test) {
    await test
      .click(this.bottomOpener)
      .wait(500)
  }

  // Leftdrawer
  async isLeftDrawerOpened () {
    const leftPos = await this.leftDrawer.getBoundingClientRectProperty('left')
    return leftPos >= 0
  }

  async clickLeftDrawer (test, action) {
    await test
      .click(this.leftDrawer.find(action))
      .wait(500)
  }

  // TopPane
  async isTopPaneOpened () {
    const isVisible = await this.topPane.visible
    return isVisible
  }

  async clickTopPane (test, action) {
    await test
      .click(this.topPane.find(action))
      .wait(500)
  }

  // RightPane
  async isRightPaneOpened () {
    const isVisible = await this.rightPane.visible
    return isVisible
  }

  async clickRightPane (test, action) {
    await test
      .click(this.rightPane.find(action))
      .wait(500)
  }

  // BottomPane
  async isBottomPaneOpened () {
    const isVisible = await this.bottomPane.visible
    return isVisible
  }

  async clickBottomPane (test, action) {
    await test
      .click(this.bottomPane.find(action))
      .wait(500)
  }

  // Fab
  async clickFab (test, action) {
    await test
      .click(Selector(action))
      .wait(500)
  }

  async openAndClickFab (test, action) {
    await test
      .click(Selector(this.fab))
      .wait(500)
      .click(this.fab.find(action))
      .wait(500)
  }

  // Misc
  async closeSignupAlert (test) {
    await test
      .click(Selector('#close-signup-alert'))
      .wait(500)
  }

  async closeWelcomeDialog (test) {
    await test
      .click(Selector('.q-dialog .q-card button[type=button]').nth(0))
  }
}
