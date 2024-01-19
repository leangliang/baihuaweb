---
title: GitLab安装部署与简介
description: GitLab安装部署与简介
keywords: [GitLab]
sidebar_position: 5
---

## GitLab安装

### 使用RPM包安装
#### 下载及部署
```shell
# 系统版本信息
root@gitlab:~# lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.3 LTS
Release:        20.04
Codename:       focal

# 下载软件包
root@gitlab:~# wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/ubuntu/pool/focal/main/g/gitlab-ce/gitlab-ce_14.6.3-ce.0_amd64.deb
--2023-07-12 01:14:59--  https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/ubuntu/pool/focal/main/g/gitlab-ce/gitlab-ce_14.6.3-ce.0_amd64.deb
Resolving mirrors.tuna.tsinghua.edu.cn (mirrors.tuna.tsinghua.edu.cn)... 101.6.15.130, 2402:f000:1:400::2
Connecting to mirrors.tuna.tsinghua.edu.cn (mirrors.tuna.tsinghua.edu.cn)|101.6.15.130|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 985868904 (940M) [application/octet-stream]
Saving to: ‘gitlab-ce_14.6.3-ce.0_amd64.deb’

gitlab-ce_14.6.3-ce.0_amd64.deb                71%[===================================================================>                            ] 670.80M  3.33MB/s    eta 85s 

# dpkg安装
root@gitlab:~# dpkg -i gitlab-ce_14.6.3-ce.0_amd64.deb 
Selecting previously unselected package gitlab-ce.
(Reading database ... 71526 files and directories currently installed.)
Preparing to unpack gitlab-ce_14.6.3-ce.0_amd64.deb ...
Unpacking gitlab-ce (14.6.3-ce.0) ...
Setting up gitlab-ce (14.6.3-ce.0) ...


It looks like GitLab has not been configured yet; skipping the upgrade script.

       *.                  *.
      ***                 ***
     *****               *****
    .******             *******
    ********            ********
   ,,,,,,,,,***********,,,,,,,,,
  ,,,,,,,,,,,*********,,,,,,,,,,,
  .,,,,,,,,,,,*******,,,,,,,,,,,,
      ,,,,,,,,,*****,,,,,,,,,.
         ,,,,,,,****,,,,,,
            .,,,***,,,,
                ,*,.
  


     _______ __  __          __
    / ____(_) /_/ /   ____ _/ /_
   / / __/ / __/ /   / __ `/ __ \
  / /_/ / / /_/ /___/ /_/ / /_/ /
  \____/_/\__/_____/\__,_/_.___/
  

Thank you for installing GitLab!
GitLab was unable to detect a valid hostname for your instance.
Please configure a URL for your GitLab instance by setting `external_url`
configuration in /etc/gitlab/gitlab.rb file.
Then, you can start your GitLab instance by running the following command:
  sudo gitlab-ctl reconfigure

For a comprehensive list of configuration options please see the Omnibus GitLab readme
https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md

Help us improve the installation experience, let us know how we did with a 1 minute survey:
https://gitlab.fra1.qualtrics.com/jfe/form/SV_6kVqZANThUQ1bZb?installation=omnibus&release=14-6
```

#### 修改配置
安装完成后可以发现以下信息，需要修改gitlab.rb配置文件。     

>Thank you for installing GitLab!
GitLab was unable to detect a valid hostname for your instance.
Please configure a URL for your GitLab instance by setting `external_url`
configuration in /etc/gitlab/gitlab.rb file.
Then, you can start your GitLab instance by running the following command:
  sudo gitlab-ctl reconfigure     

```shell
# 修改配置文件
root@gitlab:~# vim /etc/gitlab/gitlab.rb

32 external_url 'http://gitlab.example.com'

# 修改结果如下
root@gitlab:~# grep "external_url 'http://172.16.41.34'" /etc/gitlab/gitlab.rb
external_url 'http://172.16.41.34'

# 重新加载配置文件
root@gitlab:~# gitlab-ctl reconfigure
```

#### 服务运行控制
```shell
## 启动服务
root@gitlab:~# gitlab-ctl start
ok: run: alertmanager: (pid 159183) 349s
ok: run: gitaly: (pid 159205) 349s
ok: run: gitlab-exporter: (pid 159158) 351s
ok: run: gitlab-workhorse: (pid 159139) 352s
ok: run: grafana: (pid 159215) 348s
ok: run: logrotate: (pid 158146) 529s
ok: run: nginx: (pid 158671) 441s
ok: run: node-exporter: (pid 159148) 352s
ok: run: postgres-exporter: (pid 159194) 349s
ok: run: postgresql: (pid 158383) 506s
ok: run: prometheus: (pid 159169) 351s
ok: run: puma: (pid 158586) 459s
ok: run: redis: (pid 158186) 523s
ok: run: redis-exporter: (pid 159162) 351s
ok: run: sidekiq: (pid 158606) 453s

## 重启服务
root@gitlab:~# gitlab-ctl restart 

## 查看状态
root@gitlab:~# gitlab-ctl status 

## 停止
root@gitlab:~# gitlab-ctl stop
```

#### 访问测试
    
如果使用域名需要在本机添加hosts解析    

```shell
root@gitlab:~# vim /etc/hosts
172.16.41.34 gitlab.example.com
```
![gitlab登录](https://pic.imgdb.cn/item/64ae4edf1ddac507cc9be1b5.jpg)
    
获取初始密码,并登录。    
```shell
root@gitlab:~# cat /etc/gitlab/initial_root_password 
# WARNING: This value is valid only in the following conditions
#          1. If provided manually (either via `GITLAB_ROOT_PASSWORD` environment variable or via `gitlab_rails['initial_root_password']` setting in `gitlab.rb`, it was provided before database was seeded for the first time (usually, the first reconfigure run).
#          2. Password hasn't been changed manually, either via UI or via command line.
#
#          If the password shown here doesn't work, you must reset the admin password following https://docs.gitlab.com/ee/security/reset_user_password.html#reset-your-root-password.

Password: 7pCKWlZBRAjPo/ZTwjeSS7C16oBy74waGUPzkly2DnU=

# NOTE: This file will be automatically deleted in the first reconfigure run after 24 hours.
```
![登录成功页面](https://pic.imgdb.cn/item/64ae4f841ddac507cc9e4e0f.jpg)

### Docker方式部署
#### 安装docker
```shell
# 安装必要的一些系统工具
root@gitlab:~# sudo apt-get remove docker docker-engine docker.io
root@gitlab:~# sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common

# 安装GPG证书
root@gitlab:~# curl -fsSL https://repo.huaweicloud.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -

# 写入软件源信息
root@gitlab:~# sudo add-apt-repository "deb [arch=amd64] https://repo.huaweicloud.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"

# 更新并安装Docker-CE
root@gitlab:~# apt update
root@gitlab:~# apt install -y docker-ce

# 配置镜像加速
root@gitlab:~# cat > /etc/docker/daemon.json <<EOF
{
"registry-mirrors": [
"https://docker.mirrors.ustc.edu.cn",
"https://hub-mirror.c.163.com",
"https://reg-mirror.qiniu.com",
"https://registry.docker-cn.com"
],
"exec-opts": ["native.cgroupdriver=systemd"] 
}
EOF

# 重启服务
root@gitlab:~# systemctl restart docker
```

#### 下载镜像及启动
```shell
# 下载镜像
root@gitlab:~# docker pull gitlab/gitlab-ce:15.0.3-ce.0

# 创建数据目录
root@gitlab:~# mkdir -p /data/gitlab/{config,logs,data}
root@gitlab:~# chmod +x -R /data/gitlab

# 启动容器
root@gitlab:~# docker run -itd --name gitlab \
-p 443:443 \
-p 80:80 \
--restart always \
-v /data/gitlab/config:/etc/gitlab \
-v /data/gitlab/logs:/var/log/gitlab \
-v /data/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce:15.0.3-ce.0

# 查看容器状态
root@gitlab:~# docker ps
CONTAINER ID   IMAGE                          COMMAND             CREATED          STATUS                    PORTS                                                                              NAMES
6d118f714c9b   gitlab/gitlab-ce:15.0.3-ce.0   "/assets/wrapper"   28 minutes ago   Up 28 minutes (healthy)   0.0.0.0:80->80/tcp, :::80->80/tcp, 22/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   gitlab

# 查看运行日志
root@gitlab:~# docker logs -f gitlab

```

#### 访问测试
![docker页面访问](https://pic.imgdb.cn/item/64ae6d001ddac507cc1c4aaa.png)

#### 获取初始密码

```shell
# 进入容器
root@gitlab:~# docker exec -it gitlab bash

# 获取密码
root@6d118f714c9b:/# cd etc/gitlab/
root@6d118f714c9b:/etc/gitlab# ls
gitlab-secrets.json  initial_root_password  ssh_host_ecdsa_key.pub  ssh_host_ed25519_key.pub  ssh_host_rsa_key.pub
gitlab.rb            ssh_host_ecdsa_key     ssh_host_ed25519_key    ssh_host_rsa_key          trusted-certs
root@6d118f714c9b:/etc/gitlab# cat initial_root_password 
# WARNING: This value is valid only in the following conditions
#          1. If provided manually (either via `GITLAB_ROOT_PASSWORD` environment variable or via `gitlab_rails['initial_root_password']` setting in `gitlab.rb`, it was provided before database was seeded for the first time (usually, the first reconfigure run).
#          2. Password hasn't been changed manually, either via UI or via command line.
#
#          If the password shown here doesn't work, you must reset the admin password following https://docs.gitlab.com/ee/security/reset_user_password.html#reset-your-root-password.

Password: 9RpjLTbhv1jh4uCTXqCuzSfM/FWX4a55IoOJmsY4HCg=

# NOTE: This file will be automatically deleted in the first reconfigure run after 24 hours.
```

#### 登录成功
![docker login successful](https://pic.imgdb.cn/item/64ae6e121ddac507cc20c58e.png)