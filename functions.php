<?php
function send_post($url, $post_data) {
    $postdata = http_build_query($post_data);
    $options = array(
        'http' => array(
            'method' => 'POST',
            //设置请求头
            'header' => 'Referer: https://www.lanzous.com/\r\n'.
                    'Accept-Language:zh-CN,zh;q=0.9\r\n',
            'content' => $postdata,
            'timeout' => 15 * 60 // 超时时间（单位:s）
        )
    );
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return $result;
}
//谷歌网盘
function google_drive($id){
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
//蓝奏云
function lzy($lz){
    $url = "https://www.lanzous.com/" . $lz;
    $html = file_get_contents($url);
    /*全文抓取调试
    preg_match("/<body[^>]*?>(.*\s*?)<\/body>/is", $html, $matches);
    */
    preg_match_all("/<iframe[^>]*>/is", $html, $matches);  //$matches[0][1]内包含我们需要的数据
    preg_match('/src="(.*?)"/', $matches[0][1], $download_para); //正则匹配下载参数
    //echo $download_para[1];
    //拼接下载链接字符串
    $download_link = "https://www.lanzous.com/" . $download_para[1];
    $download_html = file_get_contents($download_link);
    //获取sign值
    preg_match("/'sign':'(.*?)'/is", $download_html, $sign);
    //echo $sign[1];
    $post_data = array(
        'action' => 'downprocess',
        'sign' => $sign[1],
        'ves' => '1'
    );
    //echo $sign[1];
    $direct_link_json = send_post('https://www.lanzous.com/ajaxm.php', $post_data);
    //解析json
    $direct_link_info = json_decode($direct_link_json);
    //$direct_link_info->dom 这个是 下载链接的拼接头
    //$direct_link_info->url 这个是 下载链接的拼接尾
    //拼接获取下载直链
    $direct_link = $direct_link_info->dom . "/file/" . $direct_link_info->url;
    if (strlen($direct_link)<40){
        return 0;
    }
    return $direct_link;
    //echo '<script>window.location.href=" '.$direct_link. '";</script>';
    //header("Location:$direct_link");
    //echo $matches[0][0];

}
?>