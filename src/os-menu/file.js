module.exports = file

function file (wm) {
  return {
    label: 'File',
    submenu: [
      {
        label: 'Open URL',
        accelerator: 'Ctrl+Space',
        click: () => {
          wm.send('search:open', { query: '', search: '' })
        }
      },
      {
        label: 'New Tab',
        accelerator: 'CmdOrCtrl+t',
        click: function (item, window) {
          wm.send('tabs:newTab')
        }
      },
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+n',
        click: function (item, window) {
          wm.createWindow()
        }
      },
      {
        label: 'New Private Window',
        accelerator: 'shift+CmdOrCtrl+n',
        click: function (item, window) {
          wm.createPrivateWindow()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Show Tab Menu',
        accelerator: 'CmdOrCtrl+Space',
        click: () => {
          wm.send('search:open', { search: '' })
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Print',
        accelerator: 'CmdOrCtrl+p',
        click: function (item, window) {
          wm.send('tabs:print')
        }
      }
    ]
  }
}
