<template>
	<scroll ref="scroll" @scrollToEnd="searchMore" :data="songs" :listenScroll="listenScroll" :pullup="pullup" :probeType="probeType">
		<ul class="suggest-list" v-show="songs.length > 0">
			<li class="suggest-item" v-for="song in songs" @click="selectItem(song)">
				<div class="icon">
					<i :class="getIconCls(song)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayName(song)"></p>
				</div>
			</li>
			<loading class="loading" :text="text" v-show="check"></loading>
		</ul>
		<div class="no-result-wrapper" v-show="songs.length==0 && !check && !result">
			<no-result :title="title"></no-result>
		</div>
	</scroll>
</template>
<script>
	import Scroll from 'base/scroll/scroll'
	import {search} from 'api/search'
	import {createSong} from 'common/js/song'
	import Loading from 'base/loading/loading'
	import Singer from 'common/js/singer'
	import {mapMutations, mapActions, mapGetters} from 'vuex'
	import noResult from 'base/no-result/no-result'

	const TYPE_SINGER = 'singer'
	const PERPAGE = 20
	let timer = null

	export default {
		data() {
			return {
				zhida: true,
				songs: [],
				listenScroll: true,
				pullup: true,
				probeType: 3,
				check: false,
				text: '',
				result: true,
				title: '抱歉，暂无搜索结果'
			}
		},
		props: {
			query: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapGetters([
					'playlist',
					'searchHistory'
				])
		},
		methods: {
			_search() {
				if(!this.query) {
					return;
				}
				this.page = 1;
				search(this.query, this.page, this.zhida, PERPAGE).then((res) => {
					this.result = res.data.song.list > 0 ? true : false;
					this.songs = this._genResult(res.data);
					this.check = this.checkMore(res.data.song);
				})
			},
			_normalizeSongs(list) {
				let ret = [];
				list.forEach((musicData) => {
					if(musicData.songid && musicData.albummid) {
						ret.push(createSong(musicData))
					}
				})
				return ret;
			},
			_genResult(data) {
				let ret = [];
				if (data.zhida && data.zhida.singerid) {
					ret.push({...data.zhida, ...{type: TYPE_SINGER}});
				}
				if(data.song && data.song.list) {
					ret = ret.concat(this._normalizeSongs(data.song.list))
				}
				return ret;
			},
			getIconCls(item) {
		        if (item.type === TYPE_SINGER) {
		          return 'icon-mine'
		        } else {
		          return 'icon-music'
		        }
		    },
		    getDisplayName(item) {
		    	if(item.type && item.type == TYPE_SINGER) {
		    		return item.singername
		    	} else {
		    		return item.name + '-' + item.singer
		    	}
		    },
		    searchMore(flag) {
		    	clearTimeout(timer);
		   		if(this.check) {
		   			timer = setTimeout(() => {
		   				this.page++;
			   			search(this.query, this.page, this.zhida, PERPAGE).then((res) => {
			   				if(res.data.song.list.length > 0) {
			   					this.songs = this.songs.concat(this._genResult(res.data));
			   				} else {
			   					this.result = false
			   				}
							this.check = this.checkMore(res.data.song);
						})
		   			}, 500)
		   		}
		    },
		    checkMore(list) {
		    	let num = list.curnum + list.curpage * PERPAGE;
		    	return num < list.totalnum
		    },
		    selectItem(song) {
		    	if(song.type == TYPE_SINGER) {
		    		const singer = new Singer({
		    			id: song.singermid,
		    			name: song.singername
		    		})
		    		this.$router.push({
		    			path: `/search/${singer.id}`
		    		});
		    		this.setSinger(singer)
		    	} else {
		    		this.insertSong(song)
		    	}
		    	this.saveSearch(this.query);
		    },
		    refresh() {
		    	this.$refs.scroll.refresh();
		    },
		    saveSearch(query) {
		    	this.saveSearchHistory(query);
		    },
		    ...mapMutations({
		    	setSinger: 'SET_SINGER'
		    }),
		    ...mapActions([
		    		'insertSong',
		    		'saveSearchHistory'
		    	])

		},
		components: {
			Scroll,
			Loading,
			noResult
		},
		watch: {
			query(newVal) {
				if(!newVal) {
					return;
				}
				// setTimeout(()=>{
					this._search();
					this.refresh();
				// },1000)
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.suggest-list
	  .suggest-item
	    color: rgba(255,255,255,0.3)
	    display: flex
	    align-items: center
	    font-size: 14px
	    .icon
	      flex: 0 0 30px
	      width: 30px
	    .name
	      flex: 1
	.loading
	  margin: 0
</style>