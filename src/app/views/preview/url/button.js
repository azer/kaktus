const html = require('choo/html')

module.exports = button

function button (options) {
  return (state, prev, send) => html`
  <div class="preview-button ${options.title.toLowerCase().replace(/[^\w]+/, '-')} ${options.classes ? options.classes.join(' ') : ''}"
       onclick=${event => options.onclick(state, prev, send)}
       title=${options.title}>
    <div class="preview-button-icon">
        <i class="fa fa-${options.icon}" aria-hidden="true"></i>
    </div>
    <div class="preview-button-text">
      <span>${options.title}</span>
    </div>
  </div>
  `
}
