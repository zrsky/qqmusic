<template>
	<div class="no-result">
		<img class='icon' src="./no-result@2x.png" alt="">
		<p class="title">{{title}}</p>
	</div>
</template>
<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.no-result
	  margin: 40% auto
	  text-align: center
	  .icon
	    width: 80px
	    height: 80px
	  .title
	    color: rgba(255,255,255,0.3)
	    font-size: 14px
	    margin-top: 30px
</style>