<template>
	<div class="loading-container">
		<img class="icon" src="./loading.gif" height="30" width="30">
		<p class="text">{{text}}</p>
	</div>
</template>
<script>
	export default {
		props: {
			text: {
				type: String,
				default: '正在加载......'
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.loading-container
	  text-align: center
	  margin-top: 40%
	  color: #fff

</style>