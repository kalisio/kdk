export default {
  begin () {
    return '['
  },
  process (info, data) {
    let string = JSON.stringify(data)
    string = string.substring(1, string.length - 1)
    if (info.currentBatch < info.nbBatches - 1) string += ','
    return string
  },
  end () {
    return ']'
  }
}