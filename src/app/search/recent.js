const tabs = require("../db/tabs")
const history = require("../db/history")
const likes = require("../db/likes")
const meta = require("../db/meta")
const domains = require("../db/domains")
const popular = require("./popular")

const embed = require("../db/embed")
const filters = require("./filters")
const maps = require("./maps")
const sort = require("./sort")

const RECENT_RESULTS_MIN_LEN = 15

module.exports = recent

// Returns all open tabs, and may include some items from likes and history if there is room for stuff
function recent (callback) {
  allTabs((error, tabs) => {
    if (error) return callback(error)
    if (tabs.length >= RECENT_RESULTS_MIN_LEN) return callback(undefined, tabs.sort(sort))

    popular((error, popularSites) => {
      if (error) return callback(error)

      recentLikes((error, likes) => {
        if (error) return callback(error)

        recentHistory((error, history) => {
          if (error) return callback(error)

          const combined = combine([
            { list: tabs },
            { list: likes, max: 3 },
            { list: history, max: 5 },
            { list: popularSites, max: 3 }
          ])

          callback(undefined, combined.sort(sort).slice(0, 15))
        })
      })
    })
  })
}

// basically all tabs
function allTabs (callback) {
  let result = []

  embed(tabs.all, [likes, meta, history, domains], function (error, rows) {
    if (error) return callback(error)

    callback(undefined, rows.map(maps.tab))
  })
}

function recentHistory (callback) {
  embed(history.all, [{ limit: 50 }], [likes, meta, tabs, domains], function (error, rows) {
    if (error) return callback(error)
    callback(undefined, rows.filter(r => !r.domain || !r.domain.privateMode).map(maps.record))
  })
}

function recentLikes (callback) {
  embed(likes.all, [{ limit: 50 }], [history, meta, tabs, domains], function (error, rows) {
    if (error) return callback(error)
    callback(undefined, rows.map(maps.like))
  })
}

function combine (lists) {
  const added = {}
  const result = []

  for (l of lists) {
    let i = -1
    let len = l.list.length

    while (++i < len) {
      let row = l.list[i]
      if (!row || (row.tab && row.tab.url.trim() === "")) continue
      if (added[row.url]) continue
      if (l.max && l.counter >= l.max) break
      if (!l.counter) l.counter = 0

      l.counter++
      added[row.url] = true
      result.push(row)
    }
  }

  return result
}
