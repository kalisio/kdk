export default {
  all: (data, context) => context.app.channel('authenticated').filter(connection => false)
}
