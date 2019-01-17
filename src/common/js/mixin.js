import {mapGetters, mapActions} from 'vuex';

export const playlistMixin = {
	computed: {
		...mapGetters([
				'playlist'
			])
	},
	mounted() {
		this.handlePlaylist(this.playlist);
	},
	activated() {
		this.handlePlaylist(this.playlist);
	},
	watch: {
		playlist(newVal) {
			this.handlePlaylist(newVal);
		}
	},
	methods: {
		handlePlaylist() {
			throw new Error('component must implement handlePlaylist method')
		}
	}
}

export const playerMixin = {
	computed: {
		...mapGetters([
			'favoriteList'
		])
	},
	methods: {
		changeFavorite(song) {
			// this.isFavorite = !this.isFavorite;
			if(!this.isFavorite(song)) {
				this.saveFavoriteList(song);
			}else{
				this.deleteFavoriteList(song);
			}
		},

		isFavorite(song) {
			const index = this.favoriteList.findIndex((item) => {
				return item.id === song.id;
			})

			return index > -1;
		},

		getFavoriteIcon(song) {
			if(this.isFavorite(song)) {
				return 'icon-favorite'
			}
			return 'icon-not-favorite'
		},
		
		...mapActions([
			'saveFavoriteList',
			'deleteFavoriteList'
		])
	}
}