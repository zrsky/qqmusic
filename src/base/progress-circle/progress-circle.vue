<template>
	<div class="progress-outer-circle" id="container" ref="outerCircle">
		
	</div>
</template>
<script>
	import Konva from 'konva';
	const width =  30;
	const height =  30;
	const radius = 15;

	export default {
		props: {
			percent: {
				type: Number,
				default: 0
			}
		},
		mounted() {
			// this.$nextTick(() => {
				// this.drawCircle();
			// })
		},
		methods: {
			drawCircle(percent) {
				let stage = new Konva.Stage({
					container: 'container',
					width: width,
					height: height
				});
				let layer = new Konva.Layer();

				let arc = new Konva.Arc({
					x: stage.getWidth() / 2,
				      y: stage.getHeight() / 2,
				      innerRadius: radius - 3,
				      outerRadius: radius,
				      angle: 360 * percent,
				      fill: 'rgba(255,205,49,0.5)',
				      // stroke: 'yellow',
				      strokeWidth: 0,
				      rotation: -100
				});
				layer.add(arc);

				stage.add(layer);
			}
		},
		watch: {
			percent(newPercent) {
				this.drawCircle(newPercent);
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	
</style>