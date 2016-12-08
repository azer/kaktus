const html = require('choo/html')

const reloadButton = (state, prev, send) => html`
  <div class="reload page-button" onclick=${reload(state, send)}>
    ⟳
  </div>
`

const stopButton = (state, prev, send) => html`
  <div class="stop page-button" onclick=${stop(state, send)}>
     ✕
  </div>
`

const either = (state, prev, send) => html`
${state.isLoading ? stopButton(state, prev, send) : reloadButton(state, prev, send)}
`

module.exports = either

function reload (tab, send) {
  return function () {
    send('tabs:reload', {
      tab
    })
  }
}

function stop (tab, send) {
  return function () {
    send('tabs:stop', {
      tab
    })
  }
}
