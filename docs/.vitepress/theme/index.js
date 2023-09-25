import DefaultTheme from 'vitepress/theme'
import HomeFooter from './components/HomeFooter.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('home-footer', HomeFooter)
  }
}
