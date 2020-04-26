<?php
include_once('config.php');
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
    if(empty($cf_workers)){
        $direct_link = "https://gd.kway.workers.dev/gd/" . $id;
    }
    else{
        $direct_link = $cf_workers . $id;
    }
    header("Location: $direct_link", ture, 307);
}

//蓝奏云
function lzy($lz){
    $url = "https://www.lanzous.com/" . $lz;
    $html = file_get_contents($url);
    /*全文抓取调试
    preg_match("/<body[^>]*?>(.*\s*?)<\/body>/is", $html, $matches);
    */
    preg_match_all("/<iframe[^>]*>/is", $html, $matches);  //$matches[0][1]内包含我们需要的数据
    if(strlen($matches[0][1])>7){
        preg_match('/src="(.*?)"/', $matches[0][1], $download_para); //正则匹配下载参数
    }
    else{
        preg_match('/src="(.*?)"/', $matches[0][0], $download_para);
    }
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
        echo $direct_link;
        return 0;
    }
    return $direct_link;
    //echo '<script>window.location.href=" '.$direct_link. '";</script>';
    //header("Location:$direct_link");
    //echo $matches[0][0];
}
function link_360($id){
    $url = "https://yunpan.360.cn/" . $id;
    //获取header
    file_get_contents($url);
    //$http_response_header[5]为跳转的链接
    $link_302=str_replace("Location: ", "", $http_response_header[5]);
    //echo $link_302;
    preg_match("{https://(.*?)\.}is", $link_302, $prefix_link);
    //网址前缀
    //echo $prefix_link[1];
    $html = file_get_contents($link_302);
    //获取nid
    preg_match('/"nid": "(.*?)"/is', $html, $nid);
    //echo $nid[1];

    //设置360网盘
    $post_data = "shorturl=" . $id . "&nid=" .$nid[1];
    //$postdata = http_build_query($post_data);
    $options = array(
        'http' => array(
            'method' => 'POST',
            //设置请求头
            'header' => 'Referer: ' . ".$link_302.",
            'content' => $post_data,
            'timeout' => 15 * 60 // 超时时间（单位:s）
        )
    );
    $context = stream_context_create($options);
    $reuqest_url ="https://" . $prefix_link[1] . ".link.yunpan.360.cn/share/downloadfile";
    $result = file_get_contents($reuqest_url, false, $context);
    $result_info = json_decode($result);
    //跳转
    return $result_info->data->downloadurl;
}
?>