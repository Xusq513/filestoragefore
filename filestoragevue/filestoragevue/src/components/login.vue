<template>
	<div id="con">
    <div class="login_box">
        <div class="login_l_img">
            <img src="../assets/images/login-img.png" />
        </div>
        <div class="login">
            <div class="login_logo">
                <a href="#">
                    <img :src="require('../assets/images/login_logo.png')" />
                </a>
            </div>
            <div class="login_name">
                <p>易存储云盘</p>
            </div>
            <form id="addForm">
                <input type="text" name="userName" id="userName" placeholder="请输入你的用户名" v-model="userName"/>
                <input type="password" name="password" id="password" placeholder="请输入你的密码" v-model="password"/>
                
            </form>
            <input value="登录" style="width:100%;" type="button" @click="login" id="loginBtn"/>
        </div>
        <div class="copyright">逆转未来工作室</div>
    </div>
	</div>
</template>

<script>
    export default {
        name: 'login',
		data() {
			return {
				userName : '',
				password : ''
			}
		},
		methods : {
			login(){
			let t = this;
			const baseUrl = this.baseUrl;
			var data = {userName:this.userName,password:this.password};
			var targetUrl = baseUrl + 'user/login';       
			$.ajax({ 
			   type:'post',  
			   url:targetUrl, 
			   cache: false,
			   data:data,  
			   dataType:'json', 
			   success:function(response){   
				  if(response.success){
						t.$router.push('windowView');
				  }else{
				       alert(response.message)
				  }
			    },
			    error:function(){
			     alert("error");
			    }
			   })   
			}
		}
    }
</script>

<style>
    @charset "utf-8";
    /* CSS Document */

    .login_box {
        font: 13px/1.5 '微软雅黑';
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -box-sizing: border-box;
        padding: 0;
        margin: 0;
        list-style: none;
        box-sizing: border-box;
    }

    #con{
        height: 100%;
        overflow: hidden;
    }

    #con {
        background: #93defe;
        background-size: cover;
    }

    a {
        color: #27A9E3;
        text-decoration: none;
        cursor: pointer;
    }

    img {
        border: none;
    }

    .login_box {
        width: 1100px;
        margin: 120px auto 0;
    }

    .login_box .login_l_img {
        float: left;
        width: 432px;
        height: 440px;
        margin-left: 50px;
    }

    .login_box .login_l_img img {
        width: 500px;
        height: 440px;
    }

    .login {
        height: 360px;
        width: 400px;
        padding: 50px;
        background-color: #ffffff;
        border-radius: 6px;
        box-sizing: border-box;
        float: right;
        margin-right: 50px;
        position: relative;
        margin-top: 50px;
    }

    .login_logo {
        width: 120px;
        height: 120px;
        border: 5px solid #93defe;
        border-radius: 100px;
        background: #fff;
        text-align: center;
        line-height: 110px;
        position: absolute;
        top: -60px;
        right: 140px;
    }

    .login_name {
        width: 100%;
        float: left;
        text-align: center;
        margin-top: 20px;
    }

    .login_name p {
        width: 100%;
        text-align: center;
        font-size: 18px;
        color: #444;
        padding: 10px 0 20px;
    }

    .login_logo img {
        width: 60px;
        height: 60px;
        display: inline-block;
        vertical-align: middle;
    }

    #userName,#password{
        border: 1px solid #DCDEE0;
        vertical-align: middle;
        border-radius: 3px;
        height: 50px;
        padding: 0px 16px;
        font-size: 14px;
        color: #555555;
        outline: none;
        width: 100%;
        margin-bottom: 15px;
        line-height: 50px;
        color: #888;
    }

   #userName,#password{
        border: 1px solid #27A9E3;
    }

    #loginBtn{
        display: inline-block;
        vertical-align: middle;
        padding: 12px 24px;
        margin: 0px;
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        color: #ffffff;
        background-color: #27A9E3;
        border-radius: 3px;
        border: none;
        -webkit-appearance: none;
        outline: none;
        width: 100%;
    }

    .copyright {
        font-size: 14px;
        color: #fff;
        display: block;
        width: 100%;
        float: left;
        text-align: center;
        margin-top: 60px;
    }

    #password_text {
        border: 1px solid #DCDEE0;
        vertical-align: middle;
        border-radius: 3px;
        height: 50px;
        padding: 0px 16px;
        font-size: 14px;
        color: #888;
        outline: none;
        width: 100%;
        margin-bottom: 15px;
        display: block;
        line-height: 50px;
    }
</style>
