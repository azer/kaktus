const electron = require("electron")
const ipc = electron.ipcRenderer

window.addEventListener('contextmenu', function (event) {
  event.preventDefault()

  const selection = window.getSelection()

  ipc.sendToHost('context-menu', {
    type: event.target.tagName.toLowerCase(),
    href: event.target.href,
    image: imageURL(event.target),
    x: event.x,
    y: event.y,
    selection: selection ? selection.toString() : null
  })
})

function imageURL (el) {
  if (el.tagName === 'img') return el.src

  const bg = getComputedStyle(event.target).getPropertyValue('background-image')
  if (!/^url\(/.test(bg)) return null
  return bg.slice(5, -2)
}
