---
layout: post
title: CGGeometry详解
description: 本文详细讲解了CGGeometry的详细用法
categories: [iOS]
tags: [iOS, CGGeometry]

image: /assets/media/CGGeometry/CGGeometry.jpg
---

![]({{page.image }})

**目录**

* 目录
 {:toc  }

# 几个系统定义的量

`const CGPoint CGPointZero`<br />
零点，与CGPointMake(0, 0)等效

`const CGSize CGSizeZero`<br />
零尺寸，与CGSizeMake(0, 0)等效

`const CGRect CGRectZero`<br />
零矩形，与CGRectMake(0, 0, 0, 0)等效

`const CGRect CGRectNull`<br />
空矩形，这个和零矩形并不相同，当我们返回两个不相交矩形的交集时，会返回空矩形。

`const CGRect CGRectInfinite`<br />
无限的矩形

# 一些常用方法

## CGRectOffset

CGRectOffset: 返回一个原点在源矩形基础上进行了偏移的矩形。

{% highlight ruby %}

CGRect CGRectOffset(
  CGRect rect,
  CGFloat dx,
  CGFloat dy
)

{% endhighlight %}

注意，用这个你只改变了矩形的原点。

## CGRectInset

CGRectInset: 返回一个与源矩形共中心点的，或大些或小些的新矩形。

{% highlight ruby %}

CGRect CGRectInset(
  CGRect rect,
  CGFloat dx,
  CGFloat dy
)

{% endhighlight %}

## CGRectIntegral

CGRectIntegral: 返回包围源矩形的最小整数矩形。

{% highlight ruby %}

CGRect CGRectIntegral (
  CGRect rect
)

{% endhighlight %}

将CGRect 取整到最近的完整点是非常重要的。小数值会让边框画在像素边界处。因为像素已经是最小单元（不能再细分），小数值会使绘制时取周围几个像素的平均值，这样看起来就模糊了。

CGRectIntegral 将表示原点的值向下取整，表示大小的值向上取整，这样就保证了你的绘制代码平整地对齐到像素边界。

作为一个经验性的原则，如果你在执行任何一个可能产生小数值的操作（例如除法，CGGetMid[X|Y]，或是 CGRectDivide），在把一矩形作为视图的边框之前应该用CGRectIntegral正则化它。

# 取值辅助函数 CGRectGet[Min|Mid|Max][X|Y]

`CGFloat CGRectGetMinX(CGRect rect);` <br />
获得矩形最左边的x值

`CGFloat CGRectGetMidX(CGRect rect);`<br />
获取矩形中点的x值

`CGFloat CGRectGetMaxX(CGRect rect);`<br />
获取矩形最右端的x值

`CGFloat CGRectGetMinY(CGRect rect);`<br />
获取矩形最上端的y值

`CGFloat CGRectGetMidY(CGRect rect);`<br />
获取矩形中心点的y值

`CGFloat CGRectGetMaxY(CGRect rect);`<br />
获取矩形最下端的y值

`CGFloat CGRectGetWidth(CGRect rect);`<br />
获取矩形宽度

`CGFloat CGRectGetHeight(CGRect rect);`<br />
获取矩形高度

# 多个矩阵的判断

`bool CGRectEqualToRect(CGRect rect1, CGRect rect2);`<br />
判断两个矩形是否相等

`bool CGRectIsEmpty(CGRect rect);`<br />
判断是否为零矩形

`CGRectIsNull(CGRect rect);`<br />
判断是否为空矩形

`bool CGRectIsInfinite(CGRect rect);`<br />
判断是否为无限矩形


`CGRect CGRectUnion(CGRect r1, CGRect r2);`<br />
返回两个矩形的并集

`CGRect CGRectIntersection(CGRect r1, CGRect r2);`<br />
返回两个矩形的交集，如果没有交集，返回空矩形

`bool CGRectContainsPoint(CGRect rect, CGPoint point);`<br />
判断点是否在矩形内

`bool CGRectContainsRect(CGRect rect1, CGRect rect2);`<br />
判断矩形1是否包含矩形2

`bool CGRectIntersectsRect(CGRect rect1, CGRect rect2);`<br />
判断矩形1和矩形2是否相交

`CFDictionaryRef CGPointCreateDictionaryRepresentation(CGPoint point);`<br />
返回一个表示点的字典

`bool CGPointMakeWithDictionaryRepresentation(CFDictionaryRef dict,
  CGPoint *point);`<br />
将字典转换为点

`CFDictionaryRef CGSizeCreateDictionaryRepresentation(CGSize size);`<br />
返回一个表示尺寸的字典

`bool CGSizeMakeWithDictionaryRepresentation(CFDictionaryRef dict,
  CGSize *size) ;`<br />
将字典转换为尺寸

`CFDictionaryRef CGRectCreateDictionaryRepresentation(CGRect);`
返回一个表示矩形的字典

`bool CGRectMakeWithDictionaryRepresentation(CFDictionaryRef dict,
  CGRect *rect);`
将字典转化为矩形
 

{% highlight ruby %}
{% endhighlight %}



<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVPlayerDemo