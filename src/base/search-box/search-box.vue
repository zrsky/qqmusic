<template>
	<div class="search-box">
		 <i class="icon-search"></i>
	     <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
	     <i @click="clear" v-if="query" class="icon-dismiss"></i>
	</div>
</template>
<script>
 import {debounce} from 'common/js/utils'
	export default {
		data() {
			return {
				query: ''
			}
		},
		props: {
			placeholder: {
				type: String,
				default: ''
			}
		},
		methods: {
			clear() {
				this.query = '';
			},
			getQuery() {
				return this.query
			},
			setQuery(query) {
				this.query = query;
			}
		},
		watch: {
			query(newQuery) {
				// this.$emit('getQuery', newQuery)
				// debounce((newQuery) => {
			        this.$emit('getQuery', newQuery)
			     // }, 200)
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.search-box
	  background: #333
	  height: 40px
	  border-radius: 6px
	  display: flex
	  align-items: center
	  padding: 0 6px
	  .box
	    border-style: none
	    background: #333
	    font-size: 14px
	    margin: 0 5px
	    color: #fff
	    flex: 1
	  .icon-search
	    font-size: 24px
	    color: #222
	  .icon-dismiss
	    font-size: 16px
	    color: #222
</style>