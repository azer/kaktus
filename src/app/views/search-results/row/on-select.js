const isButton = require("../../is-button")

module.exports = onSelect

function onSelect (callback) {
  return function (row, prev, send) {
    return function (event) {
      if (isButton(event.target)) {
        return
      }

      send('search:quit')
      callback(row, prev, send)
    }
  }
}
