const about = require("./about")

module.exports = osx

function osx (wm, template) {
  if (process.platform != 'darwin') {
    return template
  }

  template.unshift(about(wm))

  template[1].submenu.push({
    type: 'separator'
  })

  template[1].submenu.push({
    label: 'Preferences',
    accelerator: 'CmdOrCtrl+,',
    click: function (item, window) {
    }
  })

  template[3].submenu.push({
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  })

  return template
}
