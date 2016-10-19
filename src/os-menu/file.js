module.exports = file

function file (wm) {
  return {
    label: 'File',
    submenu: [
      {
        label: 'Open URL',
        accelerator: 'Ctrl+Space',
        click: () => {
          wm.send('search:open', { query: '' })
        }
      },
      {
        label: 'New Tab',
        accelerator: 'CmdOrCtrl+t',
        click: function (item, window) {
          wm.send('tabs:newTab')
        }
      },
      /*
      Disabled until we store tabs with session ids
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+n',
        click: function (item, window) {
          wm.createWindow()
        }
      },*/
      {
        label: 'New Private Window',
        accelerator: 'shift+CmdOrCtrl+n',
        click: function (item, window) {
          wm.createPrivateWindow()
        }
      },
      {
        label: 'Close Tab',
        accelerator: 'CmdOrCtrl+w',
        click: wm.sendFn('tabs:closeSelectedTab')
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
