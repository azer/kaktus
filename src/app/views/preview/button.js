const html = require('choo/html')

module.exports = button

function button (caption, icon, onclick) {
  return (state, prev, send) => html`
  <div class="preview-button ${caption.toLowerCase().replace(/[^\w]+/, '-')}"
       onclick=${event => onclick(state, prev, send)}
       title=${caption}>
    <div class="preview-button-icon">
        <i class="fa fa-${icon}" aria-hidden="true"></i>
    </div>
    <div class="preview-button-text">
      ${caption}
    </div>
  </div>
  `
}
