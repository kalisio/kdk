export function isTagEqual (tag1, tag2) {
  // If tags already exists in DB directly use IDs for comparison
  if (tag1._id && tag2._id) return (tag1._id.toString() === tag2._id.toString())

  let equal = (tag1.value === tag2.value && tag1.scope === tag2.scope)
  // when context is provided use it as well
  if (tag1.context && tag2.context) {
    equal = equal && (tag1.context.toString() === tag2.context.toString())
  }
  return equal
}
