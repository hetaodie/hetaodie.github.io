---
layout: post
title: AVAudioRecorder
description: 详细介绍了AVAudioRecorder的使用

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [AVAudioRecorder]

image1: /assets/media/audio/AVAudioRecorder.png

---

**目录**

* 目录
 {:toc  }

#  调用流程图

![]({{ page.image1 }})

# audioRecorder基本参数配置
##一般的设定
### 音频格式

{% highlight ruby %}

key: AVFormatIDKey
value:

CF_ENUM(AudioFormatID)
{
    kAudioFormatLinearPCM               = 'lpcm',
    kAudioFormatAC3                     = 'ac-3',
    kAudioFormat60958AC3                = 'cac3',
    kAudioFormatAppleIMA4               = 'ima4',
    kAudioFormatMPEG4AAC                = 'aac ',
    kAudioFormatMPEG4CELP               = 'celp',
    kAudioFormatMPEG4HVXC               = 'hvxc',
    kAudioFormatMPEG4TwinVQ             = 'twvq',
    kAudioFormatMACE3                   = 'MAC3',
    kAudioFormatMACE6                   = 'MAC6',
    kAudioFormatULaw                    = 'ulaw',
    kAudioFormatALaw                    = 'alaw',
    kAudioFormatQDesign                 = 'QDMC',
    kAudioFormatQDesign2                = 'QDM2',
    kAudioFormatQUALCOMM                = 'Qclp',
    kAudioFormatMPEGLayer1              = '.mp1',
    kAudioFormatMPEGLayer2              = '.mp2',
    kAudioFormatMPEGLayer3              = '.mp3',
    kAudioFormatTimeCode                = 'time',
    kAudioFormatMIDIStream              = 'midi',
    kAudioFormatParameterValueStream    = 'apvs',
    kAudioFormatAppleLossless           = 'alac',
    kAudioFormatMPEG4AAC_HE             = 'aach',
    kAudioFormatMPEG4AAC_LD             = 'aacl',
    kAudioFormatMPEG4AAC_ELD            = 'aace',
    kAudioFormatMPEG4AAC_ELD_SBR        = 'aacf',
    kAudioFormatMPEG4AAC_ELD_V2         = 'aacg',    
    kAudioFormatMPEG4AAC_HE_V2          = 'aacp',
    kAudioFormatMPEG4AAC_Spatial        = 'aacs',
    kAudioFormatAMR                     = 'samr',
    kAudioFormatAMR_WB                  = 'sawb',
    kAudioFormatAudible                 = 'AUDB',
    kAudioFormatiLBC                    = 'ilbc',
    kAudioFormatDVIIntelIMA             = 0x6D730011,
    kAudioFormatMicrosoftGSM            = 0x6D730031,
    kAudioFormatAES3                    = 'aes3',
    kAudioFormatEnhancedAC3             = 'ec-3'
};

{% endhighlight %}

### 采样率

{% highlight ruby %}
key：AVSampleRateKey
value:
一般的采样率为8000，44100，96000
{% endhighlight %}

### 设置通道

{% highlight ruby %}
Key:AVNumberOfChannelsKey
value:1,2
{% endhighlight %}

**说明：**当没有外设设备时值为1，一般的情况下设置为1



## LPCM 聲音格式的設定

### LPCM 聲音格式的位元深度
{% highlight ruby %}

key:AVLinearPCMBitDepthKey
value: 8、16、24、32

{% endhighlight %}

### 设定将最高位放在前面 (Big-Endian) 還是後面

{% highlight ruby %}

key:AVLinearPCMIsBigEndianKey 
value: YES，NO

{% endhighlight %}

### 设置声音的处理方式，是采用定点数还是浮点数

{% highlight ruby %}

key:AVLinearPCMIsFloatKey
value: YES，NO

{% endhighlight %}

### 设置声音的编码方式是采用非交错式的还是交错式的。

{% highlight ruby %}

key:AVLinearPCMIsNonInterleaved
value: YES，NO

{% endhighlight %}

## 编码器设定

### 音质设定

{% highlight ruby %}

key:AVEncoderAudioQualityKey
value: 
           AVAudioQualityMin    最小的质量
           AVAudioQualityLow    比较低的质量
           AVAudioQualityMedium 中间的质量
           AVAudioQualityHigh   高的质量
           AVAudioQualityMax    最好的质量

{% endhighlight %}

### 音频的编码比特率

{% highlight ruby %}

key: AVEncoderBitRateKey
value: 一般为128000bps

{% endhighlight %}

### 线性音频的位深度

{% highlight ruby %}

key: AVEncoderBitDepthHintKey
value: 一般为8、16、24、32

{% endhighlight %}

### 采样率频率转换器的设定

{% highlight ruby %}

key: AVSampleRateConverterAudioQualityKey：
value: 
			 AVAudioQualityMin    最小的质量
           AVAudioQualityLow    比较低的质量
           AVAudioQualityMedium 中间的质量
           AVAudioQualityHigh   高的质量
           AVAudioQualityMax    最好的质量

{% endhighlight %}

# 常用属性方法

{% highlight ruby %}

@property (readonly, getter=isRecording) BOOL recording;//是否正在录音
@property (readonly) NSDictionary<NSString *, id> *settings;//录音配置
@property (readonly) NSURL *url;//录音文件存放URL
@property (readonly) NSTimeInterval currentTime;//录音时长,注意仅仅在录音状态可用
@property(readonly) NSTimeInterval deviceCurrentTime;
@property (getter=isMeteringEnabled) BOOL meteringEnabled;//是否监控声波

{% endhighlight %}

# 常用对象方法

{% highlight ruby %}

- (BOOL)prepareToRecord;//为录音准备缓冲区
- (BOOL)record;//录音开始，暂停后调用会恢复录音
- (BOOL)recordAtTime:(NSTimeInterval)time;//在指定时间后开始录音
- (BOOL)recordForDuration:(NSTimeInterval) duration;//按指定时长录音
- (BOOL)recordAtTime:(NSTimeInterval)time 
         forDuration:(NSTimeInterval)duration;//上面2个的合体
- (void)pause; //中断录音
- (void)stop; //停止录音
- (BOOL)deleteRecording;//删除录音，必须先停止录音再删除
- 
{% endhighlight %}

# 常用的代理方法：

{% highlight ruby %}

//录音完成后调用
- (void)audioRecorderDidFinishRecording:(AVAudioRecorder *)recorder 
                           successfully:(BOOL)flag;
//录音编码发送错误时调用
- (void)audioRecorderEncodeErrorDidOccur:(AVAudioRecorder *)recorder 
                                   error:(NSError *)error;
                                   
{% endhighlight %}



点击去github下载[AVAudioRecorderDemo][1]

<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVAudioRecorderDemo.git
