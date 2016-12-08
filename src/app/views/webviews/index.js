const html = require('choo/html')
const showError = require("./error")
const showNewTab = require("./new-tab")
const showWebView = require("./webview")

const contents = (state, prev, send) => html`
<div class="contents">
  ${state.buffers.list.map(b => {
    return content(state.webviews[state.buffers.selected], state, prev, send)
  })}
</div>
`

const content = (webview, state, prev, send) => html`
<div class="content ${webview.error ? 'has-error' : ''} ${webview.selected ? "selected" : ""}" onmousedown=${onFocus(webview, state, prev, send)}>
  ${webview.error ? showError(webview.error, state, prev, send) : null}
  ${webview.isNew ? showNewTab(webview, state, prev, send) : showWebView(webview, state, prev, send)}
</div>
`

module.exports = contents

function onFocus (webview, state, prev, send) {
  return function () {
    if (state.isNew) return
    send('search:quit')
  }
}
