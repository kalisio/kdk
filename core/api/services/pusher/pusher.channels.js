module.exports = {
  all: (data, context) => context.app.channel('authenticated').filter(connection => false)
}
