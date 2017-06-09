---
layout: post
title: Android之Camera
description: 详细讲解了Camera实时视频的实现，并可以实时捕获视频的流数据。

tagline: original post at hetaodie.github.io
categories: [Android]
tags: [Android Studio]

image1: /assets/media/android/camera1.png
image2: /assets/media/android/camera2.png
image3: /assets/media/android/camera3.png
image4: /assets/media/android/camera4.png
image5: /assets/media/android/camera5.png
image6: /assets/media/android/camera6.png
image7: /assets/media/android/camera7.png

---

**目录**

* 目录
 {:toc  }
 
 
#  相关权限

## 相机权限：应用必须拥有使用相机设备的权限


{% highlight ruby %}

<uses-permission android:name="android.permission.CAMERA" />

{% endhighlight %}

## 相机功能：应用必须声明一些与相机的一些功能。

{% highlight ruby %}

<uses-feature android:name="android.hardware.camera" />

{% endhighlight %}

**如果应用可以在没有相机或者某些特定相机功能的设备上也能正常运行，则修改为如下代码：**

{% highlight ruby %}

<uses-feature android:name="android.hardware.camera" android:required="false" />

{% endhighlight %}

##  存储权限：如果要讲照片/视频存到内存卡中，需要声明此权限

{% highlight ruby %}

<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

{% endhighlight %}

## 录音权限：录制视频时，必须声明次权限

{% highlight ruby %}

<uses-permission android:name="android.permission.RECORD_AUDIO" />

{% endhighlight %}

## 定位权限：

{% highlight ruby %}

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
...
<!-- Needed only if your app targets Android 5.0 (API level 21) or higher. -->
<uses-feature android:name="android.hardware.location.gps" />

{% endhighlight %}

# Camera的基本使用流程
## 打开的流程
1. 检测相机硬件
**如果应用没有在mainfest中声明需要相机，在运行时就要使用PackageManager.hasSystemFeature()方法检测相机是否可用。**
{% highlight ruby %}

/** Check if this device has a camera */
private boolean checkCameraHardware(Context context) {
    if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)){
        // this device has a camera
        return true;
    } else {
        // no camera on this device
        return false;
    }
}

{% endhighlight %}
2. 打开摄像头，使用open方法：
<br />这个方法有两种形式，一种是无参数形式的，默认打开是后置摄像头，还有一种方式是有参数像是，可以通过传递的参数来决定打开是前置还是后置摄像头，0代表后置摄像头，1代表前置摄像头。<br />
3. 设置摄像头的预览数据界面
<br />可以不进行设置的，如果预览一般有两种方式，一种是调用setPreviewDisplay方法设置SurfaceHolder，也就是和SurfaceView进行绑定了，还有一种就是调用setPreviewTexture方法设置SurfaceTexture的，这个就和GLSurfaceView以及TextureView绑定了<br />
4. 获取到Camera.Parameters参数信息
<br />通过getParameters方法获取摄像头已有的参数信息，然后进行相关设置，比如尺寸大小，方向，数据格式等信息。<br />
5. 在把添加好的参数信息设置回去，调用startPreview开始预览效果了

![]({{ page.image1 }})

## 销毁的流程
1. 将摄像头的预览清空
2. 停止预览效果
3. 释放摄像头
4. 置空摄像头对象

![]({{ page.image2 }})

# Camera摄像头的前置和后置区分

Android中的摄像头Camera是区分前置和后置的，所以这里就要做一个前置和后置摄像头的切换功能了，我们可以通过一个方法来获取当前系统的摄像头个数，以及摄像头的信息：<br />

![]({{ page.image3 }})

那么切换摄像头Android中的做法是把之前的摄像头先销毁在重新初始化下一个摄像头：

# Camera摄像头的数据格式

Android中摄像头的数据格式是指原生的每一帧数据，他是有指定格式的，而这些原生的每一帧数据可以有两个地方获取，一个是添加回调，在onPreviewFrame(byte[] data, Camera camera)回调方法中获取，还有一个就是拍照的时候回调方法：onPictureTaken(byte[] data, Camera camera)，当然如果想处理数据的话，肯定是在第一个回调方法中去进行操作了，第二种必须在拍照的时候把当前拍照的一帧数据拿到，这明显不靠谱。不管是那种获取一帧数据，这些都是有一定格式的，如果要后期处理的话，那么必须要做一次格式转化，Android中的摄像头数据的格式有两种，可以进行设置，当然直接使用代码可以获取到摄像头可以支持的数据格式：在Camera.Parameters类的getSupportedPreviewFormats方法即可获得：<br />

![]({{ page.image4 }})

# Camera摄像头方向和数据尺寸

Android中摄像头如果我们想要得到预期的数据的话，那么方向和尺寸非常关键，Camera中提供了一些方法可以进行这些参数的设置的，首先来看一下摄像头的方向问题：<br />

![]({{ page.image5 }})

我们看到这里有两个方法可以来设置摄像头的方向信息，一个是Camera类本身的setDisplayOrientation方法，一个Camera.Parameters类的setRotation方法，setPreviewSize是设置视频的预览尺寸的，第二个方法setPictureSize是设置拍照之后的图片尺寸大小的

# Camera摄像头的数据采集以及二次加工

Android中的摄像头Camera提供了两个方式回调接口来获取每一帧数据：<br />

- 第一种方式：setPreviewCallback方法，设置回调接口：PreviewCallback在回调方法：onPreviewFrame(byte[] data, Camera camera) 中处理每一帧数据

- 第二种方式：setPreviewCallbackWithBuffer方法，同样设置回调接口：PreviewCallback，不过还需要一个方法配合使用：addCallbackBuffer，这个方法接受一个byte数组。

**第二种方式和第一种方式唯一的区别：**

第一种方式是onPreviewFrame回调方法会在每一帧数据准备好了就调用，但是第二种方式是在需要在前一帧的onPreviewFrame方法中调用addCallbackBuffer方法，下一帧的onPreviewFrame才会调用，同时addCallbackBuffer方法的参数的byte数据就是每一帧的原数据。所以这么一看就好理解了，就是第一种方法的onPreviewFrame调用是不可控制的，就是每一帧数据准备好了就回调，但是第二种方法是可控的，我们通过addCallbackBuffer的调用来控制onPreviewFrame的回调机制。

**注意：**

因为第二种方式在调用的时候有点注意的地方：

1》在调用Camera.startPreview()接口前，我们需要setPreviewCallbackWithBuffer，而setPreviewCallbackWithBuffer之前我们需要重新addCallbackBuffer，因为setPreviewCallbackWithBuffer 使用时需要指定一个字节数组作为缓冲区，用于预览图像数据 即addCallbackBuffer，然后你在onPerviewFrame中的data才会有值。
2》从上面看来，我们设置addCallbackBuffer的地方有两个，一个是在startPreview之前，一个是在onPreviewFrame中，这两个都需要调用，如果在onPreviewFrame中不调用，那么，就无法继续回调到onPreviewFrame中. <br />

![]({{ page.image6 }})

{% highlight ruby %}
{% endhighlight %}


<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVAudioRecorderDemo.git
