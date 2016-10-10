const html = require('choo/html')
const error = require("./error")
const newTab = require("./new-tab")
const webview = require("./webview")

const content = (tab, state, prev, send) => html`
<div class="content ${tab.error ? 'has-error' : ''} ${tab.isSelected ? "selected" : ""}" onmousedown=${onFocus(tab, prev, send)}>
  ${tab.error ? error(tab.error, state, prev, send) : null}
  ${tab.isNew ? newTab(tab, state, prev, send) : webview(tab, state, prev, send)}
</div>
`

module.exports = content

function onFocus (state, prev, send) {
  return function () {
    if (state.isNew) return
    send('search:quit')
  }
}
