const DOMMethods = require("./dom-methods")
const defaults = require("./defaults")

module.exports = DOMMethods
module.exports.setProps = setProps
module.exports.resetProps = resetProps

function resetProps (payload, state, send, done) {
  setProps({
    id: payload.id,
    props: defaults()
  }, state, send, done)
}

function setProps (payload, state, send, done) {
  if (!state[payload.id]) return send('errors:new', { msg: `Buffer ID does not match any webview.` })

  for (let key of payload.props) {
    state[payload.id][key] = payload.props[key]
  }

  send('webviews:set', state, done)
}
