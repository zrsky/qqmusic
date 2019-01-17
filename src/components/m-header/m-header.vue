<template>
	<div class="header">
		<div class="h-Wrapper">
			<div class="bgImg"></div>
			<h1 class="text">Chicken Music</h1>
			<router-link class="user" tag="div" to="/myHome">
				<i class="icon-mine"></i>
			</router-link>
		</div>
		<tab></tab>
	</div>
</template>
<script>
	import Tab from "components/tab/tab";
	export default {
		components: {
			Tab,
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	// @import '../../common/stylus/mixin'
  .header
	background: #222
	.h-Wrapper
		background: #222
		position: relative
		top: 0
		width: 100%
		height: 44px
		text-align: center
		font-size: 0
		.bgImg
			display: inline-block
			background: url("./logo@2x.png") no-repeat
			background-size: 30px 32px
			width: 30px
			height: 32px
			margin-top: 6px
			margin-right: 6px
		.text
			color: #ffcd32
			font-size: 18px
			display: inline-block
			font-weight: normal
			vertical-align: top
			line-height: 44px
			margin: 0
		.user
			.icon-mine
				position absolute
				top: 12px
				right: 10px
				// background: red
				color: #ffcd32
				font-size: 20px
</style>