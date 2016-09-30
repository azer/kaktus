const choo = require("choo")
const html = require("choo/html")
const general = require("./models/general");
const tabs = require("./models/tabs")
const search = require("./models/search")

createMainApp((error, app) => {
  if (error) throw error;
  document.body.appendChild(app.start());
})

function createMainApp (callback) {
  const app = choo()

  app.model(tabs)
  app.model(search)
  app.model(general)

  app.router((route) => [
    route('/', require('./views/main'))
  ])

  callback(undefined, app)
}
