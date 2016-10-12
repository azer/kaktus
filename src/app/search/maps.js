module.exports = {
  tab,
  record,
  like
}

function tab (row) {
  if (!row.url) return null

  const result = row.meta
  result.record = row.record
  result.like = row.like
  result.tab = row
  result.isTabRecord = true

  delete result.tab.meta
  delete result.tab.record
  delete result.tab.like

  return result
}

function record (row) {
  if (!row.meta) return null

  const result = row.meta
  result.tab = row.tab
  result.like = row.like
  result.record = row
  result.isHistoryRecord = true

  delete result.record.meta
  delete result.record.tab
  delete result.record.like

  return result
}

function like (row) {
  const result = row.meta
  result.tab = row.tab
  result.record = row.record
  result.like = row
  result.isLikeRecord = true
  return result
}
