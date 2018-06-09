<template>
	<div class="player-wrapper" v-show="this.playlist.length > 0">
		<transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
			<div class="normal-player" v-show="this.fullScreen">
			<div class="background">
				<img :src="currentSong.image" width="100%" height="100%">
			</div>
			<div class="top">
				<div class="back" @click="back">
					<i class="icon-back"></i>
				</div>
				<h1 class="title">{{currentSong.name}}</h1>
				<h2 class="subtitle">{{currentSong.singer}}</h2>
			</div>
			<div class="middle" @touchstart.stop="middleTouchStart" @touchmove.stop="middleTouchMove" @touchend="middleTouchEnd">
				<div class="middle-l" ref="middleL">
					<div class="cd-wrapper" ref="cdWrapper">
						<div class="cd" :class="cdClass">
							<img :src="currentSong.image" class="image">
						</div>
					</div>
					<div class="playing-lyric-wrapper">
						<div class="play-lyric">{{playLylic}}</div>
					</div>
				</div>
				<div class="middle-r" ref="middleR">
					<scroll ref="scroll" :data="currentLyric && currentLyric.lines">
						<div v-if="currentLyric && currentLyric.lines" class="lyric-wrapper">
								<p v-for="(line, index) in currentLyric.lines" class="text" :class="{'current': lineNum==index}" ref="lineLyric">{{line.txt}}</p>
						</div>
					</scroll>
				</div>
			</div>
			<div class="bottom">
				<div class="dot-wrapper">
					<span class="dot" :class="{'active':currentShow=='cd'}"></span>
					<span class="dot" :class="{'active':currentShow=='lyric'}"></span>
				</div>
				<div class="progress-wrapper">
					<span class="time time-l">{{format(currentTime)}}</span>
					<div class="progress-bar-wrapper">
						<div class="progress-bar" ref="progressBar">
							<div class="bar-inner" ref="barInner" @touchstart.stop="progressTouchStart" @touchmove.stop="progressTouchMove" @touchend.stop="progressTouchEnd" @click="progressClick">
								<div class="progress" ref="progress"></div>
								<div class="progress-btn-wrapper">
									<div class="progress-btn" ref="progressBtn"></div>
								</div>
							</div>
						</div>
					</div>
					<span class="time time-r">{{format(currentSong.duration)}}</span>
				</div>
				<div class="operators">
					<div class="icon i-left"><i :class="playIcon" @click="changeMode"></i></div>
					<div class="icon i-left"><i @click="prev" class="icon-prev"></i></div>
					<div class="icon i-center"><i :class="iconPlay" @click="play"></i></div>
					<div @click="next" class="icon i-right"><i class="icon-next"></i></div>
					<div class="icon i-right"><i class="icon-not-favorite"></i></div>
				</div>
			</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!this.fullScreen" @click="open">
			<div class="icon">
				<img :class="cdClass" :src="currentSong.image" width="40" height="40" class="image">
			</div>
			<div class="text">
				<h2 class="name">{{currentSong.name}}</h2>
				<p class="desc">{{currentSong.singer}}</p>
			</div>
			<div class="control">
				<div class="progress-circle" @click.stop="play">
					<progress-circle :percent="percent"></progress-circle>
					<i class="icon-mini" :class="miniIconPlay"></i>
				</div>
			</div>
			<div class="control" @click.stop="showList">
				<i class="icon-playlist"></i>
			</div>
		</div>
		</transition>
		<!-- <div class="playlist-wrapper"> -->
		<playlist ref="playlist"></playlist>
		<!-- </div> -->
		<audio ref="audio" src="http://dl.stream.qqmusic.qq.com/C400002MPYSq3TdCOS.m4a?vkey=C9AC473DCCBC5D09629AD8011CB950767EF0EB7ECF730363363C04FC9C1F64791C201AE7E1D2B3A6605D8BCF4AB80A15A52F2EBE257F4505&guid=6538918968&uin=1027106581&fromtag=66" @play="ready" @error="error" @timeupdate="updateTime" @ended="ended"></audio>
	</div>
</template>
<script>
	import {mapGetters, mapMutations} from 'vuex'
	import animations from 'create-keyframe-animation'
	import progressCircle from 'base/progress-circle/progress-circle'
	import {playMode} from 'common/js/config'
	import {shuffle} from 'common/js/utils'
	import {Base64} from 'js-base64'
	import lyricParser from 'lyric-parser'
	import {Lyric} from 'common/js/lyric'
	import Scroll from 'base/scroll/scroll'
	import playlist from 'components/playlist/playlist'

	const progressBarWidth = 16;
	export default {
		data() {
			return {
				currentTime: '0:00',
				percent: 0,
				initiated: false,
				currentLyric: null,
				lineNum: 0,
				playLylic: '',
				currentShow: 'cd'
			}
		},
		computed: {
			...mapGetters ([
				'fullScreen',
				'playlist',
				'currentSong',
				'playing',
				'currentIndex',
				'mode',
				'sequenceList'
			]),
			iconPlay() {
				return this.playing ? 'icon-pause' : 'icon-play';
			},
			miniIconPlay() {
				return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
			},
			cdClass() {
				return this.playing ? 'play' : 'play pause';
			},
			disable() {
				return this.isReady ? '' : 'disable';
			},
			playIcon() {
				return this.mode == playMode.sequence ? 'icon-sequence' : this.mode == playMode.loop ? 'icon-loop' : 'icon-random';
			}
		},
		created() {
			this.touch = {};
			this.middleTouch = {};
		},
 		methods: {
			back() {
				this.setFullScreen(false);
			},
			open() {
				this.setFullScreen(true);
			},
			enter(done) {
				let {x,y,scale} = this._getPosAndScale();
				let animation = {
					0: {
						transform: `translate3d(${x}px, ${y}px, scale(${scale}))`
					},
					60: {
						transform: 'translate3d(0,0,0) scale(1.2)'
					},
					100: {
						transform: 'translate3d(0,0,0) scale(1)'
					}
				}
				animations.registerAnimation({
					name: 'move',
					animation,
					presets: {
						duration: 400,
						easing: 'linear',
					}
				})
				animations.runAnimation(this.$refs.cdWrapper, 'move', done);
			},
			afterEnter() {
				animations.unregisterAnimation('move')
				this.$refs.cdWrapper.style.transition = '';
			},
			leave(done) {
				this.$refs.cdWrapper.style.transition = "all .4s";
				const {x, y, scale} = this._getPosAndScale();
				this.$refs.cdWrapper.style.transform = `translate3d(-${x}px, ${y}px, 0) scale(${scale})`;
				this.$refs.cdWrapper.addEventListener('transitionend', done)
			},
			afterLeave() {
				this.$refs.cdWrapper.style.transition = "";
				this.$refs.cdWrapper.style.transform = "";
			},
			play() {
				console.log(this.currentIndex)
				this.setPlayState(!this.playing);
				if(this.currentLyric) {
					this.currentLyric.togglePlay()
				}
			},
			prev() {
				let index = this.currentIndex;
				if(index == 0) {
					index = this.playlist.length - 1;
				} else if(index > 0) {
					index -= 1;
				}
				this.setCurrentIndex(index);
				if(!this.playing) {
					this.play()
				}
			},
			next() {
				let index = this.currentIndex;
				if(index == this.playlist.length - 1) {
					index = 0;
				}else if(index >= 0 && index < this.playlist.length - 1) {
					index += 1;
				}
				this.setCurrentIndex(index);
				if(!this.playing) {
					this.play()
				}
			},
			ready() {

			},
			error() {
			},
			ended() {
				let index = this.currentIndex >= this.playlist.length ? 0 : this.currentIndex + 1;
				console.log(index)
				if(this.mode == playMode.loop) {
					this.loop()
				} else {
				    this.setCurrentIndex(this.currentIndex + 1)
				}
			},
			loop() {
		        this.$refs.audio.currentTime = 0
		        this.$refs.audio.play()
		        this.setPlayState(true)
		        if (this.currentLyric) {
		          this.currentLyric.seek(0)
		        }
		      },
			updateTime(e) {
				this.currentTime = e.target.currentTime;
				let duration = this.currentSong.duration;
				this.percent = e.target.currentTime / duration;
			},
			format(interval) {
				let minutes = interval / 60 | 0;
				let seconds = interval % 60 | 0;
				return minutes + ':' + this._pad(seconds);
			},
			_pad(num, n=2) {
				let len = num.toString().length;
				if(len < n) {
					num = '0' + num;
					len += 1;
				}
				return num;
			},
			progressTouchStart(e) {
				this.initiated = true;
				this.touch.pageX1 = e.touches[0].pageX;
				this.touch.left = this.$refs.progress.clientWidth;

			},
			progressTouchMove(e) {
				if(!this.initiated) {
					return;
				}
				this.touch.pageX2 = e.touches[0].pageX;
				let width = this.touch.left + this.touch.pageX2- this.touch.pageX1;
				let offsetWidth = Math.min(this.$refs.barInner.clientWidth-progressBarWidth, Math.max(0,width));
				this.touch.offsetWidth = offsetWidth;
				this._offset(offsetWidth);
			},
			progressTouchEnd() {
				this.initiated = false;
				let percent = this.triggerPercent(this.touch.offsetWidth);
				this.changeCurrentTime(percent);
			},
			changeCurrentTime(percent) {
				this.$refs.audio.currentTime = percent * this.currentSong.duration;
			},
			_offset(offsetWidth) {
				this.$refs.progress.style.width = `${offsetWidth}px`;
				this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
			},
			triggerPercent(offsetWidth) {
				this.percent = offsetWidth / (this.$refs.barInner.clientWidth-progressBarWidth)
				return this.percent;
			},
			progressClick(e) {
				let rect = this.$refs.progressBar.getBoundingClientRect();
				let offsetWidth = e.pageX - rect.left;
				let percent = this.triggerPercent(offsetWidth);
				this.changeCurrentTime(percent);
				this.currentLyric.seek(this.$refs.audio.currentTime*1000)
			},
			changeMode() {
				let num = this.mode;
				num = (num + 1) % 3;
				this.setPlayMode(num);
				let list = null;
				let sequenceList = [...this.sequenceList];
				if(num === playMode.random) {
					list = shuffle(sequenceList);
				} else {
					list = [...this.sequenceList];
				}
				this.setIndex(list);
				this.setPlaylist(list);
			},
			setIndex(list) {
				let index = list.findIndex((val) => {
					return val.id === this.currentSong.id
				})
				this.setCurrentIndex(index);
			},
			getLyric() {
				let lyric = Base64.decode(Lyric());
				this.currentLyric = new lyricParser(lyric, this.handler)
				if(this.playing) {
					this.currentLyric.play();
				}
			},
			handler({lineNum,txt}) {
				this.lineNum = lineNum;
				this.playLylic = txt;
				if(lineNum > 5) {
					let lineEl = this.$refs.lineLyric[lineNum-5];
					this.$refs.scroll.scrollToElement(lineEl,1000);
				} else {
					this.$refs.scroll.scrollTo(0, 0, 1000);
				}
			},
			middleTouchStart(e) {
				this.middleTouch.initiated = true;
				const touch = e.touches[0];
				this.middleTouch.startX = touch.pageX;
				this.middleTouch.startY = touch.pageY;
				// console.log('x: '+touch.pageX)
				// console.log('y: '+touch.pageY)
			},
			middleTouchMove(e) {
				if(!this.middleTouch.initiated) {
					return;
				}
				const touch = e.touches[0];
				const deltaX = touch.pageX - this.middleTouch.startX;
				const deltaY = touch.pageY - this.middleTouch.startY
				const diff = Math.abs(deltaY) - Math.abs(deltaY);
				if(diff > 0) {
					return;
				}
				const left = this.currentShow == 'cd' ? 0 : -window.innerWidth;
				const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))

				this.middleTouch.percent = Math.abs(offsetWidth / window.innerWidth);
				const opacity = 1 - this.middleTouch.percent;
				const time = 0;
				this.$refs.middleR.style.transition = `all ${time}s`;
				this.$refs.middleL.style.transition = `all ${time}s`;
				this.$refs.middleR.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
				this.$refs.middleL.style.opacity = `${opacity}`;
			},
			middleTouchEnd() {
				let offsetWidth = 0;
				let opacity = 0;
				const time = 0.3;
				if(this.currentShow == 'cd') {
					if(this.middleTouch.percent > 0.1) {
						offsetWidth = -window.innerWidth;
						opacity = 0;
						this.currentShow = 'lyric';
					} else {
						offsetWidth = 0;
						opacity = 1;
					}
				} else if(this.currentShow == 'lyric') {
					if(this.middleTouch.percent < 0.9) {
						offsetWidth = 0;
						opacity = 1;
						this.currentShow = 'cd';
					} else {
						offsetWidth = -window.innerWidth;
						opacity = 0;
					}
				}
				this.$refs.middleR.style.transition = `all ${time}s`;
				this.$refs.middleL.style.transition = `all ${time}s`;
				this.$refs.middleR.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
				this.$refs.middleL.style.opacity = `${opacity}`;
				this.middleTouch.initiated = false;
				// setTimeout(() => {
				// 	this.refresh();
				// }, 20)
			},
			refresh() {
				this.$refs.scroll.refresh();
			},
			showList() {
				this.$refs.playlist.show();
			},
			_getPosAndScale() {
				const targetWidth = 40;
				const paddingLeft = 40;
				const paddingBottom = 30;
				const paddingTop = 80;
				const width = window.innerWidth * 0.8;
				const x = width / 2 - paddingLeft;
				const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
				const scale = targetWidth / width;

				return {
					x,
					y,
					scale
				}
			},
			...mapMutations({
				setFullScreen: 'SET_FULL_SCREEN',
				setPlayState: 'SET_PLAYING_STATE',
				setCurrentIndex: 'SET_CURRENT_INDEX',
				setPlayMode: 'SET_PLAY_MODE',
				setPlaylist: 'SET_PLAYLIST'
			})
		},
		watch: {
			currentSong(newSong, oldSong) {
				if(!newSong.id) {
					return;
				}
				if(newSong.id === oldSong.id) {
					return;
				}
				if(this.currentLyric) {
					this.currentLyric.stop();
				}
				this.$nextTick(() => {
					this.$refs.audio.load();
					this.$refs.audio.play();
					this.getLyric();
				})
			},
			playing(newPlaying) {
				const audio = this.$refs.audio;
				this.$nextTick(() => {
					newPlaying ? audio.play() : audio.pause()
				})
			},
			percent(newPercent) {
				if(newPercent > 0 && !this.initiated) {
					let width = this.$refs.barInner.clientWidth - progressBarWidth;
					let offsetWidth = Math.min(width, newPercent * width);
					this._offset(offsetWidth);
				}
			}
		},
		components: {
			progressCircle,
			Scroll,
			playlist
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">

	.normal-player
	  position: fixed
	  left: 0
	  right: 0
	  top: 0
	  bottom: 0
	  z-index: 10000000
	  background: #222
	  .background
	    position: absolute
	    left: 0
	    top: 0
	    width: 100%
	    height: 100%
	    z-index: -1
	    opacity: .6
	    filter: blur(20px)
	  .top
	    margin-bottom: 25px
	    .back
	      position: absolute
	      top:0
	      left: 6px
	      z-index: 50
	      .icon-back
	        display: block
	        padding: 9px
	        font-size: 22px
	        color: #ffcd32
	        transform: rotate(-90deg)
	    .title
	      width: 80%
	      color: #fff
	      font-size: 18px
	      text-align: center
	      font-weight: normal
	      margin: 8px auto 0
	      text-overflow: ellipsis
	      overflow: hidden
	      white-space: nowrap
	    .subtitle
	      color: #fff
	      font-weight: normal
	      text-align: center
	      font-size: 14px
	      margin: 8px auto 0
	      width: 80%
	  .middle
	    width: 100%
	    position: fixed
	    top: 80px
	    bottom: 162px
	    .middle-l
	      position: relative
	      display: inline-block
	      verticle-align: top
	      height: 0
	      padding-top: 80%
	      width: 100%
	      .cd-wrapper
	        position: absolute
	        top: 0
	        width: 80%
	        height: 100%
	        left: 10%
	        .cd
	          width: 100%
	          height: 100%
	          border: 10px solid rgba(255,255,255,0.1)
	          border-radius: 50%
	          box-sizing: border-box
	          &.play
	            animation: rotate 20s linear infinite
	          &.pause
	            animation-play-state: paused
	          .image
	            width: 100%
	            height: 100%
	            border-radius: 50%
	      .playing-lyric-wrapper
	        margin: 30px auto 0 auto
	        width: 80%
	        text-align: center
	        overflow: hidden
	        .play-lyric
	          height: 20px
	          line-height: 20px
	          font-size: 14px
	          color: rgba(255,255,255,0.5)
	    .middle-r
	      height: 100%
	      width: 100%
	      overflow: hidden
	      position: absolute
	      overflow: hidden
	      top: 0
	      margin-left: 100%
	      .lyric-wrapper
	        color: rgba(255,255,255,0.5)
	        font-size: 14px
	        text-align: center
	        width: 100%
	        p.current
	          color: #fff
	  .bottom
	    position: absolute
	    bottom: 50px
	    width: 100%
	    .dot-wrapper
	      text-align: center
	      font-size: 0
	      .dot
	        background: rgba(255,255,255,0.5)
	        width: 8px
	        height: 8px
	        display: inline-block
	        border-radius: 50%
	        margin: 0 3px
	      .active
	        background: rgba(255,255,255,0.8)
	        width: 20px
	        border-radius: 5px
	    .progress-wrapper
	      width: 80%
	      display: flex
	      align-items: center
	      margin: 0 auto
	      padding: 10px 0
	      .time
	        color: #fff
	        width: 30px
	        line-height: 30px
	        display: inline-block
	        font-size: 12px
	      .time-l
	        text-align: left
	      .time-r
	        text-align: right
	      .progress-bar-wrapper
	        flex: 1
	        .progress-bar
	          height: 30px
	          .bar-inner
	            position: relative
	            height: 4px
	            background: rgba(0,0,0,0.3)
	            top: 13px
	            .progress
	              position: absolute
	              height: 100%
	              background: #ffcd32
	            .progress-btn-wrapper
	              position: absolute
	              left: -8px
	              top: -13px
	              .progress-btn
	                background: #ffcd32
	                width: 16px
	                height: 16px
	                border-radius: 50%
	                border: 3px solid #fff
	                box-sizing: border-box
	                position: relative
	                top: 7px
	                left: 7px
	    .operators
	      display: flex
	      text-align: center
	      .icon
	        flex: 1
	        color: #ffcd32
	        font-size: 30px
	        &.disable
	          color: #ccc
	  &.normal-enter-active, &.normal-leave-active
	    transition: all .4s
	    .top, .bottom
	      transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
	  &.normal-enter, &.normal-leave-to
	    opacity: 0
	    .top
	      transform: translate3d(0, -100px, 0)
	    .bottom
	      transform: translate3d(0, 100px, 0)
	.mini-player
	  position: fixed
	  bottom: 0
	  width: 100%
	  height: 60px
	  background: #333
	  display: flex
	  align-items: center
	  z-index: 10000000
	  .icon
	    flex: 0 0 30px
	    padding: 0 10px 0 20px
	    .image
	      border-radius: 50%
	      &.play
	        animation: rotate 4s linear infinite
	      &.pause
	        animation-play-state: paused
	  .text
	    flex: 1
	    display: flex
	    flex-direction: column
	    .name
	      font-size: 14px
	      color: #fff
	      padding: 0
	      margin: 0
	    .desc
	      font-size: 12px
	      color: rgba(255,255,255,0.3)
	      padding: 0
	      margin: 0
	  .control
	    flex: 0 0 30px
	    font-size: 30px
	    padding: 0 10px
	    color: rgba(255,205,49,0.5)
	    .progress-circle
	      position: relative
	      .progress-outer-circle
	        position: absolute
	        top: 0px
	        right: -1px
	  &.mini-enter-active, &.mini-leave-active
	    transition: all .2s
	  &.mini-enter, &.mini.leave-to
	    opacity: 0
	@keyframes rotate
	  0%
	    transform: rotate(0deg)
	  100%
	    transform: rotate(360deg)
</style>