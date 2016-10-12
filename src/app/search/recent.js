const tabs = require("../db/tabs")
const history = require("../db/history")
const likes = require("../db/likes")
const meta = require("../db/meta")
const domains = require("../db/domains")

const embed = require("../db/embed")
const filters = require("./filters")
const maps = require("./maps")
const sort = require("./sort")

const RECENT_RESULTS_MIN_LEN = 15

module.exports = recent

// Returns all open tabs, and may include some items from likes and history if there is room for stuff
function recent (callback) {
  recentTabs((error, tabs) => {
    if (error) return callback(error)
    if (tabs.length >= RECENT_RESULTS_MIN_LEN) return callback(undefined, tabs.sort(sort))

    recentLikes((error, likes) => {
      if (error) return callback(error)

      recentHistory((error, history) => {
        if (error) return callback(error)

        callback(undefined, tabs.concat(likes)
                                .concat(history)
                                .filter(filters.isUnique())
                                .sort(sort)
                                .slice(0, 10))
      })
    })
  })
}

// basically all tabs
function recentTabs (callback) {
  let result = []

  embed(tabs.all, [likes, meta, history, domains], function (error, rows) {
    if (error) return callback(error)

    callback(undefined, rows.map(maps.tab))
  })
}

function recentHistory (callback) {
  embed(history.all, [{ limit: 50 }], [likes, meta, tabs, domains], function (error, rows) {
    if (error) return callback(error)
    callback(undefined, rows.map(maps.record))
  })
}

function recentLikes (callback) {
  embed(likes.all, [{ limit: 50 }], [history, meta, tabs, domains], function (error, rows) {
    if (error) return callback(error)
    callback(undefined, rows.map(maps.like))
  })
}
