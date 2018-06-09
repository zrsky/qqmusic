<template>
	<div class="rank-wrapper" ref="rank">
		<scroll :data="songs" ref="scroll">
			<ul class="rank-list-ul">
				<li class="rank-list" v-for="song in songs" @click="selectItem(song)">
					<img width="100px" height="100px" v-lazy="song.picUrl" class="image">
						<ul class="song-list-ul">
							<li v-for="(list, index) in song.songList" class="song-list-item">{{index+1}} {{list.songname}}-{{list.singername}}</li>
						</ul>
				</li>
			</ul>
		</scroll>
		<router-view></router-view>
	</div>
</template>
<script>
    import {getTopList} from 'api/rank'
    import {ERR_OK} from 'api/config'
    import Scroll from 'base/scroll/scroll'
    import {mapMutations} from 'vuex'
    import {playlistMixin} from 'common/js/mixin'

	export default {
		mixins: [playlistMixin],
		data() {
			return {
				songs: []
			}
		},
		created() {
			this._getTopList();
		},
		methods: {
			_getTopList() {
				getTopList().then((data) => {
					if(data.code == ERR_OK) {
						this.songs = data.data.topList;
						this.$refs.scroll.refresh()
					}
				})
			},
			selectItem(song) {
				this.setTopList(song);
				this.$router.push(`/rank/${song.id}`)
			},
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '59px' : '';
				this.$refs.rank.style.bottom = bottom;
				this.$refs.scroll.refresh();
			},
			...mapMutations({
				setTopList: 'SET_TOP_LIST'
			})
		},
		components: {
			Scroll
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.rank-wrapper
	  background: #222
	  position: fixed
	  top: 80px
	  bottom: 0
	  width: 100%
	  .rank-list-ul
	    padding: 0
	    .rank-list
	      display: flex
	      padding-top: 20px
	      margin: 0 20px
	      height: 100px
	      .song-list-ul
	        padding: 10px 20px
	        box-sizing: border-box
	        flex-direction: column
	        height: 100%
	        flex: 1
	        background: #333
	        color: rgba(255,255,255,0.3)
	        font-size: 12px
	        overflow: hidden
	        .song-list-item
	          text-overflow: ellipsis
	          overflow: hidden
	          white-space: nowrap
	          line-height: 26px


</style>