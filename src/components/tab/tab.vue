<template>
	<div class="tab">
		<router-link tag="div" to="recommend" class="tab-item">
			<span class="tab-link">推荐</span>
		</router-link>
		<router-link tag="div" to="singer" class="tab-item">
			<span class="tab-link">歌手</span>
		</router-link>
		<router-link tag="div" to="rank" class="tab-item">
			<span class="tab-link">排行</span>
		</router-link>
		<router-link tag="div" to="search" class="tab-item">
			<span class="tab-link">搜索</span>
		</router-link>
	</div>
</template>
<script>
	
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.tab
	  font-size: 16px
	  background: #222
	  margin-top: 10px
	  padding-bottom: 10px
	  display: flex
	  .tab-item
	    color: rgba(255,255,255,0.5)
	    display: inline-block
	    flex: 1
	    text-align:center
	    .tab-link
	      dispaly: inline-block
	      padding: 3px
	    &.router-link-active
	      .tab-link
	         border-bottom: 2px solid #ffcd32
	         color: #ffcd32
</style>