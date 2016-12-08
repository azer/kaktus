const html = require('choo/html')

const closeButton = (tab, prev, send) => html`
<div class="row-button close-button"
     onclick=${close(tab, prev, send)}
     title="Close This Tab">
  ✕
</div>
`

module.exports = closeButton

function close (tab, prev, send) {
  return function () {
    send('tabs:close', tab.id)
  }
}
