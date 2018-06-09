<template>
	<div class="song-list-wrapper">
		<div class="song-list">
			<ul>
				<li @click="selectItem(song, index)" v-for="(song, index) in songs" class="item">
					<div class="content">
						<h2 class="name">{{song.name}}</h2>
						<p class="desc">{{song.singer}}-{{song.album}}</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			songs: {
				type: Array,
				default: []
			}
		},
		methods: {
			selectItem(song, index) {
				this.$emit('select', song, index);
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.song-list-wrapper
	  padding: 20px 30px
	  .song-list
	    .item
	      display: flex
	      align-items: center
	      box-sizing: border-box
	      height: 64px
	      font-size: 14px
	      .content
	        flex: 1
	        line-height: 20px
	        overflow: hidden
	        .name
	          text-overflow: ellipsis
	          overflow: hidden
	          white-space: nowrap
	          color: #fff
	          font-size: 14px
	          font-weight: normal
	        .desc
	          text-overflow: ellipsis
	          overflow: hidden
	          white-space: white
	          color: #fff
	          margin-top: 4px
	          color: rgba(255,255,255,0.3)
</style>