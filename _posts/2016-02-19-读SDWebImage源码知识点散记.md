---
layout: post
title: 读SDWebImage源码知识点散记
description: 本文记录了，在阅读SDWebImage源码的过程中，对一些不常用的知识点的记录，此文知识点相对来说比较零散
categories: [iOS]
tags: [iOS, UIImage]

<!--image1: /assets/media/avplayer/AVPlayerAD.png-->
---

**目录**

* 目录
 {:toc  }

# objc_setAssociatedObject

## 作用
- 把两个对象关联起来
- 给已经存在的类添加自定义的属性

**说明**

- 关联是基于关键字的，因此，我们可以为任何对象增加任意多的关联，每个都使用不同的关键字即可。关联是可以保证被关联的对象在关联对象的整个生命周期都是可用的（在垃圾自动回收环境下也不会导致资源不可回收）。
-  使用关联，我们可以不用修改类的定义而为其对象增加存储空间。这在我们无法访问到类的源码的时候或者是考虑到二进制兼容性的时候是非常有用。

<br />

## 函数说明

### objc_setAssociatedObject

{% highlight ruby %}

void objc_setAssociatedObject(id object, void *key, id value, objc_AssociationPolicy policy)


{% endhighlight %}

**说明**

该函数需要四个参数：源对象，关键字，关联的对象和一个关联策略。

- object:即源对象，需要添加属性的类或是需要跟其他对象进行关联的对象。
- key：关键字是一个void类型的指针。每一个关联的关键字必须是唯一的。通常都是会采用静态变量来作为关键字。通常推荐key使用static char类型——使用指针或许更好，key值是一个唯一的常量，并只在getters和setters方法内部使用： 例如：`static char kAssociatedObjectKey;` 。

- 关联策略：
  - `OBJC_ASSOCIATION_ASSIGN ` ：给关联对象指定弱引用（`@property (assign) 或 @property(unsafe_unretained)`）
  - `OBJC_ASSOCIATION_RETAIN_NONATOMIC ` ：给关联对象指定非原子的强引用(`@property (nonatomic, strong)`）
  - `OBJC_ASSOCIATION_COPY_NONATOMIC ` ：给关联对象指定非原子的copy特性(`@property (nonatomic, copy)`）（最常用）
  - `OBJC_ASSOCIATION_RETAIN ` ：给关联对象指定原子的强引用(`@property (atomic, strong)`）
  - `OBJC_ASSOCIATION_COPY ` ：给关联对象指定原子copy特性(`@property (atomic, copy)`）

### objc_getAssociatedObject

{% highlight ruby %}

id objc_getAssociatedObject(id object, void *key)

{% endhighlight %}

**作用**

获得key绑定的值。

**说明**

该函数需要两个参数：源对象，关键字。

- object:源对象
- key：set时设定的值

### objc_removeAssociatedObjects

{% highlight ruby %}

void bjc_removeAssociatedObjects(id object)

{% endhighlight %}

**作用**

删除所有与object绑定的对象。

**说明**

该函数需要一个参数：源对象。

- object:源对象


如果只是想删除object中某一个key的绑定对象，应该使用如下代码：

{% highlight ruby %}

objc_setAssociatedObject(object, &key, nil, OBJC_ASSOCIATION_ASSIGN);  

{% endhighlight %}

<!--![]({{ page.image1 }})-->

<!--# Demo

具体Demo代码下载：

[AVPlayerDemo][1]-->


<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVPlayerDemo