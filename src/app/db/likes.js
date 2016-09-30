const db = require("./db")
const urls = require("./urls");
const store = db.store('likes', {
  key: { keyPath: "url" }
})

module.exports = {
  foreignName: 'isLiked',
  foreignKey: 'url',
  store,
  like,
  unlike,
  get
};

function like (url, callback) {
  store.add({
    url: urls.clean(url),
    likedAt: Date.now()
  }, callback)
}

function unlike (url, callback) {
  store.delete(urls.clean(url), callback)
}

function get (url, callback) {
  store.get(urls.clean(url), (error, result) => {
    if (error) return callback(error)
    callback(undefined, !!result)
  })
}
