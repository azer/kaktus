const { Menu } = require("electron")
const file = require("./file")
const edit = require("./edit")
const view = require("./view")
const window = require("./window")
const help = require("./help")
const osx = require("./osx")

module.exports = create

function create (wm) {
  const items = [
    file,
    edit,
    view,
    window,
    help
  ].map(fn => fn(wm))

  const template = dev(wm, osx(wm, items))

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function dev (wm, template) {
  if (!wm.developerMode) return template

  template[3].submenu.push({ separator: true })
  template[3].submenu.push({
    label: 'Inspect Kaktüs',
    click: (item, focusedWindow) => {
      if (focusedWindow) focusedWindow.toggleDevTools()
    }
  })



  return template
}
