<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>网盘直链下载</title>
</head>
<body>
<?php
	require_once('functions.php');
	ini_set('user_agent', 
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36; 
		zh-CN;  //蓝奏云必须设置这个且保持不变才能拿到数据
		Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19');
	//屏蔽显示
    error_reporting(0);
    //允许所有域访问
	header("Access-Control-Allow-Origin: *");
	//设置中文
	header("Content-type:text/html;charset=utf-8");
	//传值为谷歌网盘的处理
	if (!empty($_GET['id'])){
		$id = $_GET['id'];
		google_drive($id);
		}
	//蓝奏云直链获取
	elseif(!empty($_GET['lz'])){
		$lz = $_GET['lz'];
		$direct_link = lzy($lz);
		if ($direct_link)
		{
			echo $direct_link;
		}
		else{
			echo "获取直链失败，请刷新重试";
		}
	}
	//蓝奏云直链下载
	elseif(!empty($_GET['lzd'])){
		$lz = $_GET['lzd'];
		$direct_link = lzy($lz);
		if ($direct_link)
		{
			header("Location: $direct_link"); //直接跳转到下载链接
		}
		else{
			echo "获取直链失败，请刷新重试";
		}
	}
	else{
		echo "DriveDirectLink
		<br>
		DriveDirectLink 网盘直链下载，支持谷歌，蓝奏云
		<br>
		谷歌网盘直链下载
		<br>
		使用方法
		<br>
		格式如下:
		<br>
		https://网站地址/?id=文件ID
		<br>
		例如 google drive 分享链接
		<br>
		https://drive.google.com/open?id=1CIFH3PiEuiUJ-_6YWBfSLxi2DR9ncVmO
		<br>
		直链地址
		<br>
		https://网站地址/?id=1CIFH3PiEuiUJ-_6YWBfSLxi2DR9ncVmO
		蓝奏云
		<br>
		获取直链地址
		<br>
		此方法会获取并展示直链地址，而不会直接下载 格式如下:
		<br>
		https://网站地址/?lz=文件ID
		<br>
		例如 蓝奏云分享链接
		<br>
		https://www.lanzous.com/ibvifch
		直链获取地址
		<br>
		https://网站地址/?lz=ibvifch
		<br>
		注意，有时候会无法获取，刷新即可
		<br>
		直链下载地址
		<br>
		此方法会直接跳转下载，但是经过测试发现，国外机器容易跳验证码，酌情使用 格式如下
		<br>
		https://网站地址/?lzd=文件ID
		<br>
		例如 蓝奏云分享链接
		<br>
		https://www.lanzous.com/ibvifch
		<br>
		直链下载地址
		<br>
		https://网站地址/?lzd=ibvifch
		<br>
		项目地址:<a herf="https://github.com/Kimiato/DriveDirectLink"> https://github.com/Kimiato/DriveDirectLink </a>
		";
	}
?>
</body>