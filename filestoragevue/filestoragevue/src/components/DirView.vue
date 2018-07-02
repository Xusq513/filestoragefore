<template>
	<div>
	    <div>
	       <file-upload
	       class="btn btn-primary"
	       :post-action="baseUrl + 'fileStorage'"
	       extensions="gif,jpg,jpeg,png,mp3"
	       :multiple="false"
	       :size="0"
	       v-model="files"
	       @input-file="inputFile"
				 :data="{pid:currentDirId || 'root'}"
	       ref="upload">
	       <i class="fa fa-plus"></i>
	       上传文件
	       </file-upload>
	        <button type="button" class="btn btn-primary" v-on:click="createDir()">新建文件夹</button>
					<i id="niceView" class="file-icon" title="切换到缩略视图" @click="switchView(false)"></i>
					<i id="listView" class="file-icon" title="切换到列表视图" @click="switchView(true)"></i>
	    </div>
	
	    <h5>
	        <ol class="breadcrumb">
	            <li v-for="path in filePath" v-on:click="selectDir(path)">
	                <a href="#">{{path.name}}</a>
	            </li>
	            <!--<li class="active">生活</li>-->
	        </ol>
	    </h5>
	    <div class="table-responsive">
	        <table class="table table-hover" v-show="isShowFileListView">
	            <thead>
	                <tr>
	                    <th>
	                        <input type="checkbox" name="fileCheck">
	                    </th>
	                    <th>名称</th>
	                    <th>最后一次修改时间</th>
	                    <th>文件大小</th>
	                </tr>
	            </thead>
	            <tbody class="context" data-toggle="context">
	                <tr v-for="fileItem in fileItems" v-on:dblclick="showChildDir(fileItem)" :id="fileItem.id">
	                    <td>
	                        <input type="checkbox" name="fileCheck">
	                    </td>
	                    <td>
	                        <img :src="getImgUrl(fileItem)" v-if="fileItem.fileType !== 'jpg'" ></img>
													<img :src="fileItem.downloadUrl" v-else class="imgIcon"></img>
	                        <input type="text" v-if="fileItem.type === 'input'" v-model="fileItem.fileName" v-on:blur="saveDir(fileItem);">
	                        <span v-else>{{fileItem.fileName}}</span>
	                    </td>
	                    <td>{{fileItem.lastModifyTime}}</td>
	                    <td>{{calFileSize(fileItem.fileSize)}}</td>
	                </tr>
	            </tbody>
	        </table>
					<div  v-show="!isShowFileListView">
							<div class="row">
									<div v-for="dirItem in fileItems" v-on:dblclick="showChildDir(dirItem)" 
										v-if="dirItem.fileType === 'dir'" :id="dirItem.id" class="col-md-2 dir-row col-md-1-5">
										 <img :src="getImgUrl(dirItem)" style="display: block;"></img>
										 <input type="text" v-if="dirItem.type === 'input'" v-model="dirItem.fileName" v-on:blur="saveDir(dirItem);">
										 <span v-else>{{dirItem.fileName}}</span>
									</div>
							</div>
							  <HR style="FILTER: alpha(opacity=100,finishopacity=0,style=2) " width="100%" color=#987cb9 SIZE=10></hr>
							<div class="row">
									<div v-for="fileItem in fileItems" v-on:dblclick="showChildDir(fileItem)" 
										v-if="fileItem.fileType !== 'dir'" :id="fileItem.id" class="col-md-2 dir-row">
										<img :src="getImgUrl(fileItem)" v-if="fileItem.fileType !== 'jpg'" style="display: block;"></img>
										<img :src="fileItem.downloadUrl" v-else class="fileIcon" style="display: block;"></img>
										<input type="text" v-if="fileItem.type === 'input'" v-model="fileItem.fileName" v-on:blur="saveDir(fileItem);">
										<span v-else>{{fileItem.fileName}}</span>
									</div>
							</div>
					</div>
	    </div>
			
			<div id="context-menu">
	      	<ul class="dropdown-menu" role="menu">
            <li><a tabindex="-1" action="download">下载</a></li>
	           <li><a tabindex="-1" action="move">移动</a></li>
	           <li><a tabindex="-1" action="delete">删除</a></li>
	           <li><a tabindex="-1" action="rename">重命名</a></li>
	      	</ul>
	     </div>
	</div>
	
</template>

<script>
import FileUpload from 'vue-upload-component'
export default {
  components: {
    FileUpload,
  },
  data () {
    return {
			vDialogKey:'',
			files: [],
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
        fileItems: [],
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
		// 当前文件夹 当前目录的主键
				currentDirId:'',
				imgUrl : {
					dir : require('../assets/images/icon-file-m.svg'),
					file : require('../assets/images/icon-nor-m.svg'),
					doc : require('../assets/images/icon-doc-m.svg'),
					xls : require('../assets/images/icon-xls-m.svg'),
					ppt : require('../assets/images/icon-ppt-m.svg'),
					zip : require('../assets/images/icon-zip-m.svg'),
					audio : require('../assets/images/icon-audio-m.svg'),
				},
				// 右键当前操作文件的主键
				dbOperateFileId : '',
				// 是否显示文件列表
				isShowFileListView : true
    }
  },
	mounted (){
		let t = this;
		const baseUrl = this.baseUrl;
		// 页面初始化，默认显示全部的条目，查询全部下的文件
		$.get(baseUrl + 'file/root',function(data){
			t.fileItems = data;
			var path = {
				"name": "全部",
				"id": ""
			};
			t.filePath.push(path);
		});	
	$('.context').contextmenu({
		target:'#context-menu', 
		// 右键之前触发的事件
		before: function(e,context) {
			// 右键之前先将操作的文件进行赋值
			t.dbOperateFileId = $(e.target).closest('tr').attr('id');
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
						for(var fileItemIndex in t.fileItems){
							if(t.fileItems[fileItemIndex].id == t.dbOperateFileId){
								t.fileItems[fileItemIndex].type = 'input';
								t.$set(t.fileItems,fileItemIndex,t.fileItems[fileItemIndex]);
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
	},
	methods : {
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
		},
		/**
		 * 双击进入下一个子文件夹的事件
		 * fileItem 点击的目录对象
		 */	
		showChildDir: function (fileItem) {
			const baseUrl = this.baseUrl;
			var t = this;
      // 如果不是文件夹就根据下载链接新建窗口进行打开
      if (fileItem.fileType != 'dir') {
				if(fileItem.downloadUrl)
					window.open(`${fileItem.downloadUrl}?attname=${fileItem.fileName}`);
        return;
		  // 如果是文件夹的话，查询文件夹下的内容并且增加目录
      } else {
        var id = fileItem.id;
        var fileName = fileItem.fileName;
        // 根据id查询子目录以及文件
				if(!id){
						id = 'root';
				}
				$.get(baseUrl + 'file/' + id ,function(data){
					t.fileItems = data;
				});
				// 目录结构加入当前的目录
				var path = {
					"name": fileName,
					"id": id
				};
				t.filePath.push(path);
				// 设置当前文件夹为跳转后的文件夹
				t.currentDirId = id;
      }
    },
		/**
		 * 保存文件信息，创建一个新的文件夹的事件或者重命名
		 * fileItem 保存的文件对象 vue.fileItems数组内对象
		 */
		saveDir: function (fileItem) {
			const baseUrl = this.baseUrl;
			var t = this;
			var id = fileItem.id || '';
			var type = "";
			if(id){
					type = "put";
			}else{
					type = "post";
			}
			var obj ={"pid":this.currentDirId,"fileName":fileItem.fileName,"id":id};
			var targetUrl = baseUrl + 'file';     
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
							fileItem.type = 'label';
							if(!id){
								fileItem.id = data.id;	
							}else{
								for(var fileItemIndex in t.fileItems){
									if(t.fileItems[fileItemIndex].id == id){
											t.$set(t.fileItems,fileItemIndex,t.fileItems[fileItemIndex]);
									}
								}
							}
						}else{
							alert(response.message)
						}
				},
				error:function(){
					alert("error");
				}
			});				
    },
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
				this.fileItems.unshift(newDir);
		},
		/**
		 * 点击导航目录的事件，切换到点击的目录
		 * item 目录对象 vue.filePath的数组对象
		 */
		selectDir : function(item){
			const baseUrl = this.baseUrl;
			var t = this;
			var filePathTemp = [];
			for(let i=0;i<this.filePath.length;i++){
				var indexVar = this.filePath[i];
				filePathTemp.push(indexVar);
				if(indexVar.id == item.id){
					break;
				}
			}
			var pid = item.id;
			if(!pid){
				pid = 'root';
			}
			$.get(baseUrl + 'file/' + pid ,function(data){
				t.fileItems = data;
				t.filePath = filePathTemp;
				t.currentDirId = item.id;
			});
		
		},
		getImgUrl :function (item){
			let imgUrlArray =  this.imgUrl;
			var fileName = item.fileName;
			var fileType = item.fileType;
			if(fileType === 'dir'){
				return imgUrlArray['dir'];
			}
			var imgUrl = imgUrlArray['file'];
			let docType = '';
			// 多个点的情况不处理，只选取最后一个点后面的内容
			if(fileName.indexOf(".") != -1){
				var array = fileName.split('.');
				docType = array[array.length - 1];
			}
			switch(docType){
				case 'doc':
				case 'docx':
				  imgUrl = imgUrlArray['doc'];
					break;
				case 'xls':
				case 'xlsx':
					imgUrl = imgUrlArray['xls'];
					break;
				case 'ppt':
				case 'pptx':
					imgUrl = imgUrlArray['ppt'];
					break;
				case 'zip':
				case 'rar':
				case 'tar':
				case 'jar':
					imgUrl = imgUrlArray['zip'];
					break;
				case 'mp3':
				case 'wav':
					imgUrl = imgUrlArray['audio'];	
					break;
				default:
					imgUrl = imgUrlArray['file'];
			}
			return imgUrl;
		},
		// 上传文件
		inputFile(newFile, oldFile)  {
			let t = this;
      if (newFile && !oldFile) {
					console.log('addFile')
      }

      if (newFile && oldFile) {
        // 更新文件

        // 开始上传
        if (newFile.active !== oldFile.active) {
					if(newFile.active){
							t.vDialogKey = t.$vDialog.mask('文件上传ing...');
					}
          console.log('Start upload', newFile.active, newFile)

//           // 限定最小字节
//           if (newFile.size >= 0 ) {
//             newFile = this.$refs.upload.update(newFile, {error: 'size'})
//           }
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)
        }

        // 上传错误
        if (newFile.error !== oldFile.error) {
					t.$vDialog.alert('上传失败!',function(){
						t.$vDialog.close(null, t.vDialogKey);
					},{
					messageType: '错误',
					closeTime: 2,// auto close alert dialog in 2 second,
					language: 'cn',// i18n support 'cn', 'en', 'jp'
					messageType :'error'
					});
        }

        // 上传成功
        if (newFile.success !== oldFile.success) {
					if(newFile.response.code == '0000'){
						this.$vDialog.alert('上传成功!',function(){
							let fileItem = newFile.response.data;
							t.fileItems.unshift(fileItem);
							t.$vDialog.close(null, t.vDialogKey);
						},{
						messageType: '消息',
						closeTime: 2,// auto close alert dialog in 2 second,
						language: 'cn',// i18n support 'cn', 'en', 'jp'
						messageType :'success'
						});
					}else{
						t.$vDialog.alert('上传失败!',function(){
							t.$vDialog.close(null, t.vDialogKey);
						},{
						messageType: '错误',
						closeTime: 2,// auto close alert dialog in 2 second,
						language: 'cn',// i18n support 'cn', 'en', 'jp'
						messageType :'error'
						});
					}
        }
      }

      if (!newFile && oldFile) {
        // 删除文件

        // 自动删除 服务器上的文件
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/file/delete?id=' + oldFile.response.id,
          // });
        }
      }

      // 自动上传
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    }
		,
		switchView(showType){
			this.isShowFileListView = showType;
		}
	},
	watch : {
		isShowFileListView (newVal,oldVal){
			if(newVal){
				this.imgUrl = {
					dir : require('../assets/images/icon-file-m.svg'),
					file : require('../assets/images/icon-nor-m.svg'),
					doc : require('../assets/images/icon-doc-m.svg'),
					xls : require('../assets/images/icon-xls-m.svg'),
					ppt : require('../assets/images/icon-ppt-m.svg'),
					zip : require('../assets/images/icon-zip-m.svg'),
					audio : require('../assets/images/icon-audio-m.svg'),
				}
			}else{
				this.imgUrl = {
					dir : require('../assets/images/icon-file-l.svg'),
					file : require('../assets/images/icon-nor-l.svg'),
					doc : require('../assets/images/icon-doc-l.svg'),
					xls : require('../assets/images/icon-xls-l.svg'),
					ppt : require('../assets/images/icon-ppt-l.svg'),
					zip : require('../assets/images/icon-zip-l.svg'),
					audio : require('../assets/images/icon-audio-l.svg')
				}
			}
		}
	},
	computed : {
		dirByRow (){
			// 每行放11个文件夹
			const NUM = 11;
			var fileItemsFiter = this.fileItems.filter(item => item.fileType === 'dir');
			var allArray = [];
			var rowArray = [];
			for(let itemIndex in fileItemsFiter){
				let remaider = itemIndex % NUM;
				rowArray.push(fileItemsFiter[itemIndex]);
				if(remaider == 10){
					allArray.push(rowArray);
					rowArray = [];
				}
			}
			if(rowArray.length != 0){
				allArray.push(rowArray);
			}
			return allArray;
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.imgIcon{
		 width:auto;
		 height:auto;
		 max-width:10%;
		 max-height:10%;
	}
	
	.fileIcon{
		width:134px;
		height:134px;
		max-width:134px;
		max-height:134px;
	}
	
	#listView{
		background-image: url(../assets/images/icon-mode-list-act.svg);
	
	}
	
	#niceView{
		background-image: url(../assets/images/icon-mode-thumb.svg);
	}
	
	.file-icon{
		display: inline-block;
		height: 24px;
		width: 24px;
		float: right;
		margin-right: 10px;
		margin-top: 4px;
		cursor: pointer;
	}
	
	.row{
		margin-right : 0px;
		margin-left : 0px;
	}
	
	.dir-row{
		text-align: center;
		margin-top: 13px;
	}
	
	.col-md-1-5{
		width: 12%;
	}
</style>
