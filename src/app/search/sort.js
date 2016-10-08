module.exports = sort

/**
 * Sort given database rows. They can be;
 * - History record
 * - Tab
 * - Like
 */
function sort (a, b) {
  // rule 1: tabs first
  if (a.tab && !b.tab) {
    return -1
  }

  if (b.tab && !a.tab) {
    return 1
  }

  // rule 2: if both tab, higher lastSeenAt first
  if (a.tab && b.tab && a.tab.lastSeenAt > b.tab.lastSeenAt) {
    return -1
  }

  if (a.tab && b.tab && a.tab.lastSeenAt < b.tab.lastSeenAt) {
    return 1
  }

  // rule 4: liked first
  if (a.like && !b.like) {
    return -1
  }

  if (b.like && !a.like) {
    return 1
  }

  // rule 5: if both liked, higher likedAt first
  if (a.like && b.like && a.like.likedAt < b.like.likedAt) {
    return 1
  }

  if (a.like && b.like && a.like.likedAt > b.like.likedAt) {
    return -1
  }

  // ?
  if (!b.record) {
    return 1
  }

  if (!a.record) {
    return -1
  }

  // rule 5: latest visited URLs comes first
  if (a.record.lastUpdatedAt > b.record.lastUpdatedAt) {
    return -1
  }

  if (a.record.lastUpdatedAt < b.record.lastUpdatedAt) {
    return 1
  }

  return 0
}
