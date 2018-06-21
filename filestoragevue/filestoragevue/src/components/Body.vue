<template>
	<div class="container-fluid" id="container" v-cloak>
				<div class="row">
						<LeftSide></LeftSide>
						<RightSide></RightSide>
			</div>
	</div>
</template>

<script>
import LeftSide from './Left'
import RightSide from './Right'
export default {
	components:{
		LeftSide,
		RightSide
	},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
