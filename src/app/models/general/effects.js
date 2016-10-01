module.exports = {
  findInPage
}

function findInPage (payload, state, send, done) {
  send('general:setFindInPageMode', true, done)
  send('search:quit', done)
  selectInput()
}

function selectInput () {
  getInputElement(el => el.select())
}

function focusInput () {
  getInputElement(el => el.focus())
}

function getInputElement (callback) {
  setTimeout(function tryAgain () {
    var input = document.querySelector("input.query")
    if (!input) return setTimeout(tryAgain, 5)
    callback(input)
  }, 5)
}
