const embed = require("../db/embed")
const filters = require("./filters")
const maps = require("./maps")
const sort = require("./sort")

const tabs = require("../db/tabs")
const history = require("../db/history")
const likes = require("../db/likes")
const domains = require("../db/domains")
const meta = require("../db/meta")

module.exports = popular

function popular (callback) {
  embed(history.popular, [{ limit: 50 }], [likes, meta, tabs, domains], function (error, rows) {
    if (error) return callback(error)

    callback(undefined, rows.filter(filters.isUnique()).filter(filters.isValidRecord).slice(0, 10).map(maps.popularRecord))
  })
}
