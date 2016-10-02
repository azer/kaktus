module.exports = {
  setPreview,
  setQuery,
  setResults,
  setAsOpen,
  setAsClosed
}

function setPreview (tab) {
  return {
    preview: tab
  }
}

function setQuery (query) {
  return {
    query
  }
}

function setAsOpen () {
  return {
    isOpen: true
  }
}

function setAsClosed () {
  return {
    isOpen: false
  }
}

function setResults (results) {
  return {
    results
  }
}
