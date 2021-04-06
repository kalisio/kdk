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
      .wait(1000)
  }

  async clickRightOpener (test) {
    await test
      .click(this.rightOpener)
      .wait(1000)
  }

  async clickTopOpener (test) {
    await test
      .click(this.topOpener)
      .wait(1000)
  }

  async clickBottomOpener (test) {
    await test
      .click(this.bottomOpener)
      .wait(1000)
  }

  // Leftdrawer
  async isLeftPaneOpened () {
    const isVisible = await this.leftPanel.visible
    return isVisible
  }

  async clickLeftPane (test, action) {
    await test
      .click(this.leftPanel.find(`#${action}`))
      .wait(1000)
  }

  // TopPane
  async isTopPaneOpened () {
    const isVisible = await this.topPanel.visible
    return isVisible
  }

  async clickTopPane (test, action) {
    await test
      .click(this.topPanel.find(`#${action}`))
      .wait(1000)
  }

  // RightPane
  async isRightPaneOpened () {
    const isVisible = await this.rightPanel.visible
    return isVisible
  }

  async clickRightPane (test, action) {
    await test
      .click(this.rightPanel.find(`#${action}`))
      .wait(1000)
  }

  // BottomPane
  async isBottomPaneOpened () {
    const isVisible = await this.bottomPanel.visible
    return isVisible
  }

  async clickBottomPane (test, action) {
    await test
      .click(this.bottomPanel.find(`#${action}`))
      .wait(1000)
  }

  // Fab
  async clickFab (test, action) {
    await test
      .click(Selector(action))
      .wait(1000)
  }

  async openAndClickFab (test, action) {
    await test
      .click(Selector(this.fab))
      .wait(1000)
      .click(this.fab.find(`#${action}`))
      .wait(1000)
  }

  // Misc
  async closeSignupAlert (test) {
    await test
      .click(Selector('#close-signup-alert'))
      .wait(1000)
  }

  async closeWelcomeDialog (test) {
    await test
      .click(Selector('.q-dialog .q-card button[type=button]').nth(0))
  }
}
