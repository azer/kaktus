const html = require('choo/html')

const newTab = (state, prev, send) => html`
<div class="new-tab">
  This is a new tab. Type a URL and go.
</div>
`

module.exports = newTab
