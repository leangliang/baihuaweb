---
title: Jenkins使用指南
description: Jenkins的数据目录
keywords: [Jenkins]
sidebar_position: 3
---
## Pipeline简介
Jenkins的核心是Pipeline（流水线项目），实现了Pipeline As Code。即我们将构建部署测试等步骤全部以代码的形式写到Jenkinsfile中。Jenkins在运行Pipeline任务的时候会按照Jenkinsfile中定义的代码顺序执行。写Jenkinsfile是一项很重的工作，如果稍不注意很容易造成Jenkins的流水线任务失败。Jenkinsfile类似于Dockerfile，具有一套特定的语法。  

:::note
Jenkins的核心特性Pipeline， 用代码的方式描述流水线。 这样就可以维护多个Jenkinsfile来对应不同类型的项目了。 也实现了一部分项目使用统一的一个Jenkinsfile模板来管理。 
:::

## Pipeline的组成
  - Jenkinsfile：是实现Pipeline as Code的核心功能。 该文件用于描述流水线的过程。 
  - Agent：（是否还记得上次课程添加的JenkinsAgent节点）执行Pipeline的实际节点。
  - Stage：在Jenkins pipeline中，一条流水线是由多个阶段组成的，每个阶段一个stage。例如：构建、测试、部署等等。

## Jenkins数据目录管理
Jenkins启动后会读取JENKINS_HOME变量，根据次变量的值来决定数据存储的位置。Jenkins是以XML格式的文件存储到数据目录。  

Jenkins目录的用途:  
  - caches: 系统缓存数据
  - jobs： Jenkins项目作业
  - nodes： Jenkins slave节点信息
  - secrets： 秘钥信息
  - userContent： 类似于web站点目录，可以上传一些文件
  - workspace： 默认的工作目录
  - fingerprints： 指纹验证信息
  - logs ： 日志信息
  - plugins： 插件相关配置
  - updates： 插件更新目录
  - users： jenkins系统用户目录

## Jenkins项目类型-Pipeline
**Jenkins项目类型-Pipeline**
  - 参数化构建：为流水线传参
    - string 字符参数
    - Choice 选项参数  
  - 历史构建管理   
    - 丢弃历史构建：保留5天内10个构建   
  - 并行构建控制  
     

安装Pipeline插件   

在创建Pipeline类型的作业的时候，需要提前安装好pipeline插件，不然可能会出现找不到pipeline类型的作业。    

进入插件管理， 搜索关键字"pipeline" 。安装后重启一下。    

![Alt text](https://pic.imgdb.cn/item/64a56cdc1ddac507ccf8a041.png)
    
安装好插件后新建一个pipeline类型的作业：
    
![pipeline作业](https://pic.imgdb.cn/item/64aea9d81ddac507cc184e22.png)
     
自由风格项目和Pipeline类型的项目区别是，构建部分的操作都是在页面上面完成的
    
![pipeline与自由风格的区别](https://pic.imgdb.cn/item/64aeaa1a1ddac507cc19b4d1.png)
    
Pipeline的构建任务描述都是通过代码的方式。
    
![pipeline语法](https://pic.imgdb.cn/item/64aeaa571ddac507cc1b0040.png)
     
**第一条Pipeline**   
第一条流水线不用太复杂，主要是便于理解流水线的结构。
```jenkinsfile
pipeline {
	agent any
    stages{
        stage("hello"){
            steps{
                echo "Hello Jenkins"
            }
        }
    }
}
```