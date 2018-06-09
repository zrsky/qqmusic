<template>
	<div class="music-list-wrapper">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" :style="bgStyle" ref="bgImage">
			<div class="play-wrapper" ref="play">
				<div class="play">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
			<div class="filter"></div>
		</div>
		<div class="layer" ref="layer"></div>
		<scroll @scroll="scroll" :data="songs" :probeType="3" :listenScroll="listenScroll" class="list" ref="list">
			<song-list @select="selectItem" :songs="songs"></song-list>
			<loading v-show="!songs.length" class="loading"></loading>
		</scroll>
	</div>
</template>
<script>
	import scroll from "base/scroll/scroll";
	import songList from "base/song-list/song-list";
	import loading from "base/loading/loading";
	import {mapActions} from "vuex";
	// import {playlistMixin} from 'common/js/mixin';

	const TOP_HEIGHT = 40;

	export default {
		// mixins: [playlistMixin],
		data() {
			return {
				scrollY: -1,
				listenScroll: true
			}
		},
		props: {
			bgImage: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			songs: {
				type: Array,
				default: []
			}
		},
		created() {
			// this.scrollY = -1;
		},
		mounted() {
			this.imageHeight = -this.$refs.bgImage.clientHeight + TOP_HEIGHT;
			// this.$refs.list.$el.style.top = height + 'px';
		},
		computed: {
			bgStyle() {
				return `background-image:url(${this.bgImage})`
			}
		},
		methods: {
			back() {
				this.$router.back();
			},
			scroll(pos) {
				this.scrollY = pos.y;
			},
			selectItem(song, index) {
				this.selectPlay({
					list: this.songs,
					index
				})
			},
			// handlePlaylist(playlist) {
			// 	console.log('playlist: '+playlist)
			// 	const bottom = playlist.length > 0 ? 80 : '';
			// 	console.log(bottom)
			// 	this.$refs.list.$el.style.bottom = `${bottom}px`;
			// 	this.$refs.list.refresh();
			// },
			...mapActions([
				  'selectPlay'
				])
		},
		components: {
			songList,
			scroll,
			loading
		},
		watch: {
			scrollY(newY) {
				let zIndex = 10;
				let percent = 0;

				if(newY < 0) {
					let transformY = Math.max(this.imageHeight, newY);
					this.$refs.layer.style.transform = `translate3d(0, ${transformY}px, 0)`;
					if(newY < this.imageHeight) {
						zIndex = 10;
						this.$refs.bgImage.style.paddingTop = 0;
						this.$refs.bgImage.style.height = TOP_HEIGHT + 'px';
						this.$refs.play.style.display = "none";
					}else{
						zIndex = 0;
						this.$refs.bgImage.style.paddingTop = '70%';
						this.$refs.bgImage.style.height = 0;
						this.$refs.play.style.display = "block";
					}
				} else {
					this.$refs.layer.style.transform = `translate3d(0, 0, 0)`;
					percent = newY / -this.imageHeight + 1;
					zIndex = 10;
					this.$refs.bgImage.style.transform = `scale(${percent})`;
				}

				this.$refs.bgImage.style.zIndex = zIndex

			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">

	.music-list-wrapper
	  height: 100%
	  position: fixed
	  z-index: 50
	  background: #222
	  top: 0
	  width: 100%
	  .back
	    position: absolute
	    top: 0
	    left: 6px
	    z-index: 50
	    .icon-back
	      color: #ffcd32
	      font-size: 22px
	      padding: 10px
	      display: block
	  .bg-image
	    height: 0
	    background-size: cover
	    padding-top: 70%
	    margin-right: -2px
	    transform-origin: top
	    position: relative
	    width: 100%
	    .filter
	      position: absolute
	      width: 100%
	      height: 100%
	      top: 0
	      background: rgba(7,17,27,0.4)
	    .play-wrapper
	      position: absolute
	      bottom: 20px
	      z-index: 50
	      width: 100%
	      .play
	        box-sizing: border-box
	        width: 135px
	        padding: 7px 0
	        margin: 0 auto
	        text-align: center
	        border: 1px solid #ffcd32
	        color: #ffcd32
	        border-radius: 100px
	        font-size: 0
	        .text
	          display: inline-block
	          vertical-align: middle
	          font-size: 12px
	        .icon-play
	          display: inline-block
	          vertical-align: middle
	          margin-right: 6px
	          font-size: 16px
	  .title
	    position: absolute
	    top: 0
	    left: 10%
	    z-index: 40
	    width: 80%
	    text-overflow: ellipsis
	    overflow: hidden
	    white-space: nowrap
	    font-size: 18px
	    color: #fff
	    text-align: center
	    margin: 0
	    padding-top: 8px
	    font-weight: normal
	  .layer
	    position: absolute
	    height: 100%
	    width: 100%
	    background: #222
	  .list
	    overflow: visible
	    .loading
	      margin-top: 20%
</style>