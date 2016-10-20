module.exports = add

function add (rows) {
  const result = []
  let historySeparator = false
  let likeSeparator = false
  let tabSeparator = false
  let popularSeparator = false

  for (let row of rows) {
    if (row.tab && !tabSeparator) {
      tabSeparator = true
      result.push({ separator: true, tab: true })
    } else if (!row.tab && row.isPopularRecord && !popularSeparator) {
      popularSeparator = true
      result.push({ separator: true, popular: true })
    } else if (!row.tab && row.like && !likeSeparator) {
      likeSeparator = true
      result.push({ separator: true, like: true })
    } else if (!row.tab && !row.like && !row.isPopularRecord && row.record && !historySeparator) {
      historySeparator = true
      result.push({ separator: true, history: true })
    }

    result.push(row)
    last = row
  }

  return result
}
