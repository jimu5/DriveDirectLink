<?php
    error_reporting(0);
    //允许所有域访问
	header("Access-Control-Allow-Origin: *");
	//设置中文
	header("Content-type:text/html;charset=utf-8");
	$id = $_GET['id'];
	if ($id){
		$url = "https://drive.google.com/uc?id=" . $id . "&export=download" ;
		$html = file_get_contents($url);
		preg_match('/uc-download-link[^>]*(.href=["]).*?["]/is',$html,$match1);//正则匹配下载里面的内容
		//不需要点确认下载的文件
		if(!$match1[0]){
			//echo "<script  type='text/javascript'>
			//	window.location='$url';
			//	</script>";
			header("Location: $url", ture, 307);
		}
		//其他类型,需要点击确认下载的文件
		else{
			preg_match('/href="(.*?)"/is',$match1[0],$match2);//正则
			$result = "https://drive.google.com" . $match2[1];
			echo $result;
			//echo "<script  type='text/javascript'>
			//	window.open(".$result.");
			//	</script>";
			header("Location: $result", ture, 307);
			}
		}	
	else{
		echo "请在url上加上参数!
			<br>
			格式如下:
			<br>
			/?id=文件id
			<br>
			获取直链前应将文件设置全网分享(教育版和团队盘可以在PC网页设置共享,仅支持单文件,不支持目录)
			";
	}
  ?>