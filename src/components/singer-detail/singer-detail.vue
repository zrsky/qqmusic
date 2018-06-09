<template>
	<transition name="slider">
		<div class="singer-detail">
			<music-list :title="title" :bgImage="bgImage" :songs="song"></music-list>
		</div>
	</transition>
</template>
<script>
import {mapGetters} from 'vuex';
import {getSingerDetail} from 'api/singer';
import {ERR_OK} from 'api/config';
import {createSong} from 'common/js/song.js';
import musicList from "components/music-list/music-list";

	export default {
		data() {
			return {
				song: [],
			}
		},
		computed: {
			...mapGetters([
				  'singer'
				]),
			bgImage() {
				return this.singer.avatar
			},
			title() {
				return this.singer.name
			}
		},
		created() {
			this._getSongList();
			if(!Object.keys(this.singer).length) {
				this.$router.back();
			}
		},
		methods: {
			_getSongList() {
				if(!this.singer) {
					return;
				}
				getSingerDetail(this.singer.id).then((data) => {
					if(ERR_OK == data.code) {
						this.song = this._normalizeSongs(data.data.list);
					}
				})
			},
			_normalizeSongs(list) {
				let ret = [];
				list.forEach((item,index) => {
					let {musicData} = item;
					if(musicData.songid && musicData.albummid){
						ret.push(createSong(musicData))
					}
				})
				return ret;
			}
		},
		components: {
			musicList
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.singer-detail
	  color: #fff
	  position: fixed
	  z-index: 10000000
	  background: #222
	  top:0
	  left:0
	  bottom:0
	  right:0
	.slider-enter-active, .slider-leave-active
	  transition: all .3s
	.slider-enter, .slider-leave-to
	  transform: translateX(100%)
</style>