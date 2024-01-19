---
title: Jenkinsfile语法介绍
description: Jenkinsfile语法介绍
keywords: [Jenkins,groovy,jenkinsfile]
sidebar_position: 4
---
## Jenkinsfile语法

### Jenkinsfile的基本概念
Jenkinsfile主要是用来存储用于描述Pipeline的代码。 我们将pipeline的描述代码保存到Jenkinsfile这个文件中。     
     
Jenkinsfile此时可以看作是一个普通文件, 这个文件可以放到不同的地方：
      
  - 存放到Jenkins项目设置中(原生支持),虽然实现了PipelineAsCode但是多个作业管理起来不太方便。
  - 存放到Git版本控制系统中(原生支持,推荐方案): 即实现了PipelineAsCode也便于统一管理。
  - 存放到Nexus制品仓库中(需要第三方插件)。

### jenkins的语法类型
Jenkins语法有两种类型:
  - 脚本式语法   
      - 脚本式语法基本上都是通过Groovy代码来进行编写的。
  - 声明式语法
      - 声明式语法有一些现成的功能可以直接用，减少脚本式语法的复杂性。但是声明式语法也不是完美的,功能固定还是需要脚本式语法来进行扩展才能实现更加灵活的Pipeline。
    
最佳实践是声明式语法中通过  `script{}`  标签来嵌入脚本式代码