const tabs = require("./tabs")
const history = require("./history")
const likes = require("./likes")
const meta = require("./meta")
const embed = require("./embed")

module.exports = search;

function search (query, callback) {
  if (query.trim().length === 0) {
    return defaultResults(callback)
  }

  embed(meta.search, [query], [history, likes, tabs], callback)
}

function defaultResults (callback) {
  const isUnique = _isUnique()

  embed(tabs.all, [likes, meta, history], function (error, result) {
    if (error) return callback(error)

    result = result.map(mapTab).filter(el => el)

    if (result.length >= 10) {
      return callback(undefined, result.sort(sort).filter(isUnique))
    }

    recent((error, rows) => {
      if (error) return callback(undefined, result)

      for (let row of rows) {
        if (!row) continue
        if (row.tab) continue
        result.push(row)

        if (result.length >= 10) break
      }

      return callback(undefined, result.filter(isUnique).sort(sort))
    })
  })

}

function recent (callback) {
  embed(history.all, [{ limit: 50 }], [likes, meta, tabs], function (error, rows) {
    if (error) return callback(error)
    callback(undefined, rows.map(mapRecord))
  })
}

function mapTab (row) {
  if (!row.url) return null

  const result = row.meta
  result.record = row.record
  result.isLiked = row.isLiked
  result.tab = row

  delete result.tab.meta
  delete result.tab.record
  delete result.tab.isLiked

  return result
}

function mapRecord (row) {
  if (!row.meta) return null

  const result = row.meta
  result.tab = row.tab
  result.isLiked = row.isLiked
  result.record = row

  delete result.record.meta
  delete result.record.tab
  delete result.record.isLiked

  return result
}

function sort (a, b) {
  if (a.tab && !b.tab) {
    return -1
  }

  if (a.isLiked && !b.isLiked) {
    return -1
  }

  if (a.tab && b.tab && a.tab.lastSeenAt > b.tab.lastSeenAt) {
    return -1
  }

  if (b.tab && !a.tab) {
    return 1
  }

  if (b.isLiked && !a.isLiked) {
    return 1
  }

  if (a.tab && b.tab && a.tab.lastSeenAt < b.tab.lastSeenAt) {
    return 1
  }

  if (!b.record) {
    return 1
  }

  if (!a.record) {
    return -1
  }

  if (a.record.lastUpdatedAt > b.record.lastUpdatedAt) {
    return -1
  }

  if (a.record.lastUpdatedAt < b.record.lastUpdatedAt) {
    return 1
  }

  return 0
}

function _isUnique () {
  const dict = {}
  return (row) => {
    if (!row || !row.url || dict[row.url]) return false
    dict[row.url] = true
    return true
  }
}
