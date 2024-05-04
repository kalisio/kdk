export const actionProps = {
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: undefined
  },
  iconRight: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'grey-9'
  },
  size: {
    type: String,
    default: 'md'
  },
  outline: {
    type: Boolean,
    default: false
  },
  badge: {
    type: Object,
    default: () => null
  },
  tooltip: {
    type: String,
    default: ''
  },
  disabled: {
    type: [Boolean, Function],
    default: false
  },
  toggled: {
    type: Boolean,
    default: false
  },
  toggle: {
    type: Object,
    default: () => {}
  },
  stack: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  propagate: {
    type: Boolean,
    default: true
  },
  context: {
    type: Object,
    default: () => null
  },
  handler: {
    type: Function,
    default: null
  },
  closePopup: {
    type: [Boolean, Number, String],
    default: false
  },
  dialog: {
    type: Object,
    default: null
  },
  route: {
    type: Object,
    default: () => null
  },
  url: {
    type: String,
    default: null
  },
  renderer: {
    type: String,
    default: 'button',
    validator: (value) => {
      return ['button', 'form-button', 'item', 'fab', 'fab-action', 'tab'].includes(value)
    }
  }
}