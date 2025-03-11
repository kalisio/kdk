module.exports = {
  verticalSeparator: (color = null) => {
    return {
      component: 'QSeparator',
      vertical: true,
      color
    }
  },
  horizontalSeparator: (color = null) => {
    return {
      component: 'QSeparator',
      class: 'full-width',
      style: 'min-height: 1px;',
      color
    }
  }
}