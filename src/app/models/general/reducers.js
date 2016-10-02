module.exports = {
  setPrivateMode,
  setPartitionName,
  setFocusMode
}

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
