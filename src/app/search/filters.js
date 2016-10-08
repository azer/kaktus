module.exports = {
  isUnique
}

function isUnique () {
  const dict = {}
  return (row) => {
    if (!row || !row.url || dict[row.url]) return false
    dict[row.url] = true
    return true
  }
}
