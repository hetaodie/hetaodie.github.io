---
layout: post
title: CADisplayLink
description: 本文详细介绍了CADisplayLink的使用。

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [javaScriptCore]


---

**目录**

* 目录
 {:toc  }

# 简介

CADisplayLink是一个能让我们以和屏幕刷新率相同的频率将内容画到屏幕上的定时器。我们在应用中创建一个新的 CADisplayLink 对象，把它添加到一个runloop中，并给它提供一个 target 和selector 在屏幕刷新的时候调用。

一但 CADisplayLink 以特定的模式注册到runloop之后，每当屏幕需要刷新的时候，runloop就会调用CADisplayLink绑定的target上的selector，这时target可以读到 CADisplayLink 的每次调用的时间戳，用来准备下一帧显示需要的数据。例如一个视频应用使用时间戳来计算下一帧要显示的视频数据。在UI做动画的过程中，需要通过时间戳来计算UI对象在动画的下一帧要更新的大小等等。
在添加进runloop的时候我们应该选用高一些的优先级，来保证动画的平滑。可以设想一下，我们在动画的过程中，runloop被添加进来了一个高优先级的任务，那么，下一次的调用就会被暂停转而先去执行高优先级的任务，然后在接着执行CADisplayLink的调用，从而造成动画过程的卡顿，使动画不流畅。


# 功能

CADisplayLink最主要的特征是能提供一个周期性的调用我们赋给它的selector的机制，从这点上看它很像定时器NSTimer。
# 使用方式

{% highlight ruby %}

- (void)startDisplayLink  
{  
    self.displayLink = [CADisplayLink displayLinkWithTarget:self  
                                                   selector:@selector(handleDisplayLink:)];  
    [self.displayLink addToRunLoop:[NSRunLoop currentRunLoop]  
                           forMode:NSDefaultRunLoopMode];  
}  
  
- (void)handleDisplayLink:(CADisplayLink *)displayLink  
{  
  //do something  
}  
  
- (void)stopDisplayLink  
{  
    [self.displayLink invalidate];  
    self.displayLink = nil;  
}  

{% endhighlight %}

当把CADisplayLink对象add到runloop中后，selector就能被周期性调用，类似于NSTimer被启动了；执行invalidate操作时，CADisplayLink对象就会从runloop中移除，selector调用也随即停止，类似于NSTimer的invalidate方法。

# 特性
下面结合NSTimer来介绍CADisplayLink，与NSTimer不同的地方有：
## 原理不同
CADisplayLink是一个能让我们以和屏幕刷新率同步的频率将特定的内容画到屏幕上的定时器类。CADisplayLink以特定模式注册到runloop后，每当屏幕显示内容刷新结束的时候，runloop就会向CADisplayLink指定的target发送一次指定的selector消息， CADisplayLink类对应的selector就会被调用一次。
NSTimer以指定的模式注册到runloop后，每当设定的周期时间到达后，runloop会向指定的target发送一次指定的selector消息。
## 周期设置方式不同
iOS设备的屏幕刷新频率(FPS)是60Hz，因此CADisplayLink的selector默认调用周期是每秒60次，这个周期可以通过frameInterval属性设置，CADisplayLink的selector每秒调用次数=60/frameInterval。比如当frameInterval设为2，每秒调用就变成30次。因此，CADisplayLink周期的设置方式略显不便。
NSTimer的selector调用周期可以在初始化时直接设定，相对就灵活的多。
## 精确度不同
iOS设备的屏幕刷新频率是固定的，CADisplayLink在正常情况下会在每次刷新结束都被调用，精确度相当高。
NSTimer的精确度就显得低了点，比如NSTimer的触发时间到的时候，runloop如果在忙于别的调用，触发时间就会推迟到下一个runloop周期。更有甚者，在OS X v10.9以后为了尽量避免在NSTimer触发时间到了而去中断当前处理的任务，NSTimer新增了tolerance属性，让用户可以设置可以容忍的触发的时间范围。
## 使用场合
从原理上不难看出，CADisplayLink使用场合相对专一，适合做界面的不停重绘，比如视频播放的时候需要不停地获取下一帧用于界面渲染。
NSTimer的使用范围要广泛的多，各种需要单次或者循环定时处理的任务都可以使用。

# 重要属性

下面不完整的列出了CADisplayLink的几个重要属性：
## frameInterval
可读可写的NSInteger型值，标识间隔多少帧调用一次selector方法，默认值是1，即每帧都调用一次。官方文档中强调，当该值被设定小于1时，结果是不可预知的。
## duration
只读的CFTimeInterval值，表示两次屏幕刷新之间的时间间隔。需要注意的是，该属性在target的selector被首次调用以后才会被赋值。selector的调用间隔时间计算方式是：时间=duration×frameInterval。
现存的iOS设备屏幕的FPS都是60Hz，这一点可以从CADisplayLink的duration属性看出来。duration的值都是0.166666…，即1/60。尽管如此，我们并没法确定苹果不会改变FPS，如果以后某一天将FPS提升到了120Hz了怎么办呢？这时，你设置了frameInterval属性值为2期望每秒刷新30次，却发现每秒刷新了60次，结果可想而知，出于安全考虑，还是先根据duration判断屏幕的FPS再去使用CADisplayLink。
## timestamp
只读的CFTimeInterval值，表示屏幕显示的上一帧的时间戳，这个属性通常被target用来计算下一帧中应该显示的内容。
打印timestamp值，其样式类似于：
[objc] view plain copy 在CODE上查看代码片派生到我的代码片
179699.631584  
虽然名为时间戳，但这和常见的unix时间戳差异很大，事实上这是CoreAnimation使用的时间格式。每个CALayer都有一个本地时间（CALayer本地时间的具体作用会在后续文章中说明），可以获取当前CALayer的本地时间并打印：
[objc] view plain copy 在CODE上查看代码片派生到我的代码片
CFTimeInterval localLayerTime = [myLayer convertTime:CACurrentMediaTime() fromLayer:nil];  
NSLog("localLayerTime:%f",localLayerTime);  

# 注意
iOS并不能保证能以每秒60次的频率调用回调方法，这取决于：
1. CPU的空闲程度
如果CPU忙于其它计算，就没法保证以60HZ执行屏幕的绘制动作，导致跳过若干次调用回调方法的机会，跳过次数取决CPU的忙碌程度。
2. 执行回调方法所用的时间
如果执行回调时间大于重绘每帧的间隔时间，就会导致跳过若干次回调调用机会，这取决于执行时间长短。

点击去github下载[CADisplayLinkDemo][1]


{% highlight ruby %}


{% endhighlight %}

<!--本文所用的超链接-->

[1]:https://github.com/Glow-Inc/CADisplayLinkDemo.git
