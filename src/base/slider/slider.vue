<template>
	<div class="slider-wrapper" ref="sliderWrapper">
		<div class="slider-scroll" ref="sliderScroll">
			<slot></slot>
		</div>
		<div class="dots-wrapper">
			<div class="dot" v-for="(dot,index) in dots" :class="{active: currentPageIndex == index}">

			</div>
		</div>
	</div>
</template>
<script>
	import BScroll from "better-scroll";
	import { addClass } from "common/js/dom.js";

	export default {
		data() {
			return {
				dots: [],
				currentPageIndex: 0,
			}
		},
		props: {
			loop: {
				type: Boolean,
				default: true
			},
			autoPlay: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 4000
			},
		},
		mounted() {
			setTimeout(()=>{
				this._setSliderWidth();
				this._initSlider();
				this._initDots();
				if(this.autoPlay) {
					this._play();
				}
			},20)
			window.addEventListener('resize', () => {
				this._setSliderWidth();
			})
		},
		methods: {
			_setSliderWidth(resize) {
				this.children = this.$refs.sliderScroll.children;
				let sliderWidth = this.$refs.sliderWrapper.clientWidth;
				let width = 0;
				if(!this.children.length) {
					return;
				}
				for( let i = 0; i < this.children.length; i++ ) {
					let child = this.children[i];
					addClass(child, 'slider-item');
					child.style.width = sliderWidth + 'px';
					width += sliderWidth
				}
				if(this.loop) {
					width += 2 * sliderWidth;
					this.$refs.sliderScroll.style.width = width + 'px';
				}
			},
			_initSlider() {
				if(!this.slider) {
					this.slider = new BScroll(this.$refs.sliderWrapper, {
						scrollX: true,
						scrollY: false,
						snap: true, // 手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
						snapLoop: this.loop, // 无缝循环轮播
						snapThreshold: 0.3,
						snapSpeed: 400,
						momentum: false, // 滑动惯性
						click: true
					})
				}
				this.slider.on("scrollEnd",() => {
					this.currentPageIndex = this.slider.getCurrentPage().pageX;
					if(this.loop) {
						this.currentPageIndex -= 1;
					}
					if(this.autoPlay) {
						clearInterval(this.timer);
						this._play();
					}
				})
			},
			_initDots() {
				if(!this.children.length) {
					return;
				}
				this.dots = new Array(this.children.length - 2);
			},
			_play() {
					this.timer = setInterval(() => {
						let pageIndex = this.currentPageIndex + 1;
						// console.log(pageIndex)
						if(this.loop) {
							pageIndex += 1;
						}
						this.slider.goToPage(pageIndex, 0, 400);
					}, this.interval)
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.slider-wrapper
	  min-height: 1px
	  position: relative
	  overflow: hidden
	  .slider-scroll
	  	position: relative
	  	overflow: hidden
	  	white-space: nowrap
	  	.slider-item
	  	  float: left
	  	  box-sizing: border-box
	  	  overflow: hidden
	  	  text-align: center
	  	  a
	  	    text-decoration: none
	  	    width: 100%
	  	    img
	  	      width: 100%
	  .dots-wrapper
	  	position: absolute
	  	bottom: 12px
	  	left: 50%
	  	transform: translateX(-50%)
	  	.dot
	  	  display: inline-block
	  	  background: rgba(255,255,255,.6)
	  	  border-radius: 10px
	  	  width: 8px
	  	  height: 8px
	  	  margin-left: 7px
	  	  &.active
	  	    width: 20px
	  	    background: rgba(255,255,255,.9)
	  	    border-radius: 5px
</style>