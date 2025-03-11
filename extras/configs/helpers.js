module.exports = {
  vertical_separator: (color = null) => {
    return {
      component: 'QSeparator',
      vertical: true,
      ...(color && color)
    }
  },
  horizontal_separator: (color = null) => {
    return {
      component: 'QSeparator',
      class: 'full-width',
      style: 'min-height: 1px;',
      ...(color && color)
    }
  }
}