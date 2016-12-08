const remote = electronRequire("electron").remote
const clipboard = electronRequire("electron").clipboard

module.exports = show

function show (options, webview, state, send) {
  event.preventDefault()
  create(pick(options)(options, webview, state, send)).popup(remote.getCurrentWindow())
}

function create (list) {
  const m = new remote.Menu()
  for (let item of list) {
    m.append(new remote.MenuItem(item))
  }

  return m
}

function pick (options) {
  if (options.type === 'input' || options.type === 'textarea') return editableMenu
  if (options.href && options.image) return linkAndImageMenu
  if (options.href) return linkMenu
  if (options.image) return imageMenu
  if (options.selection) return selectionMenu
  return defaultMenu
}

function defaultMenu (options, webview, state, send) {
  return [
    {
      label: 'Back',
      click: () => send('tabs:back'),
      enabled: webview.canGoBack()
    },
    {
      label: 'Forward',
      click: () => send('tabs:forward'),
      enabled: webview.canGoForward()
    },
    {
      label: 'Reload',
      click: () => send('tabs:reload')
    },
    { type: 'separator' },
    {
      label: 'Print',
      click: () => send('tabs:print'),
      accelerator: 'CmdOrCtrl+P'
    },
    { type: 'separator' },
    {
      label: 'Inspect',
      click: () => webview.inspectElement(options.x, options.y)
    }
  ]
}

function selectionMenu (options, webview, send) {
  return [
    {
      label: `Copy ${trim(options.selection)}`,
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    },
    { type: 'separator' },
    {
      label: 'Inspect',
      click: () => webview.inspectElement(options.x, options.y)
    }
  ]
}

function editableMenu (options, webview, send) {
  return [
    {
      label: `Cut ${trim(options.selection)}`,
      accelerator: 'CmdOrCtrl+X',
      role: 'cut',
      enabled: !!(options.selection && options.selection.length)
    },
    {
      label: `Copy ${trim(options.selection)}`,
      accelerator: 'CmdOrCtrl+C',
      role: 'copy',
      enabled: !!(options.selection && options.selection.trim().length)
    },
    {
      label: `Paste`,
      accelerator: 'CmdOrCtrl+P',
      role: 'paste',
      enabled: clipboard.readText().length
    },
    { type: 'separator' },
    {
      label: 'Inspect',
      click: () => webview.inspectElement(options.x, options.y)
    }
  ]
}

function linkMenu (options, webview, state, send) {
  return [
    {
      label: 'Open In New Tab',
      click: () => send('tabs:newTab', { url: options.href })
    },
    { type: 'separator' },
    {
      label: 'Copy Link Address',
      click: () => clipboard.writeText(options.href)
    },
    {
      label: `Copy ${trim(options.selection)}`,
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    },
    { type: 'separator' },
    {
      label: 'Inspect',
      click: () => webview.inspectElement(options.x, options.y)
    }
  ]
}

function imageMenu (options, webview, state, send) {
  return [
    {
      label: 'Open Image In New Tab',
      click: () => send('tabs:newTab', { url: options.image })
    },
    {
      label: 'Copy Image Address',
      click: () => clipboard.writeText(options.image)
    },
    { type: 'separator' },
    {
      label: 'Inspect',
      click: () => webview.inspectElement(options.x, options.y)
    }
  ]
}

function linkAndImageMenu (options, webview, state, send) {
  return [
    {
      label: 'Open Link In New Tab',
      click: () => send('tabs:newTab', { url: options.href })
    },
    {
      label: 'Open Image In New Tab',
      click: () => send('tabs:newTab', { url: options.image })
    },
    { type: 'separator' },
    {
      label: 'Copy Link Address',
      click: () => clipboard.writeText(options.href)
    },
    {
      label: 'Copy Image Address',
      click: () => clipboard.writeText(options.image)
    },
    { type: 'separator' },
    {
      label: 'Inspect',
      click: () => webview.inspectElement(options.x, options.y)
    }
  ]
}

function trim (selection) {
  let result = selection.trim()
  if (result.length > 15) {
    return `"${result.slice(0, 12)}..."`
  }

  if (result.length === 0) return ""

  return `"${result}"`
}
