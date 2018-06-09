import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
export function deleteFromSearch(arr, compare) {
  let index = arr.findIndex(compare);
  if(index > -1) {
    arr.splice(index, 1);
  }
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromSearch(searches, (item) => {
    return item == query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return [];
}