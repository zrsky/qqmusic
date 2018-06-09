<template>
	<div class="singer_wrapper" ref="singerWrapper">
		<loading v-show="singer.length == 0"></loading>
		<list-view :data="singer" @select="selectSinger" ref="list"></list-view>
		<router-view></router-view>
	</div>
</template>
<script>
	import {getSingerList} from "api/singer";
	import {ERR_OK} from "api/config";
	import listView from "base/listView/listview";
	import Loading from "base/loading/loading";
	import {mapMutations} from 'vuex';
	import {playlistMixin} from 'common/js/mixin'

	let HOT_NAME = "热门";
	let HOT_SINGER_LEN = 10;

	export default {
		mixins: [playlistMixin],
		data() {
			return {
				singer: [],
			}
		},
		created() {
			this._getSingerList();
		},
		methods: {
			_getSingerList() {
				getSingerList().then((data) => {
					if(data.code == ERR_OK) {
						this.singer = this._normalizeSongs(data.data.list);
					}
				})
			},
			_normalizeSongs(data) {
				let map = {
					hot: {
						key: HOT_NAME,
						items: []
					}
				}
				data.forEach((item,index)=>{
					if(index < HOT_SINGER_LEN) {
						map.hot.items.push({
							id: item.Fsinger_mid,
							name: item.Fsinger_name,
							avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
						})
					}
					let Findex = item.Findex;
					if(!map[Findex]) {
						map[Findex] = {
							key: Findex,
							items: []
						}
					}
					map[Findex].items.push({
								id: item.Fsinger_mid,
								name: item.Fsinger_name,
								avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
							})
				})

				let ret = [];
				let hot = [];
				for(let key in map) {
					if(map[key].key.match(/[a-zA-Z]/)) {
						ret.push(map[key])
					} else if (map[key].key == HOT_NAME) {
						hot.push(map[key])
					}
				}
				ret.sort((a,b) => {
					return a.key.charCodeAt(0) - b.key.charCodeAt(0);
				})
				return hot.concat(ret);
			},
			selectSinger(singer) {
				this.$router.push({
					path: `/singer/${singer.id}`
				});
				this.setSinger(singer)
			},
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? 59 : 0;
				this.$refs.singerWrapper.style.bottom = `${bottom}px`;
				this.$refs.list.refresh();
			},
			...mapMutations({
					setSinger: 'SET_SINGER'
				})
		},
		components: {
			listView,
			Loading
		}
	}
</script>
<style  lang="stylus" rel="stylesheet/stylus">
	.singer_wrapper
	  position: fixed
	  top: 84px
	  width: 100%
	  bottom: 0
	  background: #222 
</style>