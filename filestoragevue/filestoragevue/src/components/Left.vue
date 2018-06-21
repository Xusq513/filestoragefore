<template>
	<div class="col-sm-3 col-md-2 sidebar">
			<ul class="nav nav-sidebar">
				<li class="col-md-10">
					<input type="text" class="form-control" placeholder="搜索...">
				</li>
			</ul>
			<ul class="nav nav-sidebar" id="module">
				<li v-for="item in moduleData" v-on:click="callRight(item)">
					<a href="javascript:void(0)"  :fileType="item.fileType">
						<span :class="item.iconClass" aria-hidden="true"></span>
						<span>{{item.moduleName}}</span></a>
				</li>
			</ul>
	</div>	
</template>

<script>
import Bus from './Bus'
export default {
  data () {
    return {
			/*
			[
				{
					"id": 1,
					"moduleName": "全部",
					"iconClass": "glyphicon glyphicon-tasks",
					"fileType": "all"
				}
			]
			*/
      // 左侧菜单对象
      moduleData: []
    }
  },
  mounted (){
	  const baseUrl = this.baseUrl;
	  var t = this;
	  $.get(baseUrl + 'module/get',function(data){
	  	t.moduleData = data;
	  });
  },
	methods : {
		callRight : function(item){
			Bus.$emit('fileType', item.fileType);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
