module.exports = {
  get,
  select,
  focus
}

function select (key) {
  get(key, el => el.select())
}

function focus (key) {
  get(key, el => el.focus())
}

function get (key, callback) {
  setTimeout(function tryAgain () {
    var input = document.querySelector(`input.${key}`)
    if (!input) return setTimeout(tryAgain, 5)
    callback(input)
  }, 5)
}
