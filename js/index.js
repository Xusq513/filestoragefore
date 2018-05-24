var vue = new Vue({
    el: '#container',
    data: {
		// 展示的文件对象
        fileItems: null,
		// 左侧菜单对象
        moduleData: null,
		// 文件路径
        filePath: [],
		// 视图类型
        view: "all",
		// 当前文件夹
		currentDirId:'',
		// 右键当前操作文件的id
		dbOperateFileId:''
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
				index.queryFileByPid(id);
                // 目录结构加入当前的目录
                var path = {
                    "name": fileName,
                    "id": id
                };
                vue.filePath.push(path);
				this.currentDirId = id;
            }

        },
        // 创建一个新的文件夹的事件或者重命名
        saveDir: function (fileItem) {
			var id = fileItem.id || '';
			var cid = index.saveDirAjax(this.currentDirId,fileItem.fileName,id);
            fileItem.type = 'label';
			fileItem.id = cid;
        },
        // 点击全部时如果目录未加载过就先加载全部目录，并且切换到全部的视图下
        switchView: function (module) {
            if (module.fileType === 'all') {
                this.view = 'all';
            } else {
                this.view = 'view';
            }
        },
		// 点击目录的事件
		selectDir : function(item){
			var filePathTemp = [];
			for(let i=0;i<this.filePath.length;i++){
				var indexVar = this.filePath[i];
				filePathTemp.push(indexVar);
				if(indexVar.id == item.id){
					break;
				}
			}
			index.queryFileByPid(item.id);
			this.filePath = filePathTemp;
			this.currentDirId = item.id;
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
	$.get(futrueUrl + 'file/root',function(data){
		 	vue.fileItems = data;
	});
		
    var path = {
        "name": "全部",
        "id": ""
    };
    vue.filePath.push(path);
	
	$('.context').contextmenu({
		target:'#context-menu', 
		before: function(e,context) {
			// 右键之前先将操作的文件进行赋值
			vue.dbOperateFileId = $(e.target).closest('tr').attr('id');
		},
		onItem: function(context,e) {
			var action = $(e.target).attr('action');
			if(action){
				switch(action){
					case 'delete':
						alert('delete');
						break;
					case 'rename' :
						for(var fileItemIndex in vue.fileItems){
							if(vue.fileItems[fileItemIndex].id == vue.dbOperateFileId){
								vue.fileItems[fileItemIndex].type = 'input';
								Vue.set(vue.fileItems,fileItemIndex,vue.fileItems[fileItemIndex]);
							}
						}
						break;
					case 'move' : 
						alert('move');
						break;
					case 'download':
						alert('download');
						break;
					default:
						alert('default');
				}
			}
		}
	})

    // 	$.get(futrueUrl + 'module/get',function(data){
    // 		vue.moduleData = data;
    // 	});
});

index = {
	// 点击创建文件夹
	createDir : function (pid) {
	    var newDir = {
	        "id": '',
	        "fileName": "新建文件夹",
	        "fileType": "dir",
	        "fileSize": "",
	        "lastModifyTime": "2018-05-05 11:20:00",
	        "type": "input"
	    }
	    vue.fileItems.unshift(newDir);
	},
	// 屏蔽原生的右键事件
	doNothing : function (){  
	        window.event.returnValue=false;  
	        return false;  
	},
	// 根据fileItem的id获得fileItem对象
	getFileItemById : function(id,fileItems){
		for(var fileItemIndex in fileItems){
			if(fileItems[fileItemIndex] == id){
				return fileItems[fileItemIndex];
			}
		}
	},
	// 提交文件夹的名称以及父节点到后台，返回当前节点的id
	saveDirAjax : function(pid,fileName,id){
		var obj ={"pid":pid,"fileName":fileName,"id":id};
		var targetUrl = futrueUrl + 'file';     
		var newId = "";
		$.ajax({ 
			type:'post',  
			url:targetUrl, 
			cache: false,
			data:obj, 
			async:false,
			dataType:'json', 
			success:function(response){  
			    if(response.success){
					var data = response.data;
					newId = data.id;
				}else{
					alert(response.message)
				}
			
			},
			error:function(){
				alert("error");
			}
		});
		return newId;
	},
	deleteFileAjax : function(){
		
	},
	// 根据文件夹的ID查询文件夹下文件内容并且展示到页面上
	queryFileByPid : function(pid){
		$.get(futrueUrl + 'file/' + pid ,function(data){
				vue.fileItems = data;
		});
	}
	
}

