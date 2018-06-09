<template>
	<div class="recommend">
		<div class="slider" v-if="recommend.length > 0">
			<slider>
				<div v-for="value in recommend">
					<a :href="value.linkUrl">
						<img :src="value.picUrl">
					</a>
				</div>
			</slider>
		</div>
	</div>
</template>
<script>
	import { getRecommend } from "api/recommend.js";
	import { ERR_OK } from "api/config.js";
	import Slider from "base/slider/slider";

	export default {
		data () {
			return {
				recommend: [],
			}
		},
		created () {
			this._getRecommend();
		},
		methods: {
			_getRecommend: function() {
				getRecommend().then((data) => {
					if( data.code == ERR_OK ) {
						this.recommend = data.data.slider;
					}
				})
			},
		},
		components: {
			Slider
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	div
		color:#000
</style>