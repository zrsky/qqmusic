<template>
	<transition name="fade">
		<div class="playlist-wrapper" v-if="showFlag" @click="hide()">
			<div class="playlist" @click.stop>
				<div class="list-header">
					<h1 class="title">
						<i class="icon icon-sequence"></i>
						<span class="text">{{modeText}}</span>
						<span class="clear" @click="showConfirm">
							<i class="icon-clear"></i>
						</span>
					</h1>
				</div>
				<div class="list-content">
					<scroll :data="playlist" ref="scroll">
						<transition-group ref="list" name="list" tag="ul">
							<li :key="song.id" class="item" ref="item" v-for="(song,index) in playlist" @click="selectItem(song,index)">
								<i class="current" :class="iconPlay(song)"></i>
								<span class="text">{{song.name}}</span>
								<span class="like" @click.stop="changeFavorite(song)">
									<i :class="getFavoriteIcon(song)"></i>
								</span>
								<span class="delete" @click.stop="deleteOne(song)">
									<i class="icon-delete"></i>
								</span>
							</li>
						</transition-group>
					</scroll>
				</div>
				<div class="list-operate">
					<div class="add">
						<i class="icon-add"></i>
						<span class="text">添加歌曲到列表</span>
					</div>
				</div>
				<div class="list-close" @click="hide">
					<span>关闭</span>
				</div>
			</div>
			<confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @clearSong="clearSong"></confirm>
		</div>
	</transition>
</template>
<script>
	import {mapGetters,mapMutations,mapActions} from 'vuex'
	import Scroll from 'base/scroll/scroll'
	import confirm from 'base/confirm/confirm'
	import {playMode} from 'common/js/config'
	import {playerMixin} from 'common/js/mixin'

	export default {
		mixins: [playerMixin],
		data() {
			return {
				showFlag: false,
			}
		},
		computed: {
			...mapGetters([
					'playlist',
					'currentSong',
					'currentIndex',
					'mode'
				]),
			modeText() {
		        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
			}
		},
		methods: {
			deleteOne(song) {
				this.deleteOneSong(song)
				if(this.playlist.length <= 0) {
					this.hide();
					this.setPlayState(false);
				}
			},
			clearSong() {
				this.clearSongList();
				this.hide();
				// this.setPlayState(false);
			},
			showConfirm() {
				this.$refs.confirm.show();
			},
			selectItem(song,index) {
				let findIndex = this.playlist.findIndex((item) => {
					return item.id === song.id;
				})
				if(findIndex == this.currentIndex) {
					return;
				}
				this.setCurrentIndex(index);
				this.setPlayState(true);
			},
			scrollCurrentIndex(current) {
				let index = this.playlist.findIndex((song) => {
		          return current.id === song.id
						})
						console.log(index)
				this.$refs.scroll.scrollToElement(this.$refs.scroll.$el.children[0].children[index],300)
			},
			iconPlay(song) {
				return this.currentSong.id == song.id ? 'icon-play' : '';
			},
			show() {
				this.showFlag = true;
				setTimeout(() => {
					this.refresh();
					this.scrollCurrentIndex(this.currentSong);
				}, 50)
			},
			hide() {
				this.showFlag = false;
				console.log(this.showFlag)
			},
			refresh() {
				this.$refs.scroll.refresh();
			},
			...mapMutations({
				setCurrentIndex: 'SET_CURRENT_INDEX',
				setPlayState: 'SET_PLAYING_STATE'
			}),
			...mapActions([
					'deleteOneSong',
					'clearSongList'
				])
		},
		components: {
			Scroll,
			confirm
		},
		watch: {
			currentSong(newVal, oldVal) {
				if(!newVal.id) {
					return;
				}
				if(!this.showFlag || newVal.id === oldVal.id) {
					return;
				}
				setTimeout(() => {
					this.scrollCurrentIndex(newVal);
				}, 20)
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.playlist-wrapper
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  z-index: 1000000000
  background: rgba(0,0,0,.3)
  &.fade-enter-active, &.fade-leave-active
    transition: opacity .3s
    .playlist
      transition: all .3s
  &.fade-enter, &.fade-leave-to
    opacity: 0
    .playlist
      transform: translate3d(0, 100%, 0)
  .playlist
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    background: #333
	.list-header
	    position: relative
	    padding: 20px 30px 10px 20px
	    .title
	      display: flex
	      align-items: center
	      .icon
	        margin-right: 10px
	        font-size: 30px
	        color: rgba(255,205,49,.5)
	      .text
	        flex: 1
	        font-size: 14px
	        color: hsla(0,0%,100%,.5)
	      .clear
	        position: relative
	        .icon-clear
	          font-size: 14px
	          color: hsla(0,0%,100%,.3)
	.list-content
	  max-height: 240px
	  overflow: hidden
	  .item
	    display: flex
	    align-items: center
	    height: 40px
	    padding: 0 30px 0 20px
	    overflow: hidden
	    &.list-enter-active, &.list-leave-active
	      transition: all .1s
	    &.list-enter, &.list-leave-to
	      height: 0
	    .current
	      flex: 0 0 20px
	      width: 20px
	      font-size: 12px
	      color: rgba(255,205,49,.5)
	    .text
	      flex: 1
	      text-overflow: ellipsis
	      overflow: hidden
	      white-space: nowrap
	      font-size: 14px
	      color: hsla(0,0%,100%,.3)
	    .like
	      position: relative
	      margin-right: 15px
	      font-size: 12px
	      color: #ffcd32
				.icon-favorite
					color: red
	    .delete
	      position: relative
	      font-size: 12px
	      color: #ffcd32
	.list-operate
	  width: 140px
	  margin: 20px auto 30px
	  .add
	    display: flex
	    align-items: center
	    padding: 8px 16px
	    border: 1px solid hsla(0,0%,100%,.5)
	    border-radius: 100px
	    color: hsla(0,0%,100%,.5)
	    .icon-add
	      margin-right: 5px
	      font-size: 10px
	    .text
	      font-size: 12px
	.list-close
	  text-align: center
	  line-height: 50px
	  background: #222
	  font-size: 16px
	  color: hsla(0,0%,100%,.5)
.scroll-wrapper
  max-height: 240px
</style>