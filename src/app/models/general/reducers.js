module.exports = {
  setPrivateMode,
  setPartitionName,
  setFocusMode,
  setFindInPageMode,
  setFindInPageQuery
};

function setPrivateMode (value) {
  return {
    privateMode: value
  }
}

function setPartitionName (name) {
  return {
    partitionName: name
  }
}

function setFocusMode (value) {
  return {
    focusMode: value
  }
}

function setFindInPageMode (value) {
  return {
    findInPageMode: value
  }
}

function setFindInPageQuery (value) {
  return {
    findInPageQuery: value
  }
}
