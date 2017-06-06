---
layout: post
title: Android之activity
description: 详细讲解了android的布局结构

tagline: original post at hetaodie.github.io
categories: [Android]
tags: [Android Studio]

image1: /assets/media/android/activity1.jpg
image3: /assets/media/android/activity3.jpg
image4: /assets/media/android/activity4.jpg
image5: /assets/media/android/activity5.jpg

---

**目录**

* 目录
 {:toc  }
 
#  Activity调用逻辑
![]({{ page.image1 }})


1、不设置Activity的android:configChanges时，切屏会重新调用各个生命周期，切横屏时会执行一次，切竖屏时会执行两次

2、设置Activity的android:configChanges="orientation"时，切屏还是会重新调用各个生命周期，切横、竖屏时只会执行一次

3、设置Activity的android:configChanges="orientation|keyboardHidden"时，切屏不会重新调用各个生命周期，只会执行onConfigurationChanged方法

4、当前Activity产生事件弹出Toast和AlertDialog的时候Activity的生命周期不会有改变

Activity运行时按下HOME键(跟被完全覆盖是一样的)：onSaveInstanceState --> onPause --> onStop，再次进入激活状态时： onRestart -->onStart--->onResume

# activity调用逻辑
![]({{ page.image3 }})

# activity 跳转

- 跳转不需要参数时:
 
{% highlight ruby %}
 
Intent intent = new Intent(this, SecondActivity.class);

startActivity(intent);

{% endhighlight %}

- 跳转需要参数时（数据少时）

{% highlight ruby %}

Intent intent = new Intent(this, SecondActivity.class);
intent.putExtra("key","someValue");
startActivity(intent);

{% endhighlight %}

- 跳转需要参数时（数据多时）

{% highlight ruby %}


Intent intent = new Intent(A.this, B.class);  
  
/* 通过Bundle对象存储需要传递的数据 */  
Bundle bundle = new Bundle();  
/*字符、字符串、布尔、字节数组、浮点数等等，都可以传*/  
bundle.putString("Name", "feng88724");  
bundle.putBoolean("Ismale", true);  
  
/*把bundle对象assign给Intent*/  
intent.putExtras(bundle);  
  
startActivity(intent);  

{% endhighlight %}

- 获取传递过来的数据

{% highlight ruby %}

    /*获取Intent中的Bundle对象*/  
    Bundle bundle = this.getIntent().getExtras();  

{% endhighlight %}



{% highlight ruby %}


{% endhighlight %}

# 系统给我们提供的常见的Activity


{% highlight ruby %}

//1.拨打电话
// 给移动客服10086拨打电话
Uri uri = Uri.parse("tel:10086");
Intent intent = new Intent(Intent.ACTION_DIAL, uri);
startActivity(intent);

//2.发送短信
// 给10086发送内容为“Hello”的短信
Uri uri = Uri.parse("smsto:10086");
Intent intent = new Intent(Intent.ACTION_SENDTO, uri);
intent.putExtra("sms_body", "Hello");
startActivity(intent);

//3.发送彩信（相当于发送带附件的短信）
Intent intent = new Intent(Intent.ACTION_SEND);
intent.putExtra("sms_body", "Hello");
Uri uri = Uri.parse("content://media/external/images/media/23");
intent.putExtra(Intent.EXTRA_STREAM, uri);
intent.setType("image/png");
startActivity(intent);

//4.打开浏览器:
// 打开Google主页
Uri uri = Uri.parse("http://www.baidu.com");
Intent intent  = new Intent(Intent.ACTION_VIEW, uri);
startActivity(intent);

//5.发送电子邮件:(阉割了Google服务的没戏!!!!)
// 给someone@domain.com发邮件
Uri uri = Uri.parse("mailto:someone@domain.com");
Intent intent = new Intent(Intent.ACTION_SENDTO, uri);
startActivity(intent);
// 给someone@domain.com发邮件发送内容为“Hello”的邮件
Intent intent = new Intent(Intent.ACTION_SEND);
intent.putExtra(Intent.EXTRA_EMAIL, "someone@domain.com");
intent.putExtra(Intent.EXTRA_SUBJECT, "Subject");
intent.putExtra(Intent.EXTRA_TEXT, "Hello");
intent.setType("text/plain");
startActivity(intent);
// 给多人发邮件
Intent intent=new Intent(Intent.ACTION_SEND);
String[] tos = {"1@abc.com", "2@abc.com"}; // 收件人
String[] ccs = {"3@abc.com", "4@abc.com"}; // 抄送
String[] bccs = {"5@abc.com", "6@abc.com"}; // 密送
intent.putExtra(Intent.EXTRA_EMAIL, tos);
intent.putExtra(Intent.EXTRA_CC, ccs);
intent.putExtra(Intent.EXTRA_BCC, bccs);
intent.putExtra(Intent.EXTRA_SUBJECT, "Subject");
intent.putExtra(Intent.EXTRA_TEXT, "Hello");
intent.setType("message/rfc822");
startActivity(intent);

//6.显示地图:
// 打开Google地图中国北京位置（北纬39.9，东经116.3）
Uri uri = Uri.parse("geo:39.9,116.3");
Intent intent = new Intent(Intent.ACTION_VIEW, uri);
startActivity(intent);

//7.路径规划
// 路径规划：从北京某地（北纬39.9，东经116.3）到上海某地（北纬31.2，东经121.4）
Uri uri = Uri.parse("http://maps.google.com/maps?f=d&saddr=39.9 116.3&daddr=31.2 121.4");
Intent intent = new Intent(Intent.ACTION_VIEW, uri);
startActivity(intent);

//8.多媒体播放:
Intent intent = new Intent(Intent.ACTION_VIEW);
Uri uri = Uri.parse("file:///sdcard/foo.mp3");
intent.setDataAndType(uri, "audio/mp3");
startActivity(intent);

//获取SD卡下所有音频文件,然后播放第一首=-= 
Uri uri = Uri.withAppendedPath(MediaStore.Audio.Media.INTERNAL_CONTENT_URI, "1");
Intent intent = new Intent(Intent.ACTION_VIEW, uri);
startActivity(intent);

//9.打开摄像头拍照:
// 打开拍照程序
Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE); 
startActivityForResult(intent, 0);
// 取出照片数据
Bundle extras = intent.getExtras(); 
Bitmap bitmap = (Bitmap) extras.get("data");

//另一种:
//调用系统相机应用程序，并存储拍下来的照片
Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE); 
time = Calendar.getInstance().getTimeInMillis();
intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(new File(Environment
.getExternalStorageDirectory().getAbsolutePath()+"/tucue", time + ".jpg")));
startActivityForResult(intent, ACTIVITY_GET_CAMERA_IMAGE);

//10.获取并剪切图片
// 获取并剪切图片
Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
intent.setType("image/*");
intent.putExtra("crop", "true"); // 开启剪切
intent.putExtra("aspectX", 1); // 剪切的宽高比为1：2
intent.putExtra("aspectY", 2);
intent.putExtra("outputX", 20); // 保存图片的宽和高
intent.putExtra("outputY", 40); 
intent.putExtra("output", Uri.fromFile(new File("/mnt/sdcard/temp"))); // 保存路径
intent.putExtra("outputFormat", "JPEG");// 返回格式
startActivityForResult(intent, 0);
// 剪切特定图片
Intent intent = new Intent("com.android.camera.action.CROP"); 
intent.setClassName("com.android.camera", "com.android.camera.CropImage"); 
intent.setData(Uri.fromFile(new File("/mnt/sdcard/temp"))); 
intent.putExtra("outputX", 1); // 剪切的宽高比为1：2
intent.putExtra("outputY", 2);
intent.putExtra("aspectX", 20); // 保存图片的宽和高
intent.putExtra("aspectY", 40);
intent.putExtra("scale", true);
intent.putExtra("noFaceDetection", true); 
intent.putExtra("output", Uri.parse("file:///mnt/sdcard/temp")); 
startActivityForResult(intent, 0);

//11.打开Google Market 
// 打开Google Market直接进入该程序的详细页面
Uri uri = Uri.parse("market://details?id=" + "com.demo.app");
Intent intent = new Intent(Intent.ACTION_VIEW, uri);
startActivity(intent);

//12.进入手机设置界面:
// 进入无线网络设置界面（其它可以举一反三）  
Intent intent = new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS);  
startActivityForResult(intent, 0);

//13.安装apk:
Uri installUri = Uri.fromParts("package", "xxx", null);   
returnIt = new Intent(Intent.ACTION_PACKAGE_ADDED, installUri);

//14.卸载apk:
Uri uri = Uri.fromParts("package", strPackageName, null);      
Intent it = new Intent(Intent.ACTION_DELETE, uri);      
startActivity(it); 

//15.发送附件:
Intent it = new Intent(Intent.ACTION_SEND);      
it.putExtra(Intent.EXTRA_SUBJECT, "The email subject text");      
it.putExtra(Intent.EXTRA_STREAM, "file:///sdcard/eoe.mp3");      
sendIntent.setType("audio/mp3");      
startActivity(Intent.createChooser(it, "Choose Email Client"));

//16.进入联系人页面:
Intent intent = new Intent();
intent.setAction(Intent.ACTION_VIEW);
intent.setData(People.CONTENT_URI);
startActivity(intent);

//17.查看指定联系人:
Uri personUri = ContentUris.withAppendedId(People.CONTENT_URI, info.id);//info.id联系人ID
Intent intent = new Intent();
intent.setAction(Intent.ACTION_VIEW);
intent.setData(personUri);
startActivity(intent);

{% endhighlight %}

# startActivityForResult用法详解

## 使用场景

有时，在页面跳转之后，需要返回到之前的页面，同时要保留用户之前输入的信息，这个时候该怎么办呢？

在页面跳转后，前一个Activity已经被destroy了。如果要返回并显示数据，就必须将前一个Activity再次唤醒，同时调用某个方法来获取并显示数据。

## 实现步骤

要实现这个效果，需要做以下几步：

1. 首先，从A页面跳转到B页面时，不可以使用"startActivity()"方法，而要使用"startActivityForResult"方法。

2. 在A页面的Activity中，需要重写"onActivityResult"方法
onActivityResult(int requestCode, int resultCode, Intent data)

第一个参数：这个整数requestCode提供给onActivityResult，是以便确认返回的数据是从哪个Activity返回的。 这个requestCode和startActivityForResult中的requestCode相对应。
第二个参数：这整数resultCode是由子Activity通过其setResult()方法返回。

第三个参数：一个Intent对象，带有返回的数据。

使用startActivityForResult(Intent intent, int requestCode)方法打开新的Activity，新Activity关闭前需要向前面的Activity返回数据需要使用系统提供的setResult(int resultCode, Intent data)方法实现：

例如：

{% highlight ruby %}

import android.app.Activity;  
import android.content.Intent;  
import android.os.Bundle;  
import android.util.Log;  
import android.view.View;  
import android.widget.Button;  
  
public class MainActivity extends Activity {  
    private final static String TAG="MainActivity";  
      
    @Override  
    public void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);  
        setContentView(R.layout.main);  
          
        Button btnOpen=(Button)this.findViewById(R.id.btnOpen);  
        btnOpen.setOnClickListener(new View.OnClickListener(){  
            public void onClick(View v) {  
                //得到新打开Activity关闭后返回的数据  
                //第二个参数为请求码，可以根据业务需求自己编号  
                startActivityForResult(new Intent(MainActivity.this, OtherActivity.class), 1);  
            }  
        });  
    }  
      
    /** 
     * 为了得到传回的数据，必须在前面的Activity中（指MainActivity类）重写onActivityResult方法 
     *  
     * requestCode 请求码，即调用startActivityForResult()传递过去的值 
     * resultCode 结果码，结果码用于标识返回数据来自哪个新Activity 
     */  
    @Override  
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {  
        String result = data.getExtras().getString("result");//得到新Activity 关闭后返回的数据  
        Log.i(TAG, result);  
    }  
}  

{% endhighlight %}

{% highlight ruby %}


import android.app.Activity;  
import android.content.Intent;  
import android.os.Bundle;  
import android.view.View;  
import android.widget.Button;  
  
public class OtherActivity extends Activity {  
  
    @Override  
    protected void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);  
        setContentView(R.layout.other);  
  
        Button btnClose=(Button)findViewById(R.id.btnClose);  
        btnClose.setOnClickListener(new View.OnClickListener(){  
            public void onClick(View v) {  
                //数据是使用Intent返回  
                Intent intent = new Intent();  
                //把返回数据存入Intent  
                intent.putExtra("result", "My name is ting");  
                //设置返回数据  
                OtherActivity.this.setResult(RESULT_OK, intent);  
                //关闭Activity  
                OtherActivity.this.finish();  
            }  
        });  
          
    }  
  
}  

{% endhighlight %}

# Activity的启动模式

	活动的启动模式对你来说应该是个全新的概念，在实际项目中我们应该根据特定的需求为每个活动指定恰当的启动模式。启动模式一共有四种，分别是 standard、singleTop、singleTask和singleInstance，可以在 AndroidManifest.xml 中通 过给<activity> 标签 指android:launchMode属性来选择启动模式。
	
## standard

	standard 是活动默认的启动模式，在不进行显式指定的情况下，所有活动都会自动使用这种启动模式。经过上面的学习，你已经知道了 Android 是使用返回栈来管理活动的，在 standard 模式（即默认情况）下，每当启动一个新的活动，它就会在返回栈中入栈，并处于栈顶的位置。对于使用standard 模式的活动，系统不会在乎这个活动是否已经在返回栈中存在，每次启动都会创建该活动的一个新的实例。

## singleTop

	singleTop也是发送新的实例，但不同standard的一点是，在请求的Activity正好位于栈顶时(配置成singleTop的Activity)，不会构造新的实例
	
## singleTask

	活动在整个应用程序的上下文中只存在一个实例，每次启动该活动时系统首先会在返回栈中检查是否存在该活动的实例，如果发现已经存在则直接使用该实例，并把在这个活动之上的所有活动统统出栈，如果没有发现就会创建一个新的活动实例。

## singleInstance

	singleInstance模式应该算是四种启动模式中最特殊也最复杂的一个了，你也需要多花点功夫来理解这个模式。不同于以上三种启动模式，指定为 singleInstance模式的活动会启用一个新的返回栈来管理这个活动，这个模式主要解决了在不同app之间的共享活动实例的问题。


# other

## 随时关闭所有Activity

说明：
- 有时我们可能会打开了很多个Activity，突然来个这样的需求，在某个页面可以关掉 所有的Activity并退出程序！好吧，下面提供一个关闭所有Activity的方法， 就是用一个list集合来存储所有Activity!

![]({{ page.image4 }})


{% highlight ruby %}

public class ActivityCollector {  
    public static LinkedList<Activity> activities = new LinkedList<Activity>();  
    public static void addActivity(Activity activity)  
    {  
        activities.add(activity);  
    }  
    public static void removeActivity(Activity activity)  
    {  
        activities.remove(activity);  
    }  
    public static void finishAll()  
    {  
        for(Activity activity:activities)  
        {  
            if(!activity.isFinishing())  
            {  
                activity.finish();  
            }  
        }  
    }  
} 

/** 
 * 退出应用程序 
 */  
public void AppExit(Context context) {  
    try {  
        ActivityCollector.finishAll();  
        ActivityManager activityMgr = (ActivityManager) context  
                .getSystemService(Context.ACTIVITY_SERVICE);  
        activityMgr.killBackgroundProcesses(context.getPackageName());  
        System.exit(0);  
    } catch (Exception ignored) {}  
}  

{% endhighlight %}

## 为Activity设置过场动画 
- 第一种方式：

![]({{ page.image5 }})

- 第二种方式
通过style进行配置，这个是全局的哦，就是所有的Activity都会加载这个动画！
实现代码如下：
①在style.xml中自定义style：

{% highlight ruby %}

<!-- 默认Activity跳转动画 -->
<style name="default_animation" mce_bogus="1" parent="@android:style/Animation.Activity">
    <item name="android:activityOpenEnterAnimation">@anim/default_anim_in</item>
    <item name="android:activityOpenExitAnimation">@anim/anim_stay</item>
    <item name="android:activityCloseEnterAnimation">@anim/anim_stay</item>
    <item name="android:activityCloseExitAnimation">@anim/default_anim_out</item>
</style>

{% endhighlight %}



解释：
4个item分别代表:
Activity A跳转到Activity B时Activity B进入动画;
Activity A跳转到Activity B时Activity A退出动画;
Activity B返回Activity A时Activity A的进入动画
Activity B返回Activity A时ActivityB的退出动画

②然后修改下AppTheme:


{% highlight ruby %}

<style name="AppTheme" mce_bogus="1" parent="@android:style/Theme.Light">
        <item name="android:windowAnimationStyle">@style/default_animation</item>
        <item name="android:windowNoTitle">true</item>
</style>

{% endhighlight %}

③最后在appliction设置下：


{% highlight ruby %}

<application
   android:icon="@drawable/logo"
   android:label="@string/app_name"
   android:theme="@style/AppTheme" >

{% endhighlight %}

## 设置Activity全屏的方法

1. 代码隐藏ActionBar
在Activity的onCreate方法中调用getActionBar.hide();即可
2. 通过requestWindowFeature设置
requestWindowFeature(Window.FEATURE_NO_TITLE); 该代码需要在setContentView ()之前调用，不然会报错！！！
3. 通过AndroidManifest.xml的theme
在需要全屏的Activity的标签内设置 theme = @android:style/Theme.NoTitleBar.FullScreen

# ctivity，Task和Back Stack的一些概念
![]({{ page.image6 }})
![]({{ page.image7 }})

Task是Activity的集合，是一个概念，实际使用的Back Stack来存储Activity，可以有多个Task，但是 同一时刻只有一个栈在最前面，其他的都在后台！那栈是如何产生的呢？
答：当我们通过主屏幕，点击图标打开一个新的App，此时会创建一个新的Task！举个例子：
我们通过点击通信录APP的图标打开APP，这个时候会新建一个栈1，然后开始把新产生的Activity添加进来，可能我们在通讯录的APP中打开了短信APP的页面，但是此时不会新建一个栈，而是继续添加到栈1中，这是 Android推崇一种用户体验方式，即不同应用程序之间的切换能使用户感觉就像是同一个应用程序， 很连贯的用户体验，官方称其为seamless (无缝衔接）！ ——————这个时候假如我们点击Home键，回到主屏幕，此时栈1进入后台，我们可能有下述两种操作：
1）点击菜单键(正方形那个按钮)，点击打开刚刚的程序，然后栈1又回到前台了！ 又或者我们点击主屏幕上通信录的图标，打开APP，此时也不会创建新的栈，栈1回到前台！
2）如果此时我们点击另一个图标打开一个新的APP，那么此时则会创建一个新的栈2，栈2就会到前台， 而栈1继续呆在后台；
3) 后面也是这样...以此类推！

如上面所述，Android会将新成功启动的Activity添加到同一个Task中并且按照以"先进先出"方式管理多个Task 和Back Stack，用户就无需去担心Activites如何与Task任务进行交互又或者它们是如何存在于Back Stack中！ 或许，你想改变这种正常的管理方式。比如，你希望你的某个Activity能够在一个新的Task中进行管理； 或者你只想对某个Activity进行实例化，又或者你想在用户离开任务时清理Task中除了根Activity所有Activities。你可以做这些事或者更多，只需要通过修改AndroidManifest.xml中 < activity >的相关属性值或者在代码中通过传递特殊标识的Intent给startActivity( )就可以轻松的实现 对Actvitiy的管理了。

<!--本文所用的超链接-->

{% highlight ruby %}

{% endhighlight %}

[1]:https://github.com/hetaodie/AVAudioRecorderDemo.git
