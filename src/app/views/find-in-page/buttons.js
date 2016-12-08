const html = require('choo/html')

const buttons = (state, prev, send) => html`
<div class="buttons find-in-page-buttons">
  ${button('Next', state.findInPage.query.trim().length, 'chevron-down', () => send('tabs:findNextInPage', { query: state.findInPage.query }))}
  ${button('Previous', state.findInPage.query.trim().length, 'chevron-up',  () => send('tabs:findPreviousInPage', { query: state.findInPage.query }))}
</div>
`

const button = (title, isActive, cls, onclick) => html`
<div class="button ${isActive ? 'active' : ''}" title=${title} onclick=${onclick}>
  <i class="fa fa-${cls}" aria-hidden="true"></i>
</div>
`

module.exports = buttons
