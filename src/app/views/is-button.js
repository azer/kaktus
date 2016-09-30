const BUTTON_CLASSES = [
  'button',
  'page-button',
  'like-button',
  'create-tab-button',
  'row-button'
]

module.exports = isButton;

function isButton (el) {
  let i = BUTTON_CLASSES.length
  while (i--) {
    if (el.classList.contains(BUTTON_CLASSES[i]) || el.parentNode.classList.contains(BUTTON_CLASSES[i])) {
      return true
    }
  }

  return false
}
