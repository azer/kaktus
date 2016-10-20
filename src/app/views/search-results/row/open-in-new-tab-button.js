const html = require('choo/html')

const openInNewTabButton = (row, prev, send) => html`
<div class="row-button open-in-new-tab-button"
     onclick=${openInNewTab(row, prev, send)}
     title="Open This In New Tab">
  <i class="fa fa-plus" aria-hidden="true"></i>
</div>
`

module.exports = openInNewTabButton

function openInNewTab (row, prev, send) {
  return function () {
    send('search:quit')
    send('tabs:newTab', { url: `${row.record.protocol}://${row.record.url}` })
  }
}
