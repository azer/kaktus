const embed = require("../db/embed")
const anglicize = require("anglicize")
const recent = require("./recent")

const tabs = require("../db/tabs")
const history = require("../db/history")
const likes = require("../db/likes")
const domains = require("../db/domains")
const meta = require("../db/meta")

const filters = require("./filters")
const sort = require("./sort")

module.exports = search

function search (query, callback) {
  if (query.trim().length === 0) {
    return recent(callback)
  }

  embed(meta.search, [anglicize(query)], [history, likes, tabs, domains], (error, result) => {
    if (error) return callback(error)

    callback(undefined, result.filter(filters.isUnique()).filter(filters.isValidMeta).sort(sort).slice(0, 10))
  })
}
