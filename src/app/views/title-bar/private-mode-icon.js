const html = require('choo/html')

const privateModeIcon = (state, prev, send) => html`
<div class="private-mode-icon" title="Browsing In Private Mode">
  <i class="fa fa-user-secret" aria-hidden="true"></i>
</div>
`

module.exports = privateModeIcon
