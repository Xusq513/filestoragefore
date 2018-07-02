<template>
	<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
import Bus from './Bus'
export default {
  data () {
    return {
      // 左侧菜单对象
      filePath: []
    }
  },
  mounted (){
	 let t = this
      Bus.$on('fileType', (e) => {
		  var fileType = e;
		  if(fileType !== 'all'){
			 t.$router.push({name:'FileView'}) 
		  }else{
			t.$router.push({name:'DirView'}) 

		  }
      });
	  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
