module.exports = {
  verticalSeparator: (color = 'grey-4') => {
    return {
      component: 'QSeparator',
      vertical: true,
      color
    }
  },
  horizontalSeparator: (color = 'grey-4') => {
    return {
      component: 'QSeparator',
      class: 'full-width',
      style: 'min-height: 1px;',
      color
    }
  },
  visible: (element, rule) => {
    return Object.assign(element, { visible: rule })
  }
}