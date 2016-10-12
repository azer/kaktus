const now = require("unique-now")
const db = require("./db")
const urls = require("../urls")

const store = db.store('tabs', {
  key: { keyPath: "id" },
  indexes: [
    { name: 'isSelected', options: { unique: false } },
    { name: 'createdAt', options: { unique: false } },
    { name: 'lastSeenAt', options: { unique: false } },
    { name: 'url', options: { unique: false } }
  ]
})

module.exports = {
  foreignName: 'tab',
  foreignKey: 'url',
  store,
  all,
  create,
  select,
  unselect,
  updateURL,
  close,
  get
}

function all (callback) {
  const result = []

  store.cursor((error, row) => {
    if (error) return callback(error)
    if (!row) return callback(undefined, result.sort(compareLastSeen))

    result.push(row.value)
    row.continue()
  })
}

function create (url, callback) {
  if (arguments.length === 1) {
    callback = url
    url = ''
  }

  if (!url || !url.trim()) {
    url = ''
  }

  get(url, (error, tab) => {
    if (error) return callback(error)
    if (!tab) return _create(url, callback)
    callback(undefined, tab.id)
  })
}


function _create (url, callback) {
  store.add({
    id: generateId(),
    createdAt: Date.now(),
    isSelected: 1,
    url
  }, callback)
}

function select (id, callback) {
  unselect(error => {
    if (error) return callback(error)
    _select(id, callback)
  })
}

function unselect (callback) {
  console.log('unselecting ...')

  store.select('isSelected', 1, (error, selectedTab) => {
    if (error) return callback(error)

    if (!selectedTab) return callback()

    console.log('update %s from %d to %d', selectedTab.url, selectedTab.lastSeenAt, Date.now())
    selectedTab.lastSeenAt = Date.now()
    selectedTab.isSelected = 0
    store.update(selectedTab, callback)
  })
}

function get (url, callback) {
  store.select('url', url, callback)
}

function updateURL (id, newURL, callback) {
  store.get(id, (error, rec) => {
    if (error) return callback(error)

    rec.url = urls.clean(newURL)
    store.update(rec, callback)
  })
}

function close (url, callback) {
  store.delete(urls.clean(url), callback)
}

function _select (id, callback) {
  store.get(id, function (error, rec) {
    if (error) return callback(error)
    if (!rec) return callback(new Error('Unexisting tab record.'))

    rec.isSelected = 1
    rec.lastSeenAt = Date.now()

    store.update(rec, callback)
  })
}

function compareLastSeen (a, b) {
  if (a.lastSeenAt < b.lastSeenAt || b.isSelected) {
    return -1
  }

  if (a.lastSeenAt > b.lastSeenAt || a.isSelected) {
    return 1
  }

  return 0
}

function generateId () {
  return `f-${now()}`
}
