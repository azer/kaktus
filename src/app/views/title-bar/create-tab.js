const html = require('choo/html')

const button = (state, prev, send) => html`
<div class="create-tab-button" title="New Tab" onclick=${createTab(state, prev, send)}>
  <i class="fa fa-plus" aria-hidden="true"></i>
</div>
`

module.exports = button

function createTab (state, prev, send) {
  return function () {
    send('tabs:newTab')
  }
}
