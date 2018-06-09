<template>
	<div class="scroll-wrapper" ref="scrollWrapper">
		<slot></slot>
	</div>
</template>
<script>
	import BScroll from "better-scroll";
	export default {
		props: {
			probeType: {
				type: Number,
				default: 1
			},
			click: {
				type: Boolean,
				default: true
			},
			data: {
				type: Array,
				default: null
			},
			listenScroll: {
				type: Boolean,
				default: true
			},
			refreshDelay: {
		        type: Number,
		        default: 20
	      	},
	        pullup: {
	      	  type: Boolean,
	      	  default: false
	        }
		},
		mounted() {
			setTimeout(() => {
				this._initScroll();
				this.refresh();
			},20)

		},
		methods: {
			_initScroll() {
				if(!this.$refs.scrollWrapper) {
					return;
				}
				this.scroll = new BScroll(this.$refs.scrollWrapper, {
						scrollX: false,
						scrollY: true,
						probeType: this.probeType,
						click: this.click
					});
				if(this.listenScroll) {
					this.scroll.on("scroll", (pos) => {
						this.$emit("scroll", pos);
					})
					if(this.pullup) {
						this.scroll.on('scrollEnd', () => {
							let flag = this.scroll.y <= (this.scroll.maxScrollY + 50) ? true: false;
							this.$emit('scrollToEnd', flag)
						})
					}
				}
			},
			//启用better-scroll
			enable() {
				if(!this.scroll) {
					return;
				}
				this.scroll.enable();
			},
			//禁用better-scroll
			disable() {
				if(!this.scroll) {
					return;
				}
				this.scroll.disable();
			},
			refresh() {
				if(!this.scroll) {
					return;
				}
				setTimeout(() => {
					this.scroll.refresh();
					console.log('刷新')
				},100)
			},
			scrollTo() {
				this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
			},
			scrollToElement() {
				this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
			}
		},
		watch: {
			data(newVal,oldVal) {
				if(this.$refs.scrollWrapper && !this.scroll) {
					this._initScroll();
				}
				setTimeout(() => {
		          this.refresh()
		        }, this.refreshDelay)
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.scroll-wrapper
	  height: 100%
	  position: relative
	  width: 100%
	  overflow: hidden
</style>