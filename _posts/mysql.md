# mysql



## 启动mysql



```
# 启动mysql服务
sudo  service mysql start
# 使用root 用户登录 
mysql -u root

#使用命令 show databases;，查看有哪些数据库（注意不要漏掉分号 ;）
show databases;

# 选择连接其中一个数据库，语句格式为 use <数据库名>，这里可以不用加分号，这里我们选择 information_schema 数据库
use information_schema

#使用命令 show tables; 查看数据库中有哪些表
show tables

#使用命令 quit 或者 exit 退出 MySQL

```

使用命令 `quit` 或者 `exit` 退出 MySQL



# 创建数据库并插入数据



