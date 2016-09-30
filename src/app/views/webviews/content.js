const html = require('choo/html')
const error = require("./error")
const newTab = require("./new-tab")
const webview = require("./webview")

const content = (state, prev, send) => html`
<div class="content ${state.error ? 'has-error' : ''} ${state.isSelected ? "selected" : ""}" onmousedown=${onFocus(state, prev, send)}>
  ${state.error ? error(state.error, state, prev, send) : null}
  ${state.isNew ? newTab(state, prev, send) : webview(state, prev, send)}
</div>
`

module.exports = content

function onFocus (state, prev, send) {
  return function () {
    if (state.isNew) return
    send('search:quit')
  }
}
