const partition = require("../../partition")

module.exports = get()

function get () {
  return {
    focusMode: false,
    privateMode: false,
    partitionName: partition.window()
  }
}
