const meta = require("../db/meta");

module.exports = {
  tab,
  record,
  like,
  popularRecord
}

function tab (row) {
  const result = row.meta || meta.draft(row.url)
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

  const result = row.meta || meta.draft(row.url)
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

function popularRecord (row) {
  if (!row.meta) return null

  const result = row.meta || meta.draft(row.url)
  result.tab = row.tab
  result.like = row.like
  result.record = row
  result.isPopularRecord = true

  delete result.record.meta
  delete result.record.tab
  delete result.record.like

  return result
}
