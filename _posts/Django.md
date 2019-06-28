# Django



1、下载Django

```
wget http://labfile.oss.aliyuncs.com/courses/1127/mysite.zip
```



## 设计模型Model

- Django无需数据库就可以使用，通过对象关系映射器（Object-relational mapping），仅使用Python代码就可以描述数据结构.

```
# myProject/myApp/models.py
from django.db import models
class book(models.Model):
    name = models.CharField(max_length=100)
    pub_date = models.DateField()
    
    
models.py 文件主要用一个 Python 类来描述数据表。 称为 模型(model) 。 运用这个类，你可以通过简单的 Python 代码来创建、检索、更新、删除 数据库中的记录而无需写一条又一条的SQL语句。 在这里我们创建了一个book模型，并定义了name和pub_date属性。
```



## 设计视图Views



- 在模型被定义之后，我们便可以在视图中引用模型。通常，视图根据参数检索数据，加载一个模板，并使用检索到的数据呈现模板

```
# myProject/myApp/views.py
from django.shortcuts import render
from .models import Person

def book_archive(request, year):
    book_list = Person.objects.filter(birth_year = year)
    context = {'year': year, 'book_list': book_list}
    return render(request, 'books/year_archive.html', context)
    
    
views.py 文件包含了页面的业务逻辑。 book_archive()函数叫做视图。 这里还用到了year_archive.html模板。
```



## 设计链接Urls

```
# myProject/myApp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('books/<int:year>', views.year_archive),
]
```

`urls.py` 指出了什么样的 URL 调用什么视图。 在这个例子中 `books/xxxxx` 将会调用 `year_archive()` 这个函数。也就是说，在进入这个链接时，会返回视图函数的结果



## 设计模板Templates

```
# /template/year_archive.html
{% block title %}Books for {{ year }}{% endblock %}

{{% block content %}}
<h1>Articles for {{years}}</h1>

{% for book in book_list %}
    <p>{{ book.name }}</p>
    <p>Published {{ book.pub_date|date:"F j, Y" }}</P>
{% endfor %}
{% end block %}

```

`year_archive.html` 是 html 模板。 使用带基本逻辑声明的模板语言，如`{% for book in book_list %}`，它试图将函数返回的结果显示在网页上





# Django 的生成环境

## 环境

- Python==3.5.2
- Django==2.0.6

- 安装Django

  $ sudo pip3 install Django==2.0.6

- 测试Django安装​    

```
$ python3
>>> import django
>>> print(django.get_version())
2.0.6

```



## 创建Django项目

```
$django-admin startproject mysite
```



- 以下是mysite的目录结构

```
mysite/
    manage.py
    mysite/
        __init__.py
        settings.py
        urls.py
        wsgi.py
```

这些目录和文件的作用分别是：

- 外层的`mysite/`：是项目的容器，可以为任意名字。
- `manage.py`：一种让你可以使用各种方式管理Django项目的命令行工具。在`mysite/`目录下输入`python3 manage.py help`，看一看它都能做什么。
- 内层的`mysite/`：包含项目，是一个纯Python包。你可以在包里调用它内部的任何东西。
- `__init__.py`：一个空文件，告诉Python这个目录应该被认为是一个Python包。一般，你不需要去修改它。
- `settings.py`：Django项目的配置文件。
- `urls.py`：Django项目的URL声明。
- `wsgi.py`：r行在WSGI兼容的Web服务器的入口。



## 启动Django

```
python3 manage.py runserver

```

python3 manage.py runserver