# DriveDirectLink
DriveDirectLink 网盘直链下载，支持谷歌，蓝奏云
在线使用预览：https://214214.xyz/tools/dlink/
## 谷歌网盘直链下载(使用cf-workers代理)
### 使用方法
格式如下:
```
https://网站地址/?id=文件ID
```
例如
google drive 分享链接
```
https://drive.google.com/open?id=1CIFH3PiEuiUJ-_6YWBfSLxi2DR9ncVmO
```
直链地址
```
https://网站地址/?id=1CIFH3PiEuiUJ-_6YWBfSLxi2DR9ncVmO
```
## 蓝奏云
### 获取直链地址
此方法会获取并展示直链地址，而不会直接下载
格式如下:
```
https://网站地址/?lz=文件ID
```
例如  
蓝奏云分享链接
```
https://www.lanzous.com/ibvifch
```
直链获取地址
```
https://网站地址/?lz=ibvifch
```
注意，有时候会无法获取，刷新即可
### 直链下载地址
此方法会直接跳转下载，但是经过测试发现，国外机器下载直链容易跳验证码，酌情使用
格式如下
```
https://网站地址/?lzd=文件ID
```
例如
蓝奏云分享链接
```
https://www.lanzous.com/ibvifch
```
直链下载地址
```
https://网站地址/?lzd=ibvifch
```
## 360网盘
### 使用方法
格式如下:
```
https://网站地址/?360=文件ID
```
例如
360 分享链接
```
https://yunpan.360.cn/surl_yYgjWMz8GhU
```
直链地址
```
https://网站地址/?360=surl_yYgjWMz8GhU
```
---
## 4月26日更新说明
更新谷歌网盘直链解析用cf-worker代理  
不用梯子也可以直接直链下载网盘的内容了  
添加360网盘解析  
增加config文件，方便修改配置  
### 如何使用cf-worker
申请cf-worker  
将cf-worker文件夹中的index.js内容复制到cf-worker的左侧代码（Script）区域
然后将你的cf-worker链接填入config.php文件修改
