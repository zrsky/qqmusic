import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/utils'
import {saveSearch, deleteSearch, clearSearch, saveFavorite, deleteFavorite, loadFavorite, savePlay, loadPlay} from 'common/js/cache'

function findIndex(arr,song) {
	return arr.findIndex((item) => {
		return item.id == song.id
	})
}
export const selectPlay = function({commit, state}, {list, index}) {
	commit(types.SET_SEQUENCE_LIST, list)
	if(state.mode == playMode.random) {
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST, randomList)
	} else {
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}
export const randomPlay = function({commit, state}, {list}) {
	commit(types.SET_PLAY_MODE, playMode.random);
	let randomList = shuffle(list);
	commit(types.SET_SEQUENCE_LIST, list);
	commit(types.SET_PLAYLIST, randomList);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_CURRENT_INDEX, 0);
	commit(types.SET_PLAYING_STATE, true);

}
export const insertSong = function({commit, state}, song) {
	let playlist = [...state.playlist];
	let sequenceList = [...state.sequenceList];
	let currentIndex = state.currentIndex;

	let currentSong = playlist[currentIndex];

	let fpIndex = findIndex(playlist, song);
	currentIndex++;
	playlist.splice(currentIndex, 0, song);
	if(fpIndex > -1) {
		if(fpIndex< currentIndex) {
			playlist.splice(fpIndex, 1);
			currentIndex--;
		} else {
			playlist.splice(fpIndex + 1, 1);
		}
	}

	let currentSIndex = findIndex(sequenceList, currentSong) + 1
	let findSIndex = findIndex(sequenceList, song);
	sequenceList.splice(currentSIndex, 0, song);

	if(findSIndex > -1) {
		if(findSIndex < currentSIndex) {
			sequenceList.splice(findSIndex, 1);
		} else {
			sequenceList.splice(findSIndex + 1, 1);
		}
	}
	commit(types.SET_PLAYLIST, playlist);
	commit(types.SET_SEQUENCE_LIST, sequenceList);
	commit(types.SET_CURRENT_INDEX, currentIndex);
	commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const saveFavoriteList = function({commit}, song) {
	commit(types.SET_FAVORITE_LIST, saveFavorite(song));
}

export const deleteFavoriteList = function({commit}, song) {
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}

export const loadFavoriteList = function({commit}) {
	commit(types.SET_FAVORITE_LIST, loadFavorite());
}

export const savePlayHistory = function({commit}, song) {
	commit(types.SET_PLAY_HISTORY, savePlay(song));
}

export const loadPlayHistory = function({commit}) {
	commit(types.SET_PLAY_HISTORY, loadPlay());
}

export const deleteOneSong = function ({commit, state}, song) {
	let playlist = [...state.playlist];
	let sequenceList = [...state.sequenceList];
	let currentIndex = state.currentIndex;

	let fpIndex = findIndex(playlist, song)
	if(fpIndex <= -1) {
		return;
	}
	playlist.splice(fpIndex, 1);
	if(fpIndex < currentIndex || fpIndex === playlist.length) {
		currentIndex--;
	}
	let findSIndex = findIndex(sequenceList, song);
	if(findSIndex == -1) {
		return;
	}
	sequenceList.splice(findSIndex, 1);

	commit(types.SET_PLAYLIST, playlist);
	commit(types.SET_SEQUENCE_LIST, sequenceList);
	commit(types.SET_CURRENT_INDEX, currentIndex);
}

export const clearSongList = function({commit}) {
	commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_PLAYING_STATE, false)
}