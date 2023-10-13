
import Papa from 'papaparse'

export default {
  begin (info) {
    return
  },
  process (info, data) {
    let csv
    if (info.currentBatch === 0) csv = Papa.unparse(data)
    else csv = Papa.unparse(data, { header: false })
    csv += '\n'
    return csv
  },
  end (info) {
    return
  }
}
