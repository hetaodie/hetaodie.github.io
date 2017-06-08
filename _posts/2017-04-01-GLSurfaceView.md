---
layout: post
title: GLSurfaceview
description: 详细讲解了SurfaceView特点，原理和实现方式

tagline: original post at hetaodie.github.io
categories: [Android]
tags: [Android Studio]

image1: /assets/media/android/surfaceview1.jpg
image2: /assets/media/android/AsyncTask2.jpg
image3: /assets/media/android/AsyncTask3.jpg

---

**目录**

* 目录
 {:toc  }

 
# 优势

![]({{ page.image1 }})

1. SurfaceView的刷新处于主动，有利于频繁的更新画面。
2. SurfaceView的绘制在子线程进行，避免了UI线程的阻塞。
3. SurfaceView在底层实现了一个双缓冲机制，效率大大提升。

4. Surface是纵深排序的，这说明它总在自己所在的窗口的后面。SurfaceView 提供了一个可见区域，只有在这个可见区域内的surface部分内容才可见，可见区域外部部分不可 见。surface的排版显示受到视图层级关系的影响，它的兄弟节点会在顶端显示。这意味者surface的内容会被它的兄弟视图遮挡，这一特性可以用来放置遮盖物（overlays）(例如：文本和按钮等控件)。但是，当surface上面有透明控件时，它的每次变化都会引起框架重新计算它和顶层控件的透明效果，这会影响性能。可以通过SurfaceHolder接口访问这个surface,getHolder()方法可以得到这个接口。

# SurfaceView 的实现

1. 首先这个自定义的SurfaceView类必须继承SurfaceView实现SurfaceHolder.Callback接口。
2. 实现SurfaceHolder.Callback中的三个SurfaceView生命周期，分别为：


{% highlight ruby %}

surfaceCreated(SurfaceHolder holder)
surfaceChanged(SurfaceHolder holder, int format, int width, int height) 
surfaceDestroyed(SurfaceHolder holder)


{% endhighlight %}

# 例子


{% highlight ruby %}

public class PencilView extends SurfaceView implements SurfaceHolder.Callback, Runnable {
     private SurfaceHolder mHolder;
     private Canvas mCanvas;
     private boolean mIsRunning;

public PencilView(Context context) {
    this(context, null);
}

public PencilView(Context context, AttributeSet attrs) {
    this(context, attrs, 0);
}

public PencilView(Context context, AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
    init();
}

private void init() {
    mHolder = getHolder();
    mHolder.addCallback(this);
}

@Override
public void surfaceCreated(SurfaceHolder holder) {
    mIsRunning = true;
    new Thread(this).start();
}


@Override
public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

}

@Override
public void surfaceDestroyed(SurfaceHolder holder) {
    mIsRunning = false;
}

@Override
public void run() {
    long start = System.currentTimeMillis();

    while (mIsRunning) {
        draw();
    }
}

private void draw() {
    mCanvas = mHolder.lockCanvas();
    if (mCanvas != null) {
        try {
           //使用获得的Canvas做具体的绘制
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            mHolder.unlockCanvasAndPost(mCanvas);
        }
    }
}

{% endhighlight %}

# 常用api

**setZOrderMediaOverlay**

API5
控制surface view的surface是否放置在窗口中另一个正则surface view的顶部（但仍然在窗口本身之后）。 这通常用于将覆盖放置在底层媒体surface view的顶部。
注意，这必须在surface view的包含窗口附加到窗口管理器之前设置。
调用此方法将覆盖对setZOrderOnTop（boolean）的任何先前调用。

**SetZOrderOnTop**

API5
控制surface view的表面是否放置在其窗口的顶部。 通常，它放在窗口后面，以使其（大部分）看起来与层次结构中的视图合成。 通过设置此项，您可以将其放置在窗口上方。 这意味着SurfaceView的窗口的内容不会出现在它的表面之上。
注意，这必须在surface view的包含窗口附加到窗口管理器之前设置。
调用这将覆盖任何以前的调用setZOrderMediaOverlay（boolean）。


{% highlight ruby %}

{% endhighlight %}
<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVAudioRecorderDemo.git
