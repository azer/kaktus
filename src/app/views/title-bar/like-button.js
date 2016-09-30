const html = require('choo/html')

const likeButton = (state, prev, send) => html`
<div class="like-button ${state.isLiked ? "liked" : "" }" onclick=${toggleLike(state, prev, send)}>
  <i class="fa fa-heart" aria-hidden="true"></i>
</div>`

module.exports = likeButton

function toggleLike (tab, prev, send) {
  return function () {
    send(`tabs:${tab.isLiked ? "un" : ""}like`, tab)
  }
}
