---
layout: post
title: AnsyncTask异步任务
description: 详细讲解了AnsyncTask和原理和实现方式

tagline: original post at hetaodie.github.io
categories: [Android]
tags: [Android Studio]

image1: /assets/media/android/AsyncTask1.jpg
image2: /assets/media/android/AsyncTask2.jpg
image3: /assets/media/android/AsyncTask3.jpg

---

**目录**

* 目录
 {:toc  }

 
# AsyncTask的基本结构：

![]({{ page.image1 }})

![]({{ page.image2 }})

![]({{ page.image3 }})

# 例子

**定义一个延时操作，用于模拟下载**

{% highlight ruby %}

public class DelayOperator {  
    //延时操作,用来模拟下载  
    public void delay()  
    {  
        try {  
            Thread.sleep(1000);  
        }catch (InterruptedException e){  
            e.printStackTrace();;  
        }  
    }  
}


{% endhighlight %}

**自定义AsyncTask:**

{% highlight ruby %}

public class MyAsyncTask extends AsyncTask<Integer,Integer,String>  
{  
    private TextView txt;  
    private ProgressBar pgbar;  
  
    public MyAsyncTask(TextView txt,ProgressBar pgbar)  
    {  
        super();  
        this.txt = txt;  
        this.pgbar = pgbar;  
    }  
  
  
    //该方法不运行在UI线程中,主要用于异步操作,通过调用publishProgress()方法  
    //触发onProgressUpdate对UI进行操作  
    @Override  
    protected String doInBackground(Integer... params) {  
        DelayOperator dop = new DelayOperator();  
        int i = 0;  
        for (i = 10;i <= 100;i+=10)  
        {  
            dop.delay();  
            publishProgress(i);  
        }  
        return  i + params[0].intValue() + "";  
    }  
  
    //该方法运行在UI线程中,可对UI控件进行设置  
    @Override  
    protected void onPreExecute() {  
        txt.setText("开始执行异步线程~");  
    }  
  
  
    //在doBackground方法中,每次调用publishProgress方法都会触发该方法  
    //运行在UI线程中,可对UI控件进行操作  
  
  
    @Override  
    protected void onProgressUpdate(Integer... values) {  
        int value = values[0];  
        pgbar.setProgress(value);  
    }  
}

{% endhighlight %}

**MainActivity.java：**

{% highlight ruby %}

public class MyActivity extends ActionBarActivity {  
  
    private TextView txttitle;  
    private ProgressBar pgbar;  
    private Button btnupdate;  
  
    @Override  
    protected void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);  
        setContentView(R.layout.activity_main);  
        txttitle = (TextView)findViewById(R.id.txttitle);  
        pgbar = (ProgressBar)findViewById(R.id.pgbar);  
        btnupdate = (Button)findViewById(R.id.btnupdate);  
        btnupdate.setOnClickListener(new View.OnClickListener() {  
            @Override  
            public void onClick(View v) {  
                MyAsyncTask myTask = new MyAsyncTask(txttitle,pgbar);  
                myTask.execute(1000);  
            }  
        });  
    }  
} 

{% endhighlight %}
<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVAudioRecorderDemo.git
