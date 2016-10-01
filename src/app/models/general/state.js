module.exports = get();

function get () {
  return {
    focusMode: false,
    privateMode: false,
    findInPageMode: false,
    findInPageQuery: '',
    partitionName: 'persist:kaktus'
  };
}
