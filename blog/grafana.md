---
slug: grafana
title: Grafana的安装
authors: Youei
tags: [grafana]
---

## Grafana简介
>grafana是⼀个可视化组件，⽤于接收客户端浏览器的请求并连接到prometheus查询数据，最后经过渲染并在浏览器进⾏体系化显示，需要注意的是，grafana查询数据类似于zabbix⼀样需要⾃定义模板，模板可以⼿动制作也
可以导⼊已有模板。

[grafana官网地址](https://grafana.com/)      

[grafana模板下载地址](https://grafana.com/grafana/dashboards/)
      
![Grafana示意图](https://pic.imgdb.cn/item/64afe0911ddac507ccaa661e.jpg)
     
## Grafana Server安装配置
     
### Grafana安装
[Grafana Server下载地址](https://grafana.com/grafana/download/)      
     
[Grafana安装文档](https://grafana.com/docs/grafana/latest/installation/requirements/)    
     
```shell
# 查看系统信息
root@grafana:~# lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 20.04.3 LTS
Release:	20.04
Codename:	focal

# 官网选择对应的版本号，版本选择oss
# 安装所需要的包
root@grafana:~# sudo apt-get install -y adduser libfontconfig1

# 下载安装包
root@grafana:~# wget https://dl.grafana.com/oss/release/grafana_9.5.0_amd64.deb

# 安装
root@grafana:~# dpkg -i grafana_9.5.0_amd64.deb 
Selecting previously unselected package grafana.
(Reading database ... 108244 files and directories currently installed.)
Preparing to unpack grafana_9.5.0_amd64.deb ...
Unpacking grafana (9.5.0) ...
Setting up grafana (9.5.0) ...
Adding system user `grafana' (UID 113) ...
Adding new user `grafana' (UID 113) with group `grafana' ...
Not creating home directory `/usr/share/grafana'.
### NOT starting on installation, please execute the following statements to configure grafana to start automatically using systemd
 sudo /bin/systemctl daemon-reload
 sudo /bin/systemctl enable grafana-server
### You can start grafana-server by executing
 sudo /bin/systemctl start grafana-server
Processing triggers for systemd (245.4-4ubuntu3.20) ...

# 设置开机启动并立即启动
root@grafana:~# systemctl enable --now grafana-server.service 
Synchronizing state of grafana-server.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable grafana-server
Created symlink /etc/systemd/system/multi-user.target.wants/grafana-server.service → /lib/systemd/system/grafana-server.service.

# 查看服务状态
root@grafana:~# systemctl status grafana-server.service 
● grafana-server.service - Grafana instance
     Loaded: loaded (/lib/systemd/system/grafana-server.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-07-13 11:44:58 UTC; 22s ago
       Docs: http://docs.grafana.org
   Main PID: 2658 (grafana)
      Tasks: 7 (limit: 4558)
     Memory: 61.4M
     CGroup: /system.slice/grafana-server.service
             └─2658 /usr/share/grafana/bin/grafana server --config=/etc/grafana/grafana.ini --pidfile=/run/grafana/grafana-server.pid --packaging=deb cfg:default.paths.logs=/var/log/grafana cfg:default.paths.d>

Jul 13 11:45:00 grafana grafana[2658]: logger=provisioning.alerting t=2023-07-13T11:45:00.189450711Z level=info msg="finished to provision alerting"
Jul 13 11:45:00 grafana grafana[2658]: logger=ngalert.state.manager t=2023-07-13T11:45:00.189693369Z level=info msg="Warming state cache for startup"
Jul 13 11:45:00 grafana grafana[2658]: logger=ngalert.state.manager t=2023-07-13T11:45:00.189832622Z level=info msg="State cache has been initialized" states=0 duration=138.702µs
Jul 13 11:45:00 grafana grafana[2658]: logger=ticker t=2023-07-13T11:45:00.189927672Z level=info msg=starting first_tick=2023-07-13T11:45:10Z
Jul 13 11:45:00 grafana grafana[2658]: logger=http.server t=2023-07-13T11:45:00.191149343Z level=info msg="HTTP Server Listen" address=[::]:3000 protocol=http subUrl= socket=
Jul 13 11:45:00 grafana grafana[2658]: logger=modules t=2023-07-13T11:45:00.191348962Z level=warn msg="No modules registered..."
Jul 13 11:45:00 grafana grafana[2658]: logger=grafanaStorageLogger t=2023-07-13T11:45:00.194759932Z level=info msg="storage starting"
Jul 13 11:45:00 grafana grafana[2658]: logger=ngalert.multiorg.alertmanager t=2023-07-13T11:45:00.20352162Z level=info msg="starting MultiOrg Alertmanager"
Jul 13 11:45:00 grafana grafana[2658]: logger=grafana.update.checker t=2023-07-13T11:45:00.641655067Z level=info msg="Update check succeeded" duration=448.824112ms
Jul 13 11:45:01 grafana grafana[2658]: logger=plugins.update.checker t=2023-07-13T11:45:01.389370336Z level=info msg="Update check succeeded" duration=1.195655107s

# 查看监听端口
root@grafana:~# ss -ntlp |grep 3000
LISTEN    0         4096                     *:3000                   *:*        users:(("grafana",pid=2658,fd=9))
```
### 访问测试
    
输入 `http://192.168.91.44:3000` 访问grafana页面      
    
![grafana login page](https://pic.imgdb.cn/item/64afe48e1ddac507ccb9d482.png)
     
使用默认账号密码`admin`:`admin`登录成功
     

![grafana login success page](https://pic.imgdb.cn/item/64afe47f1ddac507ccb99e45.png)
     
### 添加Prometheus数据源
     
#### 设置数据源
进入grafana界面 --> setting --> datasource
     
![设置prometheus数据源](https://pic.imgdb.cn/item/64afe6b81ddac507ccc10393.png)
    
#### 增加数据源并添加
**添加数据源**     
      
![新增数据源](https://pic.imgdb.cn/item/64afe7cd1ddac507ccc58051.png)
    
**选择prometheus类型**   
    
![选择prometheus类型](https://pic.imgdb.cn/item/64afe7b31ddac507ccc511b1.png)
     
**填写prometheus server地址**
      
![Prometheus server url](https://pic.imgdb.cn/item/64afe7a41ddac507ccc4bbe4.png)
      
**验证并保存数据源**
     
![test and save](https://pic.imgdb.cn/item/64afe7c91ddac507ccc56ff9.png)
     
### 查找dashboard
    
[grafana模板下载地址](https://grafana.com/grafana/dashboards/)
    
![search node_exporter dashboard](https://pic.imgdb.cn/item/64afff241ddac507cc2bfe0e.png)
    
**查看模板详细信息**
    
![template info ](https://pic.imgdb.cn/item/64afffac1ddac507cc2e1ba3.png)
     
**模板导入方式**
   
1.复制模板id导入    
    
2.下载json文件导入
     

![import dashboard](https://pic.imgdb.cn/item/64b000831ddac507cc317cdc.png)
    
### grafana导入步骤
    
点击右上角 ` + ` 号，选择 `import dashboard`.
    
![import dashobard for grafana](https://pic.imgdb.cn/item/64b001451ddac507cc34c9c7.png)
      
输入 `ID`(11704),再点击 `load`.
      
![import id template](https://pic.imgdb.cn/item/64b001cc1ddac507cc376f0d.png)
     
选择目的 `数据源`.
    
![select datasource](https://pic.imgdb.cn/item/64b001fa1ddac507cc386358.png)
     
### 查看验证导入模板信息
    
![template import after](https://pic.imgdb.cn/item/64b003a71ddac507cc3fe56a.png)
       
### 插件管理
      
饼图插件未安装，需要提前安装 
      
[插件下载地址](https://grafana.com/grafana/plugins/grafana-piechart-panel)
     
```shell
# 在线安装插件
root@grafana:~# grafana-cli plugins install grafana-piechart-panel
✔ Downloaded and extracted grafana-piechart-panel v1.6.4 zip successfully to /var/lib/grafana/plugins/grafana-piechart-panel

Please restart Grafana after installing or removing plugins. Refer to Grafana documentation for instructions if necessary.

# 离线安装
root@grafana:~# cd /var/lib/grafana/plugins

## 下载插件
root@grafana:~# wget -nv https://grafana.com/api/plugins/grafana-piechart-panel/versions/latest/download -O /tmp/grafana-piechart-panel.zip

## 解压并移动到插件目录
root@grafana:~# unzip -q /tmp/grafana-piechart-panel.zip -d /tmp
root@grafana:~# mv /tmp/grafana-piechart-panel-* /var/lib/grafana/plugins/grafana-piechart-panel

## 重启服务
root@grafana:~# sudo service grafana-server restart
```