---
layout: post
title: Android_Handler消息传递机制
description: 详细讲解了Handler的原理和实现方法

tagline: original post at hetaodie.github.io
categories: [Android]
tags: [Android Studio]

image1: /assets/media/android/handler.jpg
image2: /assets/media/android/handler2.jpg
image3: /assets/media/android/handler3.jpg

---

**目录**

* 目录
 {:toc  }

 
#  handler相关的知识

![]({{ page.image1 }})

![]({{ page.image2 }})

## 特点
　　handler可以分发Message对象和Runnable对象到主线程中, 每个Handler实例,都会绑定到创建他的线程中(一般是位于主线程),它有两个作用:
- 安排消息或Runnable 在某个主线程中某个地方执行
- 安排一个动作在不同的线程中执行

## message
对于Message对象，一般并不推荐直接使用它的构造方法得到，而是建议通过使用Message.obtain()这个静态的方法或者 Handler.obtainMessage()获取。Message.obtain()会从消息池中获取一个Message对象，如果消息池中是空的， 才会使用构造方法实例化一个新Message，这样有利于消息资源的利用。并不需要担心消息池中的消息过多，它是有上限的，上限为10个。

**Handler中分发消息的一些方法**


{% highlight ruby %}

post(Runnable)
postAtTime(Runnable,long)
postDelayed(Runnable long)
sendEmptyMessage(int)
sendMessage(Message)
sendMessageAtTime(Message,long)
sendMessageDelayed(Message,long)

{% endhighlight %}

**执行流程图**

![]({{ page.image3 }})
Handler可以用来在多线程间进行通信。

**相关名词**

- UI线程:就是我们的主线程,系统在创建UI线程的时候会初始化一个Looper对象,同时也会创建一个与其关联的MessageQueue;
- Handler:作用就是发送与处理信息,如果希望Handler正常工作,在当前线程中要有一个Looper对象
- Message:Handler接收与处理的消息对象
- MessageQueue:消息队列,先进先出管理Message,在初始化Looper对象时会创建一个与之关联的MessageQueue;
- Looper:每个线程只能够有一个Looper,管理MessageQueue,不断地从中取出Message分发给对应的Handler处理

# handler的相关方法

- void handleMessage(Message msg):处理消息的方法,通常是用于被重写!
- sendEmptyMessage(int what):发送空消息
- sendEmptyMessageDelayed(int what,long delayMillis):指定延时多少毫秒后发送空信息
- sendMessage(Message msg):立即发送信息
- sendMessageDelayed(Message msg):指定延时多少毫秒后发送信息
- final boolean hasMessage(int what):检查消息队列中是否包含what属性为指定值的消息 如果是参数为(int what,Object object):除了判断what属性,还需要判断Object属性是否为指定对象的消息


# 通过Message与Handler进行通信的步骤是： 

1. 重写Handler的handleMessage方法，根据Message的what值进行不同的处理操作 
2. 创建Message对象 
虽然Message的构造函数式public的,我们还可以通过Message.obtain()或Handler.obtainMessage()来获得一个Message对象（Handler.obtainMessage()内部其实调用了Message.obtain()）。 
3. 设置Message的what值 
Message.what是我们自定义的一个Message的识别码，以便于在Handler的handleMessage方法中根据what识别出不同的Message，以便我们做出不同的处理操作。 
4. 设置Message的所携带的数据，简单数据可以通过两个int类型的field arg1和arg2来赋值，并可以在handleMessage中读取。 
5. 如果Message需要携带复杂的数据，那么可以设置Message的obj字段，obj是Object类型，可以赋予任意类型的数据。或者可以通过调用Message的setData方法赋值Bundle类型的数据，可以通过getData方法获取该Bundle数据。 
6. 我们通过Handler.sendMessage(Message)方法将Message传入Handler中让其在handleMessage中对其进行处理。 
需要说明的是，如果在handleMessage中 不需要判断Message类型，那么就无须设置Message的what值；而且让Message携带数据也不是必须的，只有在需要的时候才需要让其携带数据；如果确实需要让Message携带数据，应该尽量使用arg1或arg2或两者，能用arg1和arg2解决的话就不要用obj，因为用arg1和arg2更高效。

# 如何让Handler执行Runnable时打开新的线程：

　　1. 首先生成一个HandlerThread对象，实现了使用Looper来处理消息队列的功能，这个类由Android应用程序框架提供
　　HandlerThread handlerThread = new HandlerThread（"handler_thread"）；

　　2. 在使用HandlerThread的getLooper（）方法之前，必须先调用该类的start（）；
　　handlerThread。start（）；

　　3. 根据这个HandlerThread对象得到其中的Looper对象。

　　4. 创建自定义的继承于Handler类的子类，其中实现一个参数为Looper对象的构造方法，方法内容调用父类的构造函数即可。

　　5. 使用第三步得到的Looper对象创建自定义的Handler子类的对象，再将消息（Message）发送到该Handler的消息队列中，Handler复写的handleMessage（）将会执行来处理消息队列中的消息。
　　
# Handler写在子线程中

如果是Handler写在了子线程中的话,我们就需要自己创建一个Looper对象了!创建的流程如下:

1. 直接调用Looper.prepare()方法即可为当前线程创建Looper对象,而它的构造器会创建配套的MessageQueue; 
2. 创建Handler对象,重写handleMessage( )方法就可以处理来自于其他线程的信息了! 
3. 调用Looper.loop()方法启动Looper


{% highlight ruby %}

public class CalPrime extends Activity  
{  
    static final String UPPER_NUM = "upper";  
    EditText etNum;  
    CalThread calThread;  
    // 定义一个线程类  
    class CalThread extends Thread  
    {  
        public Handler mHandler;  
  
        public void run()  
        {  
            Looper.prepare();  
            mHandler = new Handler()  
            {  
                // 定义处理消息的方法  
                @Override  
                public void handleMessage(Message msg)  
                {  
                    if(msg.what == 0x123)  
                    {  
                        int upper = msg.getData().getInt(UPPER_NUM);  
                        List<Integer> nums = new ArrayList<Integer>();  
                        // 计算从2开始、到upper的所有质数  
                        outer:  
                        for (int i = 2 ; i <= upper ; i++)  
                        {  
                            // 用i处于从2开始、到i的平方根的所有数  
                            for (int j = 2 ; j <= Math.sqrt(i) ; j++)  
                            {  
                                // 如果可以整除，表明这个数不是质数  
                                if(i != 2 && i % j == 0)  
                                {  
                                    continue outer;  
                                }  
                            }  
                            nums.add(i);  
                        }  
                        // 使用Toast显示统计出来的所有质数  
                        Toast.makeText(CalPrime.this , nums.toString()  
                            , Toast.LENGTH_LONG).show();  
                    }  
                }  
            };  
            Looper.loop();  
        }  
    }  
    @Override  
    public void onCreate(Bundle savedInstanceState)  
    {  
        super.onCreate(savedInstanceState);  
        setContentView(R.layout.main);  
        etNum = (EditText)findViewById(R.id.etNum);  
        calThread = new CalThread();  
        // 启动新线程  
        calThread.start();  
    }  
    // 为按钮的点击事件提供事件处理函数  
    public void cal(View source)  
    {  
        // 创建消息  
        Message msg = new Message();  
        msg.what = 0x123;  
        Bundle bundle = new Bundle();  
        bundle.putInt(UPPER_NUM ,  
            Integer.parseInt(etNum.getText().toString()));  
        msg.setData(bundle);  
        // 向新线程中的Handler发送消息  
        calThread.mHandler.sendMessage(msg);  
    }  
} 

{% endhighlight %}

{% highlight ruby %}

{% endhighlight %}
<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVAudioRecorderDemo.git
