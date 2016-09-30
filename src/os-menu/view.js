module.exports = view;

function view (wm) {
  return {
    label: 'View',
    submenu: [
      {
        label: 'Full Screen',
        accelerator: process.platform == 'darwin' ? 'Ctrl+Command+F' : 'F11',
        role: 'togglefullscreen'
      },
      {
        label: 'Focus Mode',
        accelerator: 'CmdOrCtrl+O',
        type: 'checkbox',
        checked: wm.focusMode,
        click: wm.toggleFocusMode.bind(wm)
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
        label: 'Actual size',
        accelerator: 'CmdOrCtrl+0',
        click: wm.sendFn('tabs:resetZoom')
      },
      {
        label: 'Zoom In',
        accelerator: 'CmdOrCtrl+Plus',
        click: wm.sendFn('tabs:zoomIn')
      },
      {
        label: 'Zoom Out',
        accelerator: 'CmdOrCtrl+-',
        click: wm.sendFn('tabs:zoomOut')
      },
      {
        type: 'separator'
      },
      {
        label: 'Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
        click: wm.sendFn('tabs:openDevTools')
      },
      inspectKaktus(wm)
    ]
  }
}

function inspectKaktus (wm) {
  if (!wm.developerMode) return;

  return {
    label: 'Inspect Kaktüs',
    click: (item, focusedWindow) => {
      if (focusedWindow) focusedWindow.toggleDevTools()
    }
  }
}
