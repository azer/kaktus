const input = require("../../input")

module.exports = {
  enable,
  disable,
  selectInput: input.select.bind(null, 'query')
}

function enable (payload, state, send, done) {
  send('findInPage:setEnabled', true, done)
  send('search:quit', done)
  send('findInPage:selectInput', done)
}

function disable (payload, state, send, done) {
  send('findInPage:setQuery', '', done)
  send('findInPage:setEnabled', false, done)
  send('tabs:quitFindInPage', done)
}
