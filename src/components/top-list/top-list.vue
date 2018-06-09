<template>
	<transition name="slide">
		<music-list :songs="songs" :rank="rank" :title="title" :bgImage="bgImage"></music-list>
	</transition>
</template>
<script>
	import musicList from 'components/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {createSong} from 'common/js/song'
	import {getMusicList} from 'api/rank'
	import {ERR_OK} from 'api/config'

	export default {
		computed: {
			title() {
       		 return this.topList.topTitle
      		},
		    bgImage() {
		      if (this.songs.length) {
		        return this.songs[0].image
		      }
		      return ''
		    },
			...mapGetters([
					'topList'
				])
		},
		data() {
			return {
				songs: [],
				rank: true
			}
		},
		created() {
			this._getMusicList();
		},
		methods: {
			_getMusicList() {
		        if (!this.topList.id) {
		          	this.$router.push('/rank')
		          	return
	        	}
		        getMusicList(this.topList.id).then((res) => {
		            if (res.code === ERR_OK) {
		            	this.songs = this._normalizeSongs(res.songlist)
		            }
		        })
     		},
     		_normalizeSongs(list) {
     			let ret = []
		        list.forEach((item) => {
		          const musicData = item.data
		          if (musicData.songid && musicData.albummid) {
		            ret.push(createSong(musicData))
		          }
		        })
		        return ret
     		}
		},
		components: {
			musicList
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	
</style>