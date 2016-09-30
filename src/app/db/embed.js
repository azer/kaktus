const loop = require("parallel-loop");

module.exports = embed;

function embed (fn, params, stores, callback) {
  if (arguments.length === 3) {
    callback = stores
    stores = params
    params = undefined
  }

  const args = params || []

  args.push((error, rows) => {
    if (error) return callback(error)
    if (rows.length === 0) return callback(undefined, rows)

    loop(rows.length, each, errors => {
      if (errors) return callback(errors[0])
      callback(undefined, rows)
    })

    function each (done, index) {
      loop(stores.length, embedEach(rows[index]), done)
    }

    function embedEach(row) {
      return function (done, index) {
        const store = stores[index]
        const key = row[store.foreignKey]

        if (key === undefined) return done()

        store.get(key, (error, result) => {
          if (error) return done(error)
          row[store.foreignName] = result
          done()
        })
      }
    }
  })

  fn.apply(undefined, args)
}
