export const CardSectionProps = {
  title: {
    type: String,
    default: ''
  },
  item: {
    type: Object,
    default: () => null
  },
  actions: {
    type: Array,
    default: () => null
  },
  actionsFilter: {
    type: [String, Array],
    default: () => null
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  }
}