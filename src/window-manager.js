const { BrowserWindow, ipcMain } = require('electron')
const createOSMenu = require('./os-menu')
const partition = require("./app/partition")

const DEV_MODE = process.env.DEV_MODE === 'ON'

const defaultOptions = {
  title: "Kaktüs",
  width: 1000,
  height: 600,
  titleBarStyle: 'hidden-inset',
  icon: `file://${__dirname}/icon.png`,
  webPreferences: {
    partition: partition.window()
  }
}

const privateOptions = {
  title: "Kaktüs Private",
  width: 1000,
  height: 600,
  titleBarStyle: 'hidden-inset',
  icon: `file://${__dirname}/icon.png`,
  webPreferences: {
    partition: partition.window(true)
  }
}

class WindowManager {
  constructor (app) {
    this.app = app
    this.counter = 0
    this.focusMode = false
    this.windows = []
    this.developerMode = DEV_MODE

    this.app.on('ready', () => {
      this.createWindow()
      createOSMenu(this)
    })

    this.app.on('window-all-closed', this.onWindowsClose.bind(this))
    this.app.on('activate', this.onActivate.bind(this))
  }

  _createWindow (options, actions) {
    const win = new BrowserWindow(options)
    win.loadURL(`file://${__dirname}/../build/${ this.developerMode ? "index.dev" : "index" }.html`)

    const ind = this.windows.push(win) - 1
    this.counter++

    win.on('closed', () => {
      this.windows[ind] = null
      this.counter--
    })

    win.webContents.on('did-finish-load', () => {
      actions.forEach(a => this._send(win, a.name, a.payload))
    })

    if (this.developerMode) {
      win.webContents.openDevTools()
    }

    return win
  }

  createWindow () {
    return this._createWindow(defaultOptions, [
      { name: 'buffers:init', payload: { window: this.counter + 1 } },
      { name: 'general:set', payload: { focusMode: this.focusMode } }
    ])
  }

  createPrivateWindow () {
    const partitionName = partition.window(true)
    privateOptions.webPreferences.partition = partitionName

    return this._createWindow(privateOptions, [
      { name: 'buffers:init', payload: { window: this.counter + 1 } },
      { name: 'general:set', payload: { privateMode: true, focusMode: this.focusMode,  partitionName } }
    ])
  }

  focusedWindow () {
    return BrowserWindow.getFocusedWindow() || this.createWindow()
  }

  _send (window, name, payload) {
    window.webContents.send('action', {
      name,
      payload
    })
  }

  sendFn (name, payload) {
    return e => {
      this.send(name, payload)
    }
  }

  send (name, payload) {
    this._send(this.focusedWindow(), name, payload)
  }

  sendAllWindows (name, payload) {
    let i = this.windows.length
    while (i--) {
      if (this.windows[i] === null) continue
      this._send(this.windows[i], name, payload)
    }
  }

  toggleFocusMode () {
    this.focusMode = !this.focusMode
    this.sendAllWindows('general:setFocusMode', this.focusMode)
  }

  onWindowsClose () {
    if (process.platform !== 'darwin') {
      this.app.quit()
    }
  }

  onActivate () {
    if (this.counter < 1) {
      this.createWindow()
    }
  }
}

module.exports = WindowManager
