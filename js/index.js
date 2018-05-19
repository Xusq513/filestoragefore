var vue = new Vue({
    el: '#container',
    data: {
        fileItems: null,
        moduleData: null,
        filePath: [],
        view: "all"
    },
    methods: {
        // 双击进入下一个子文件夹的事件
        showChildDir: function (fileItem) {
            // 如果不是文件夹直接返回
            if (fileItem.fileType != 'dir') {
                return;
		    // 如果是文件夹的话，查询文件夹下的内容并且增加目录
            } else {
                var id = fileItem.id;
                var fileName = fileItem.fileName;
                // 根据id查询子目录以及文件
                $.getJSON('json/nextFile.json', function (data) {
                    vue.fileItems = data;
                });
                // 目录结构加入当前的目录
                var path = {
                    "name": fileName,
                    "id": id
                };
                vue.filePath.push(path);

            }

        },
        // 创建一个新的文件夹的事件
        createDir: function (fileItem) {
            fileItem.type = 'label';
        },
        // 点击全部时如果目录未加载过就先加载全部目录，并且切换到全部的视图下
        switchView: function (module) {
            if (module.fileType === 'all') {
                this.view = 'all';
            } else {
                this.view = 'view';
            }
        },
		// 计算文件大小 size的单位是Byte
		calFileSize : function(size){
			if(!size){
				return "-"
			}
			// 先计算GB
			var g = size / 1024 / 1024 / 1024;
			if(g >= 1){
				return g.toFixed(2) + "G";
			}
			var m = size / 1024 / 1024;
			if(m >= 1){
				return m.toFixed(2) + "M";
			}
			var k =  size / 1024;
			if(k >= 1){
				return k.toFixed(2) + "K";
			}
			return size + "B";
		}
    }
});

$(function () {
    // 本地json文件模拟
    $.getJSON('json/module.json', function (data) {
        vue.moduleData = data;
    });
    // 页面初始化，默认显示全部的条目，查询全部下的文件
    $.getJSON('json/file.json', function (data) {
        vue.fileItems = data;
    });
    var path = {
        "name": "全部",
        "id": ""
    };
    vue.filePath.push(path);

    // 	$.get(futrueUrl + 'module/get',function(data){
    // 		vue.moduleData = data;
    // 	});
});

function createDir(pid) {
    var newDir = {
        "id": 5,
        "fileName": "新建文件夹",
        "fileType": "dir",
        "fileSize": "",
        "lastModifyTime": "2018-05-05 11:20:00",
        "type": "input"
    }
    vue.fileItems.unshift(newDir);
}

function doNothing(){  
        window.event.returnValue=false;  
        return false;  
}  
