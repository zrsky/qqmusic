<template>
	<transition name="confirm-fade" v-if="showFlag">
		<div class="confirm" @click.stop="hide">
			<div class="confirm-wrapper" @click.stop>
				<div class="confirm-content">
					<p class="text">{{text}}</p>
					<div class="operate">
						<div class="operate-btn left" @click="hide">{{cancelBtnText}}</div>
						<div class="operate-btn" @click="clearSong">{{confirmBtnText}}</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
	export default {
		data() {
			return {
				showFlag: false
			}
		},
		props: {
			text: {
		        type: String,
		        default: ''
		     },
		     confirmBtnText: {
		        type: String,
		        default: '确定'
		     },
		     cancelBtnText: {
		        type: String,
		        default: '取消'
		     }
		},
		methods: {
			show() {
				this.showFlag = true;
			},
			hide() {
				this.showFlag = false;
			},
			clearSong() {
				this.$emit('clearSong');
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(0,0,0,.3)
    &.confirm-fade-enter-active
      animation: confirm-fadein .3s
      .confirm-content
        animation: confirm-zoom .3s
	.confirm-wrapper
	  position: fixed
	  top: 50%
	  left: 50%
	  transform: translate3d(-50%,-50%,0)
	  background: #333
	  border-radius: 13px
	  .confirm-content
	    width: 270px
	    background: #333
	    border-radius: 13px
	    .text
	      padding: 19px 15px
	      line-height: 22px
	      text-align: center
	      font-size: 18px
	      color: hsla(0,0%,100%,.5)
	      margin: 0
	    .operate
	      display: flex
	      align-items: center
	      font-size: 18px
	      border-top: 1px solid rgba(0,0,0,.3)
	      .operate-btn
	        text-align: center
	        flex: 1
	        color: hsla(0,0%,100%,.3)
	        padding: 10px 0
	        &.left
	          border-right: 1px solid rgba(0,0,0,.3)
  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1
  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)

</style>