module.exports = {
  kCore: {
    dependencies: []
  },
  kMap: {
    dependencies: ['kCore']
  },
  kano: {
    application: true,
    dependencies: ['kCore', 'kMap']
  }
}
