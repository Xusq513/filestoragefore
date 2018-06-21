<template>
	<div>
		<Header></Header>
		<Bodyer></Bodyer>
	</div>
</template>

<script>
import Header from './components/Header'
import Bodyer from './components/Body'
export default {
  name: 'App',
	components : {
		Header,
		Bodyer
	}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
