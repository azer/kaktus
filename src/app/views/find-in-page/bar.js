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

const button = (state, prev, send) => html`
<div class="quit-find-in-page-button" onclick=${() => send('findInPage:disable')}>
    <i class="fa fa-times" aria-hidden="true"></i>
</div>`

const input = (state, prev, send) => html`
  <input class="query"
    value='${state.findInPage.query}'
    placeholder='${state.findInPage.query || ""}'
    onkeyup=${onKeyUp(state, prev, send)}
    oninput=${onInput(state, prev, send)}
    x-webkit-speech />
`

const bar = (state, prev, send) => html`
<div class="title-bar find-in-page">
  ${icon(state, prev, send)}
  ${caption(state, prev, send)}
  ${input(state, prev, send)}
  ${button(state, prev, send)}
</div>
`

module.exports = bar

function onInput (state, prev, send) {
  return function (e) {
    send('findInPage:setQuery', e.target.value)

    if (e.target.value.trim() === '') {
      return send('tabs:quitFindInPage')
    }

    send('tabs:findInPage', {
      query: e.target.value
    })
  }
}

function onKeyUp (state, prev, send) {
  return function (e) {
    if (e.keyCode === 27) {
      return send('findInPage:disable')
    }

    if (e.keyCode === 13) {
      return send('tabs:findNextInPage', {
        query: e.target.value
      })
    }
  }
}
