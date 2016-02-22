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

# 安全的主线程运行的宏定义

## 同步切换到主线程

{% highlight ruby %}

\#define dispatch_main_sync_safe(block)\
    if ([NSThread isMainThread]) {\
        block();\
    } else {\
        dispatch_sync(dispatch_get_main_queue(), block);\
    }
{% endhighlight %}

## 异步切换到主线程
{% highlight ruby %}

\#define dispatch_main_async_safe(block)\
    if ([NSThread isMainThread]) {\
        block();\
    } else {\
        dispatch_async(dispatch_get_main_queue(), block);\
    }
    
{% endhighlight %}

# ios中_cmd 的用法

_cmd在Objective-C的方法中表示当前方法的selector，正如同self表示当前方法调用的对象实例。

# 标准的多线程单例定义方式
{% highlight ruby %}

+(id)sharedManager {
    static dispatch_once_t once;
    static id instance;
    dispatch_once(&once, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

{% endhighlight %}

# const,static,extern简介

## const与宏的区别

- const简介:之前常用的字符串常量，一般是抽成宏，但是苹果不推荐我们抽成宏，推荐我们使用const常量
	- 编译时刻:宏是预编译（编译之前处理），const是编译阶段。
	- 编译检查:宏不做检查，不会报编译错误，只是替换，const会编译检查，会报编译错误。
	- 宏的好处:宏能定义一些函数，方法。 const不能。
	- 宏的坏处:使用大量宏，容易造成编译时间久，每次都需要重新替换。

## const作用：限制类型
- const仅仅用来修饰右边的变量（基本数据变量p，指针变量*p）。
- 被const修饰的变量是只读的。

**const基本使用**

{% highlight ruby %}
	
	// const两种用法
    // const:修饰基本变量p
    // 这两种写法是一样的，const只修饰右边的基本变量b
    const int b = 20; // b:只读变量
    int const b = 20; // b:只读变量

{% endhighlight %}


{% highlight ruby %}

	// const修饰指针变量访问的内存空间，修饰的是右边*p1，
    // 两种方式一样
    const int *p1; // *p1：常量 p1:变量
    int const *p1; // *p1：常量 p1:变量
    
    // const修饰指针变量p1
    int * const p1; // *p1:变量 p1:常量
    
{% endhighlight %}

## const开发中使用场景:

- 当一个方法参数只读.
- 定义只读全局变量

{% highlight ruby %}

// 定义只读全局常量
NSString * const str  = @"123";

{% endhighlight %}


## static作用

- 修饰局部变量：
	1. 延长局部变量的生命周期,程序结束才会销毁。
	2. 局部变量只会生成一份内存,只会初始化一次。
- 修饰全局变量
	1. 只能在本文件中访问,修改全局变量的作用域,生命周期不会改

## extern

### extern作用

- 只是用来获取全局变量(包括全局静态变量)的值，不能用于定义变量。

### extern工作原理

- 先在当前文件查找有没有全局变量，没有找到，才会去其他文件查找。

# inline
## 定义

   有函数的结构，但不具备函数的性质，类似于宏替换。代码中使用inline定义，能否形成内联函数，还要看编译器对内联函数体内部的定义的具体处理。
	 
## 产生的动机

 消除函数调用产生的开销，适合与小内存函数，频繁执行的函数。

## 注意事项：

不能使用循环语句；不能使用开关语句；不能使用递归调用；定义在第一次调用之前；

# Volatile 
## 定义

一个定义为volatile的变量是说这变量可能会被意想不到地改变，这样，编译器就不会去假设这个变量的值了。精确地说就是，优化器在用到这个变量时必须每次都小心地重新读取这个变量的值，而不是使用保存在寄存器里的备份。 

## 下面是volatile变量的几个例子：

- 并行设备的硬件寄存器（如：状态寄存器）
- 一个中断服务子程序中会访问到的非自动变量(Non-automatic variables)
- 多线程应用中被几个任务共享的变量  

{% highlight ruby %}
{% endhighlight %}



<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVPlayerDemo