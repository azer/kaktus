const html = require('choo/html')

const icon = (state, prev, send) => html`
<div class="search-icon">
  <i class="fa fa-search" aria-hidden="true"></i>
</div>
`

const caption = (state, prev, send) => html`
<div class="input-caption">
  Find In Page:
</div>
`

const button = (state, prev, send) => html``

const input = (state, prev, send) => html`
  <input class="query"
    value='${state.general.findInPageQuery}'
    placeholder='${state.general.findInPageQuery || ""}'
    onkeyup=${onKeyUp(state, prev, send)}
    oninput=${onInput(state, prev, send)}
    x-webkit-speech />
`

const findInPage = (state, prev, send) => html`
<div class="title-bar find-in-page">
  ${icon(state, prev, send)}
  ${caption(state, prev, send)}
  ${input(state, prev, send)}
  ${button(state, prev, send)}
</div>
`

module.exports = findInPage

function onInput (state, prev, send) {
  return function (e) {
    send('tabs:findInPage', {
      query: e.target.value
    })
  }
}

function onKeyUp (state, prev, send) {
  return function (e) {
    if (e.keyCode === 27) {
      send('tabs:quitFindInPage')
      return send('general:setFindInPageMode', false)
    }
  }
}
