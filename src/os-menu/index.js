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

  const template = osx(wm, items)
  const menu = Menu.buildFromTemplate(items)
  Menu.setApplicationMenu(menu)
}
