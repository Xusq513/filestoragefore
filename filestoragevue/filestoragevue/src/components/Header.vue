<template>
  <nav class="navbar navbar-inverse navbar-fixed-top">
  	<div class="container-fluid">
  		<div class="navbar-header">
  			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
  							<span class="sr-only">Toggle navigation</span>
  							<span class="icon-bar"></span>
  							<span class="icon-bar"></span>
  							<span class="icon-bar"></span>
  					</button>
  			<a class="navbar-brand" href="#">易存储云盘</a>
  		</div>
  		<div id="navbar" class="navbar-collapse collapse">
  			<ul class="nav navbar-nav navbar-right">
  				<li>
  					<a href="#">面板控制</a>
  				</li>
  				<li>
  					<a href="#">设置</a>
  				</li>
  				<li>
  					<a href="#">个人中心</a>
  				</li>
  				<li>
  					<a href="#">帮助</a>
  				</li>
  			</ul>
  		</div>
  	</div>
  </nav>
</template>

<script>
export default {
  name: 'HelloWorld',
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
