---
title: Jenkins安装部署
description: Jenkins的安装
keywords: [Jenkins]
sidebar_position: 2
---

# Jenkins的安装

jenkins的安装方式有多种，可以使用kubernets、docker、rpm等，如下使用的是docker，版本选择较新的ce稳定版即可

## 安装JenkinsServer节点

Jenkins是由Java语言开发的，运行需要提前安装好JDK。
:::tip
注意最新版本之后不在兼容JDK8而是需要JDK11+版本。
:::

```
# 安装jdk
cd /usr/local
wget https://github.com/AdoptOpenJDK/openjdk8-upstream-binaries/releases/download/jdk8u212-b03/OpenJDK8U-x64_linux_8u212b03.tar.gz

tar xvf OpenJDK8U-x64_linux_8u212b03.tar.gz

# 配置软链接
ln -sv OpenJDK8U-x64_linux_8u212b03 openjdk

# 配置环境变量
vim /etc/profile.d/jdk.sh

export JAVA_HOME=/usr/local/openjdk
export PATH=$PATH:JAVA_HOME/bin

source /etc/profile.d/jdk.sh
```

部署方式根据不同的环境可以选择，如果你准备了一台VM虚机或者服务器，可以尝试通过RPM命令的方式进行安装和部署。   

最简单的方法是通过容器进行部署，这也是大势所趋，大部分企业都在用容器的弹性伸缩将Jenkins部署到Kubernetes中。  

此处采用Docker的方式进行部署

安装Jenkins的Server节点，Server节点作为主控节点负责调度任务。进入hub.docker.com官方的镜像仓库，下载Jenkins的镜像。
:::note
容器运行后需要开放端口。8080默认Jenkins web页面使用的端口。50000是Agent连接Server用到的通信端口。(后面安装JenkinsAgent的时候要注意网络连通性)
时区配置，定义默认的时区。持久化数据目录，挂载本地的数据目录。
:::  

```
# 预先拉取镜像
docker pull jenkins/jenkins:2.346.3-2-lts-jdk11

# 创建持久化目录
mkdir -p /data/jenkins_home
chmod 777 -R  /data/jenkins_home

# 生成启动命令
docker run -itd --name jenkins \
    -p 8080:8080 \
    -p 50000:50000 \
    -e JAVA_OPTS="-Dorg.apache.commons.jelly.tags.fmt.timeZone='Asia/Shanghai'" \
    --privileged=true  \
    --restart=always \
    -v /data/jenkins_home:/var/jenkins_home \
    jenkins/jenkins:2.346.3-2-lts-jdk11
```
启动Jenkins容器。然后docker logs 看下日志。在日志中可以获取到激活Jenkins需要用到的密钥字符串。
```
docker logs -f jenkins
```
访问jenkins
```
http://<your_ip_address>:8080
```

## 安装配置Jenkins Agent
首先，我们需要在JenkinsServer上面添加节点。系统设置 > 节点管理 > 新建节点。  
新建节点，选择类型选择固定的节点。

:::note
什么是固定的节点呢？ 类型分为固定和动态的节点。
固定的节点就是安装到一台固定的机器上。动态节点可以作业运行完成后自动销毁或者新建。一般采用docker或者Kubernetes来配置动态节点。
:::

填写节点配置参数：执行器数量决定了可以同时构建的job数量。定义标签，多个标签用空格进行分割。标签指的是一组节点。

启动方式选择Java Web。
然后保存这个节点我们就加好了。返回节点页面，发现不在线的状态。需要下载agent的启动程序然后到节点上面启动起来。

进入节点页面，可以看到agent.jar包的下载链接和对应的启动命令。在节点上面创建一个目录，然后根据提示的命令行启动。(可以这个启动脚本)

```

#!/bin/bash

nohup java -jar agent.jar -jnlpUrl http://<your_ip_address>:8080/computer/build01/jenkins-agent.jnlp -secret @secret-file -workDir "/opt/jenkins"  &

```
保证此节点在线即可
