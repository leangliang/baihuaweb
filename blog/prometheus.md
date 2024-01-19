---
slug: prometheus
title: Prometheus的安装
authors: Youei
tags: [promehteus]
---
## Prometheus简介   
   

[Prometheus官网地址： https://prometheus.io](https://prometheus.io/)
   

Prometheus是一款开源的监控系统和时间序列数据库，由SoundCloud开发并于2012年发布。它被广泛应用于容器化环境、云原生架构和微服务体系中。

以下是Prometheus的一些关键特性和概念：

  - 多维度数据模型： Prometheus使用多维度数据模型来描述监控数据。每个时间序列数据都由标识和一组键值对标签（labels）唯一标识。这样可以实现更灵活的查询和聚合。
    
  - 灵活的查询语言： Prometheus提供了PromQL查询语言，可以进行丰富的数据查询和分析操作。用户可以根据需要组合、聚合和过滤监控数据。
   
  - 实时监控和警报： Prometheus具有实时监控能力，可以按照设定的规则进行实时监测，并生成警报。用户可以定义自定义的警报规则，并通过警报通知渠道（如电子邮件、Slack等）接收警报信息。
  
  - 可视化和仪表盘： Prometheus提供了基本的数据可视化功能，并支持与Grafana等外部仪表盘工具集成，以实现更强大的数据可视化和监控仪表盘。
  
  - 可扩展性和高度可靠性： Prometheus的设计考虑了可扩展性和高度可靠性。它支持分布式架构，并具有自动发现和自动配置的能力。可以通过添加额外的Prometheus实例和使用适当的存储解决方案来实现水平扩展和高可用性。
   
  - 开放的生态系统： Prometheus具有活跃的开源社区，提供了丰富的插件和集成，以扩展和定制其功能。它可以与各种应用和系统集成，包括容器编排平台（如Kubernetes）、云服务提供商和各种监控和警报工具。   
   

:::note
总的来说，Prometheus是一个功能强大、易于使用和高度可扩展的监控系统，适用于监控和分析各种类型的系统、服务和应用程序。它为用户提供了实时监控、警报、可视化和数据查询等功能，帮助用户更好地了解系统的性能和健康状态。
:::
   
**Prometheus组件介绍：**
   
  - prometheus server：主服务，接受外部http请求，收集、存储与查询数据等
  - prometheus targets: 静态收集的⽬标服务数据
  - service discovery：动态发现服务
  - prometheus alerting：报警通知
  - push gateway：数据收集代理服务器(类似于zabbix proxy)
  - data visualization and export： 数据可视化与数据导出(访问客户端)   
   
**Prometheus架构图:**   
   

![prometheus架构图](https://pic.imgdb.cn/item/64a8179d1ddac507ccfb8b98.png)

## Prometheus的安装部署
### 部署方式   
  1. **使用软件源安装：**
  ```
    apt install -y prometheus
    yum install -y prometheus
  ```
  2. **官方二进制安装：**   
    [二进制程序下载地址：https://prometheus.io/download/](https://prometheus.io/download/)  
       
  3. **docker镜像方式安装：**   
    [官网docker安装文档：https://prometheus.io/docs/prometheus/latest/installation/](https://prometheus.io/docs/prometheus/latest/installation/)
       
  4. **Prometheus-Operator方式部署：**     
    [Prometheus-operatora项目地址：https://github.com/prometheus-operator/kube-prometheus](https://github.com/prometheus-operator/kube-prometheus)

:::info
本文使用二进制安装方式，其它方式请自行参照官方文档进行部署
:::

### 二进制部署   
    
**服务器规划**
```shell
root@prometheus:~# cat /etc/hosts
192.168.91.43 prometheus
192.168.91.44 grafana
192.168.91.45 alertmanager
```
**下载并安装二进制包**

```shell
# 下载二进制安装包
root@prometheus:~# wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz

# 创建程序目录
root@prometheus:~# mkdir /apps

# 解压缩至指定目录
root@prometheus:~# tar xvf prometheus-2.45.0.linux-amd64.tar.gz -C /apps/

# 进入程序目录，创建软链接
root@prometheus:~# cd /apps
root@prometheus:/apps# ln -sv prometheus-2.45.0.linux-amd64/ prometheus
'prometheus' -> 'prometheus-2.45.0.linux-amd64/'

# 主要文件介绍
root@prometheus:/apps# cd prometheus

root@prometheus:/apps/prometheus# ls -l
total 227328
drwxr-xr-x 2 1001 123      4096 Jun 23 15:40 console_libraries
drwxr-xr-x 2 1001 123      4096 Jun 23 15:40 consoles
-rw-r--r-- 1 1001 123     11357 Jun 23 15:40 LICENSE
-rw-r--r-- 1 1001 123      3773 Jun 23 15:40 NOTICE
-rwxr-xr-x 1 1001 123 119846310 Jun 23 15:12 prometheus  # prometheus服务可执⾏程序
-rw-r--r-- 1 1001 123       934 Jun 23 15:40 prometheus.yml # prometheus的配置文件
-rwxr-xr-x 1 1001 123 112896008 Jun 23 15:14 promtool    # 测试⼯具，⽤于检测配置prometheus配置⽂件、检测metrics数据等
```
**创建systemd管理文件**
```shell
# 创建systemd管理文件
root@prometheus:/apps/prometheus# vim /etc/systemd/system/prometheus.service

root@prometheus:/apps/prometheus# cat /etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus Server
Documentation=https://prometheus.io/docs/introduction/overview/
After=network.target
[Service]
Restart=on-failure
WorkingDirectory=/apps/prometheus/
ExecStart=/apps/prometheus/prometheus --config.file=/apps/prometheus/prometheus.yml
[Install]
WantedBy=multi-user.target
```
    
**启动Prometheus服务**   
```shell
# 重新加载某个服务的配置文件
root@prometheus:~# systemctl daemon-reload 

# 立即启动Prometheus服务，并设置为开机自启动
root@prometheus:~# systemctl enable --now prometheus.service 
Created symlink /etc/systemd/system/multi-user.target.wants/prometheus.service → /etc/systemd/system/prometheus.service.
```
   
**动态(热)加载配置**
```shell
# 动态加载参数
    --web.enable-lifecycle

# 在systemd文件的启动命令中加上上述参数
root@prometheus:~# cat /etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus Server
Documentation=https://prometheus.io/docs/introduction/overview/
After=network.target
[Service]
Restart=on-failure
WorkingDirectory=/apps/prometheus/
ExecStart=/apps/prometheus/prometheus --config.file=/apps/prometheus/prometheus.yml --web.enable-lifecycle
[Install]
WantedBy=multi-user.target

# 重新加载并重启服务
root@prometheus:~# systemctl daemon-reload
root@prometheus:~# systemctl restart prometheus.service

# 查看监听端口
root@prometheus:~# ss -ntlp |grep 9090
LISTEN    0         4096                     *:9090                   *:*        users:(("prometheus",pid=145008,fd=7))
```
   
#### 访问Prometheus web页面
![Prometheus-web页面](https://pic.imgdb.cn/item/64a830dd1ddac507cc50c35f.png)
     
## node_exporter的安装部署
### 二进制部署   
本文安装node_exporter服务器与Prometheus节点复用，node_exporter默认监听端口为9100.   

#### 安装部署
```shell
# 下载二进制包
root@prometheus:~# https://github.com/prometheus/node_exporter/releases/download/v1.6.0/node_exporter-1.6.0.linux-amd64.tar.gz

# 解压至指定目录
root@prometheus:~# tar xvf node_exporter-1.6.0.linux-amd64.tar.gz -C /apps/
node_exporter-1.6.0.linux-amd64/
node_exporter-1.6.0.linux-amd64/NOTICE
node_exporter-1.6.0.linux-amd64/node_exporter
node_exporter-1.6.0.linux-amd64/LICENSE

# 进入程序目录并创建软链接
root@prometheus:/apps# ln -sv node_exporter-1.6.0.linux-amd64/ node_exporter
'node_exporter' -> 'node_exporter-1.6.0.linux-amd64/'
root@prometheus:/apps# ls -l
total 8
lrwxrwxrwx 1 root root   32 Jul  7 15:27 node_exporter -> node_exporter-1.6.0.linux-amd64/
drwxr-xr-x 2 1001 1002 4096 May 27 12:08 node_exporter-1.6.0.linux-amd64
lrwxrwxrwx 1 root root   30 Jul  7 14:59 prometheus -> prometheus-2.45.0.linux-amd64/
drwxr-xr-x 5 1001  123 4096 Jul  7 15:07 prometheus-2.45.0.linux-amd64

# 主要文件介绍
root@prometheus:/apps/node_exporter# ls -l
total 19572
-rw-r--r-- 1 1001 1002    11357 May 27 12:08 LICENSE
-rwxr-xr-x 1 1001 1002 20023864 May 27 12:04 node_exporter    # node_exporter可执行程序
-rw-r--r-- 1 1001 1002      463 May 27 12:08 NOTICE
```
   
#### 创建node_exporter systemd管理文件

```shell
# 编辑查看systemd文件
root@prometheus:/apps/node_exporter# vim /etc/systemd/system/node-exporter.service
root@prometheus:/apps/node_exporter# cat /etc/systemd/system/node-exporter.service
[Unit]
Description=Prometheus Node Exporter
After=network.target
[Service]
ExecStart=/apps/node_exporter/node_exporter
[Install]
WantedBy=multi-user.target

# 重新加载systemd文件
root@prometheus:/apps/node_exporter# systemctl daemon-reload

# 启动服务，并设置为开机自启动
root@prometheus:/apps/node_exporter# systemctl enable --now node-exporter.service 
Created symlink /etc/systemd/system/multi-user.target.wants/node-exporter.service → /etc/systemd/system/node-exporter.service.

## 查看端口监听状态
root@prometheus:/apps/node_exporter# ss -ntlp |grep 9100
LISTEN    0         4096                     *:9100                   *:*        users:(("node_exporter",pid=145652,fd=3))
```
    
#### 访问node_exporter web界面
![node_exporter web](https://pic.imgdb.cn/item/64a830a21ddac507cc5003fe.png)
   

#### 验证node_exporter指标数据
```shell
# node-export默认的监听端⼝为9100，可以使⽤浏览器或curl访问数据
root@prometheus:~# curl 192.168.91.43:9100/metrics

# 常见的指标：
node_boot_time：系统⾃启动以后的总结时间
node_cpu：系统CPU使⽤量
node_disk*：磁盘IO
node_filesystem*：系统⽂件系统⽤量
node_load1：系统CPU负载
node_memeory*：内存使⽤量
node_network*：⽹络带宽指标
node_time：当前系统时间
go_*：node exporter中go相关指标
process_*：node exporter⾃身进程相关运⾏指标
```
## 配置Prometheus收集node_exporter指标
### 编辑Prometheus配置文件
```shell
# 进入到指定目录并查看配置文件
root@prometheus:~# cd /apps/prometheus

# 查看默认配置文件
root@prometheus:/apps/prometheus# cat prometheus.yml 
# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090"]
```
### 添加node节点数据采集
```shell
# 编辑配置文件
root@prometheus:/apps/prometheus# vim prometheus.yml

# 增加如下配置项：
  - job_name: "node_exporter"
    static_configs:
      - targets: ["192.168.91.43:9100"]
```
### 重启验证
```shell
# 重启prometheus服务
root@prometheus:/apps/prometheus# systemctl restart prometheus.service 

# 查看Prometheus状态
root@prometheus:/apps/prometheus# systemctl status prometheus.service 
â prometheus.service - Prometheus Server
     Loaded: loaded (/etc/systemd/system/prometheus.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2023-07-07 15:48:06 UTC; 5s ago
       Docs: https://prometheus.io/docs/introduction/overview/
   Main PID: 146417 (prometheus)
      Tasks: 8 (limit: 4583)
     Memory: 21.2M
     CGroup: /system.slice/prometheus.service
             ââ146417 /apps/prometheus/prometheus --config.file=/apps/prometheus/prometheus.yml --web.enable-lifecycle

Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.651Z caller=head.go:755 level=info component=tsdb msg="WAL segment loaded" segment=0 maxSegment=2
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.656Z caller=head.go:755 level=info component=tsdb msg="WAL segment loaded" segment=1 maxSegment=2
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.657Z caller=head.go:755 level=info component=tsdb msg="WAL segment loaded" segment=2 maxSegment=2
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.657Z caller=head.go:792 level=info component=tsdb msg="WAL replay completed" checkpoint_replay_duration=22.663Âµs wal_replay_duration=7.4114>
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.659Z caller=main.go:1040 level=info fs_type=EXT4_SUPER_MAGIC
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.659Z caller=main.go:1043 level=info msg="TSDB started"
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.659Z caller=main.go:1224 level=info msg="Loading configuration file" filename=/apps/prometheus/prometheus.yml
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.659Z caller=main.go:1261 level=info msg="Completed loading of configuration file" filename=/apps/prometheus/prometheus.yml totalDuration=30>
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.659Z caller=main.go:1004 level=info msg="Server is ready to receive web requests."
Jul 07 15:48:06 prometheus prometheus[146417]: ts=2023-07-07T15:48:06.659Z caller=manager.go:995 level=info component="rule manager" msg="Starting rule manager..."
```
   
#### 通过Prometheus web页面查看数据采集状态
![查看Prometheus web target](https://pic.imgdb.cn/item/64a834331ddac507cc580171.png)
   

#### 通过Prometheus web页面验证node数据
![验证node数据](https://pic.imgdb.cn/item/64a834961ddac507cc58c853.png)