var vue = new Vue({
    el: '#container',
    data: {
		/*
		[
			{
				"id": 1,
				"fileName": "生活文件夹",
				"fileType": "dir",
				"fileSize":"",
				"lastModifyTime" : "2018-05-02 11:20:00"
			}
		]
		*/
		// 展示的文件对象
        fileItems: null,
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
        moduleData: null,
		/*
		[
			{
				"name": fileName,
				"id": id
			}
		]
		*/
		// 文件路径
        filePath: [],
		// 视图类型 all和other两种类型
        view: "all",
		// 当前文件夹 当前目录的主键
		currentDirId:'',
		// 右键当前操作文件的主键
		dbOperateFileId:''
    },
    methods: {
		/**
		 * 双击进入下一个子文件夹的事件
		 * fileItem 点击的目录对象
		 */
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
				// 设置当前文件夹为跳转后的文件夹
				this.currentDirId = id;
            }

        },
		/**
		 * 保存文件信息，创建一个新的文件夹的事件或者重命名
		 * fileItem 保存的文件对象 vue.fileItems数组内对象
		 */
        saveDir: function (fileItem) {
			var id = fileItem.id || '';
			var type = "";
			if(id){
				type = HTTP_PUT;
			}else{
				type = HTTP_POST;
			}
			index.saveDirAjax(type,this.currentDirId,fileItem.fileName,id,function(cid){
				//alert(cid)
				fileItem.type = 'label';
				if(!id){
					fileItem.id = cid;	
				}else{
					for(var fileItemIndex in vue.fileItems){
						if(vue.fileItems[fileItemIndex].id == id){
							Vue.set(vue.fileItems,fileItemIndex,vue.fileItems[fileItemIndex]);
						}
					}
				}
			});
           
        },
		/**
		 * 点击左侧目录的切换事件，点击全部时如果目录未加载过就先加载全部目录，并且切换到全部的视图下
		 * module 点击的目录对象 vue.moduleData的数组内对象
		 */
        switchView: function (module) {
            if (module.fileType === 'all') {
                this.view = 'all';
            } else {
                this.view = 'view';
            }
        },
		/**
		 * 点击导航目录的事件，切换到点击的目录
		 * item 目录对象 vue.filePath的数组对象
		 */
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
		// 
		/**
		 * 计算文件大小 转化为 G M K B
		 * size 文件大小单位为Byte
		 */
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
    // 左侧菜单的加载
   	$.get(futrueUrl + 'module/get',function(data){
   		vue.moduleData = data;
   	});
    // 页面初始化，默认显示全部的条目，查询全部下的文件
	$.get(futrueUrl + 'file/root',function(data){
		vue.fileItems = data;
		var path = {
			"name": "全部",
			"id": ""
		};
		vue.filePath.push(path);
	});
	
	// 右键菜单的事件
	$('.context').contextmenu({
		target:'#context-menu', 
		// 右键之前触发的事件
		before: function(e,context) {
			// 右键之前先将操作的文件进行赋值
			vue.dbOperateFileId = $(e.target).closest('tr').attr('id');
		},
		// 选择一个条目时触发的事件
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
	});
});

index = {
	/**
	 * 点击创建文件夹
	 * TODO 这里的“新建文件夹”应该判断当前文件夹是否有新建文件夹，有的话成为“新建文件夹1”，以此类推
	 */
	createDir : function () {
	    var newDir = {
	        "id": '',
	        "fileName": "新建文件夹",
	        "fileType": "dir",
	        "fileSize": "",
	        "lastModifyTime": "",
	        "type": "input"
	    }
	    vue.fileItems.unshift(newDir);
	},
	/**
	 * 屏蔽原生的右键事件
	 */
	doNothing : function (){  
	        window.event.returnValue=false;  
	        return false;  
	},
	/**
	 * 根据文件对象的id在文件夹数组对象中获得fileItem对象
	 * id 要获得文件夹对象的主键
	 * fileItems 文件对象数组，指vue.fileItems
	 */
	getFileItemById : function(id,fileItems){
		for(var fileItemIndex in fileItems){
			if(fileItems[fileItemIndex] == id){
				return fileItems[fileItemIndex];
			}
		}
	},
	/**
	* 根据文件对象的id在文件夹数组对象中获得索引值
	* id 要获得文件夹对象的主键
	* fileItems 文件对象数组，指vue.fileItems
	*/
	getIndexById : function(id,fileItems){
		for(var fileItemIndex in fileItems){
			if(fileItems[fileItemIndex] == id){
				return fileItemIndex;
			}
		}
	},
	/**
	 * 提交文件夹的名称以及父节点到后台，返回当前节点的id
	 * type 两个值 post 发出post请求新增,put 发出put请求更新
	 * pid 父目录的主键
	 * fileName 目录的名称
	 * id 目录的主键
	 * callback 回调函数
	 */
	saveDirAjax : function(type,pid,fileName,id,callback){
		var obj ={"pid":pid,"fileName":fileName,"id":id};
		var targetUrl = futrueUrl + 'file';     
		$.ajax({ 
			type:type,  
			url:targetUrl, 
			cache: false,
			data:obj, 
			async:false,
			dataType:'json', 
			success:function(response){  
			    if(response.success){
					var data = response.data;
					callback(data.id);
				}else{
					alert(response.message)
				}
			},
			error:function(){
				alert("error");
			}
		});
	},
	deleteFileAjax : function(){
		
	},
	/**
	 * 根据文件夹的ID查询文件夹下文件内容并且展示到页面上
	 * pid 父目录的主键
	 * callback 回调函数
	 */
	queryFileByPid : function(pid,callback){
		if(!pid){
			pid = 'root';
		}
		$.get(futrueUrl + 'file/' + pid ,function(data){
			vue.fileItems = data;
			callback();
		});
	}
	
}

