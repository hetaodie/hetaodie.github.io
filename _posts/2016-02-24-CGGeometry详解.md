---
layout: post
title: CGGeometry详解
description: 本文详细讲解了CGGeometry的详细用法
categories: [iOS]
tags: [iOS, CGGeometry]

image: /assets/media/CGGeometry/CGGeometry.jpg
---

![]({{ image }})

**目录**

* 目录
 {:toc  }

# 几个系统定义的量

'const CGPoint CGPointZero'<br />
零点，与CGPointMake(0, 0)等效

'const CGSize CGSizeZero'<br />
零尺寸，与CGSizeMake(0, 0)等效

'const CGRect CGRectZero'<br />
零矩形，与CGRectMake(0, 0, 0, 0)等效

'const CGRect CGRectNull'<br />
空矩形，这个和零矩形并不相同，当我们返回两个不相交矩形的交集时，会返回空矩形。

'const CGRect CGRectInfinite'<br />
无限的矩形

{% highlight ruby %}
{% endhighlight %}



<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVPlayerDemo