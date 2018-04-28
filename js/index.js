
var vue = new Vue({
	el: '#module',
	data: {
		moduleData : null
	}
});



$(function() {
	// 本地json文件模拟
//	$.getJSON('json/module.json', function(data) {
//		vue.moduleData = data;
//	})

	$.get(futrueUrl + 'module/get',function(data){
		vue.moduleData = data;
	});
});