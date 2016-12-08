const choo = require("choo")
const html = require("choo/html")
const general = require("./models/general")
const buffers = require("./models/buffers")
const meta = require("./models/meta")
const findInPage = require("./models/find-in-page")
const likes = require("./models/likes")
const domains = require("./models/domains")

createMainApp((error, app) => {
  if (error) throw error
  document.body.appendChild(app.start())
})

function createMainApp (callback) {
  const app = choo()

  app.model(buffers)
  app.model(meta)
  app.model(general)
  app.model(findInPage)
  app.model(likes)
  app.model(domains)

  app.router((route) => [
    route('/', require('./views/main'))
  ])

  callback(undefined, app)
}
