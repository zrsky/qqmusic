<template>
	<div class="search-wrapper">
		<div class="search-box-wrapper">
			<search-box @getQuery="getQuery" :placeholder="placeholder" ref="box"></search-box>
		</div>
		<div class="shortcut-wrapper" v-show="!query">
			<div class="hot-key">
				<h1 class="title">热门搜索</h1>
				<ul>
					<li @click="selectHot(key.k)" v-for="key in hotkey" class="item"><span>{{key.k}}</span></li>
				</ul>
			</div>
			<div class="search-history" v-show="searches.length > 0">
				<h1 class="title">
	              <span class="text">搜索历史</span>
	              <span class="clear" @click="clearSearch">
	                <i class="icon-clear"></i>
	              </span>
	            </h1>
	            <div class="search-list-wrapper">
	            	<search-list @delete="deleteSearch" @select="selectItem" :searches="searches"></search-list>
	            </div>
			</div>
		</div>
		<div class="search-result" v-show="query" ref="searchResult">
	      <suggest ref="suggest" :query="query"></suggest>
	    </div>
	    <router-view></router-view>
	</div>
</template>
<script>
	import searchBox from 'base/search-box/search-box'
	import Suggest from 'components/suggest/suggest'
	import searchList from 'base/search-list/search-list'
	import {getHotKey} from 'api/search'
	import {ERR_OK} from 'api/config'
	import {playlistMixin} from 'common/js/mixin'
	import {mapActions, mapGetters} from 'vuex'

	export default {
		mixins: [playlistMixin],
		data() {
			return {
				placeholder: '搜索歌曲、歌手',
				query: '',
				hotkey: [],
				searches: []
			}
		},
		computed: {
			...mapGetters([
					'searchHistory'
				])
		},
		components: {
			searchBox,
			Suggest,
			searchList
		},
		created() {
			this._getHotKey();
			this.searches = this.searchHistory
		},
		methods: {
			getQuery(query) {
				this.query = query;
			},
			_getHotKey() {
				getHotKey().then((data) => {
					if(data.code == ERR_OK) {
						this.hotkey = data.data.hotkey.slice(0,10);
					}
				})
			},
			selectHot(item) {
				this.query = item;
				this.$refs.box.setQuery(item);
			},
			selectItem(item) {
				this.query = item;
				this.$refs.box.setQuery(item);
			},
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : '';
				this.$refs.searchResult.style.bottom = bottom;
			},
			deleteSearch(item) {
				this.deleteSearchHistory(item);
			},
			clearSearch() {
				this.clearSearchHistory();
			},
			...mapActions([
					'deleteSearchHistory',
					'clearSearchHistory'
				])
		},
		watch: {
			searchHistory(newVal) {
				this.searches = this.searchHistory
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.search-wrapper
	  background: #222
	  position: absolute
	  top: 84px
	  width: 100%
	  bottom: 0
	  box-sizing: border-box
	  .search-box-wrapper
	    margin: 20px
	  .shortcut-wrapper
	    .hot-key
	      margin: 0 20px 20px 20px
	      .title
	        padding: 0
	        margin-bottom: 20px
	        font-size: 14px
	        color: rgba(255,255,255,0.5)
	      ul
	        .item
	          display: inline-block
	          color: rgba(255,255,255,0.3)
	          padding: 5px 10px
	          background: #333
	          border-radius: 6px
	          margin: 0 20px 10px 0
	          font-size: 14px
	    .search-history
	      margin: 0 20px
	      .title
	        padding: 0
	        color: rgba(255,255,255,0.5)
	        font-size: 14px
	        display: flex
	        .text
	          flex: 1
	  .search-result
	    position: absolute
	    width: 100%
	    padding: 0 30px
	    box-sizing: border-box
	    top: 84px
	    bottom: 0
	    text-overflow: ellipsis
	    overflow: hidden
	    white-space: nowrap



</style>