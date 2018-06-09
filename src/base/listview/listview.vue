<template>
	<scroll :data="data" ref="scroll" @scroll="scroll" :probeType="3" :listenScroll="listenScroll">
		<ul class="list-group">
			<li v-for="group in data" ref="listGroupLi">
				<h2 class="title">{{group.key}}</h2>
				<ul class="list-group-item">
					<li v-for="item in group.items" class="item" @click="selectItem(item)">
						<img class="avatar" v-lazy="item.avatar" alt="">
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart.stop.prevent="onTouchStart($event)" @touchmove.stop.prevent="onTouchMove($event)">
			<ul>
				<li class="list-shortcut-item" v-for="(item, index) in shortcutList" ref="listShortcutItem" :data-index="index" :class="{'current':currentIndex == index}">
					{{item}}
				</li>
			</ul>
		</div>
		<!-- <div class="fixed-title" ref="fixedTitle" v-show="fixedTitle">
			{{fixedTitle}}
		</div> -->
	</scroll>
</template>
<script>
	import Scroll from "base/scroll/scroll";
    import {getData} from "common/js/dom.js";
    let ANCHOR_HEIGHT = 16;
    let FIXED_HEIGHT = 30;
	export default {
		data() {
			return {
				scrollY: -1,
				currentIndex: 0,
				// fixedTitle: '热门',
				diff: 0,
				listenScroll: true
			}
		},
		props: {
			data: {
				type: Array,
				default: []
			}
		},
		computed: {
			shortcutList() {
				return this.data.map((group) => {
					return group.key.substr(0,1);
				})
			},
			// fixedTitle() {
		 //       if (this.scrollY > 0) {
		 //         return ''
		 //       }
		 //       console.log(this.currentIndex)
		 //       return this.data[this.currentIndex] ? this.data[this.currentIndex].key : ''
		 //    }
		},
		created() {
			this.touch = {};
			this.listHeight = [];
			this.scrollY = -1;
		},
		methods: {
			onTouchStart(e) {
				let index = getData(e.target, 'index');
				let firstTouch = e.touches[0];
				this.touch.y1 = firstTouch.pageY;
				this.touch.index = parseInt(index);
				// this.$refs.scroll.scrollTo(this.scrollY, 0);
				this.scrollTo(index);
			},
			onTouchMove(e) {
				let firstTouch = e.touches[0];
				this.touch.y2 = firstTouch.pageY;
				let delta = (this.touch.y2 - this.touch.y1)/ANCHOR_HEIGHT -1 | 0;
				let index = parseInt(this.touch.index) + parseInt(delta);
				this.scrollTo(index);
			},
			scrollTo(index) {
				if(!index) {
					return;
				}
				if(index < 0) {
					index = 0;
				}else if(index > this.listHeight) {
					index == this.listHeight;
				}
				this.scrollY = -this.listHeight[index];
				this.$refs.scroll.scrollToElement(this.$refs.listGroupLi[index], 0);
			},
			scroll(pos) {
				this.scrollY = pos.y;
			},
			_calculateHeight() {
				let height = 0;
				this.listHeight.push(height);
				if(this.$refs.listGroupLi) {
					for(let i = 0; i < this.$refs.listGroupLi.length - 1; i++) {
						height += this.$refs.listGroupLi[i].clientHeight;
						this.listHeight.push(height);
				    }
				}
			},
			selectItem(item) {
				this.$emit("select", item);
			},
			refresh() {
				this.$refs.scroll.refresh();
			}

		},
		components: {
			Scroll
		},
		watch: {
			data() {
		        setTimeout(() => {
		          this._calculateHeight()
		        }, 20)
		    },
			scrollY(newVal) {
				for(let i=0; i<this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if(newVal > 0) {
						this.currentIndex = 0;
						this.fixedTitle = "";
						return;
					}
					if(!height2 || -newVal >= height1 && -newVal < height2) {
						this.currentIndex = i;

						// this.fixedTitle = this.data[i] ? this.data[i].key : '';
						// this.diff = height2 + newVal + 20*i;
						return;
					}
					this.currentIndex = 0;
				}
			},
			// diff(newVal) {
			// 	console.log('diff: '+newVal);
			// 	let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0;
			// 	this.fixedTop = fixedTop;
			// 	console.log('fixedTop: '+fixedTop)
			// 	this.$refs.fixedTitle.style.transform = `translate3d(0,${fixedTop}px,0)`;
			// }
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
    .list-group
      margin-top: -11px
      background: #222
      color: rgba(255,255,255,0.5)
      .title
        font-size: 12px
        padding-left: 20px
        background: #333
        height: 30px
        line-height: 30px
        font-weight: normal
      .list-group-item
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
        .item
          padding: 20px 0 0 30px
          display: flex
          align-items: center
    .list-shortcut
      position: fixed
      top: 50%
      right: 0
      color: rgba(255, 255, 255, .5)
      transform: translateY(-40%)
      font-size: 12px
      background: #000
      padding: 14px 3px
      text-align: center
      border-radius: 7px
      .list-shortcut-item
        margin-top: 2px
        &.current
          color: #ffcd32
    .fixed-title
      position: fixed
      top: 83px
      color: rgba(255,255,255,.5)
      font-size: 12px
      background: #333
      width: 100%
      height: 30px
      line-height: 30px
      padding-left: 20px

</style>