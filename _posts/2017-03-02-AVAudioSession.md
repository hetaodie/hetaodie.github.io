---

layout: post
title: AVAudioSession
description: 
tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [AVAudioSession]

---

**目录**

* 目录
 {:toc  }
 
# 说明
`AVAudioSession` 是一个单例对象，并用来为音频类app向系统传递一些配置信息。 其

AVAudioSession 的主要功能包括以下几点功能：

- 系统说明你的app使用音频的模式（比如是播放还是录音，是否支持蓝牙播放，是否支持后台播放）
- 为你的app选择音频的输入输出设备（比如输入用的麦克风，输出是耳机、手机功放或者airplay）
- 协助管理多个音源需要播放时的行为（例如同时使用多个音乐播放app，或者突然有电话接入）

# 激活音频会话

{% highlight ruby %}

[[AVAudioSession sharedInstance]setActive:YES error:nil];

{% endhighlight %}

# AVAudioSession的api的介绍

	AVAudioSession主要包括七大类别，选项和七大模式，这些选择决定这音频使用的各个场景。

## 七大类别

1. AVAudioSessionCategoryAmbient：只支持播放，可以和其他的音乐播放器一起播放。同时，当用户锁屏或者静音时也会随着静音.
2. AVAudioSessionCategorySoloAmbient： 也是只用于播放,但是会关闭其他的音乐播放器的播放，同时，当用户锁屏或者静音时也会随着静音。
3. AVAudioSessionCategoryPlayback： 只支持播放，当锁屏时不会静音，此category也会关闭其他的播放器的播放；
4. AVAudioSessionCategoryRecord： 只支持录音，此category会关闭其他的播放器，当锁屏时不会静音。
5. AVAudioSessionCategoryPlayAndRecord：即支持播放也支持录音，比如VoIP，打电话这种场景。
6. AVAudioSessionCategoryMultiRoute：即支持播放也支持录音，当锁屏时不会静音。这个类别可以支持多个设备输入输出。
7. AVAudioSessionCategoryAudioProcessing: 主要用于音频格式处理，一般可以配合AudioUnit进行使用。

### 设置Category的方法

{% highlight ruby %}

- (BOOL)setCategory:(NSString *)category error:(NSError **)outError;

可以通过：
@property(readonly) NSArray<NSString *> *availableCategories;
属性，查看当前设备支持哪些类别，然后再进行设置，从而保证传入参数的合法，减少错误的可能。

{% endhighlight %}

## 选项
1. AVAudioSessionCategoryOptionMixWithOthers：
   1. 适用的类别：`AVAudioSessionCategoryPlayAndRecord, AVAudioSessionCategoryPlayback, and AVAudioSessionCategoryMultiRoute`;
   2. 作用：是否可以和其他后台App进行混音
2. AVAudioSessionCategoryOptionDuckOthers：
	1. 适用的类别：`AVAudioSessionCategoryAmbient, AVAudioSessionCategoryPlayAndRecord, AVAudioSessionCategoryPlayback, and AVAudioSessionCategoryMultiRoute` 
	2. 作用：是否压低其他App声音
3. AVAudioSessionCategoryOptionAllowBluetooth:
	1. 适用类别：`AVAudioSessionCategoryRecord and AVAudioSessionCategoryPlayAndRecord`
	2. 作用：是否支持蓝牙耳机
4. AVAudioSessionCategoryOptionDefaultToSpeaker:
	1. 适用类别：AVAudioSessionCategoryPlayAndRecord
	2. 作用：是否默认用免提声音

### 设置option的方法

{% highlight ruby %}

- (BOOL)setCategory:(NSString *)category withOptions:(AVAudioSessionCategoryOptions)options error:(NSError **)outError


## 七大模式

1. AVAudioSessionModeDefault:适用于所有的类别，
2. AVAudioSessionModeVoiceChat：适用与AVAudioSessionCategoryPlayAndRecord，主要用于VoIP场景，此时系统会选择最佳的输入设备，比如插上耳机就使用耳机上的麦克风进行采集。此时有个副作用，他会设置类别的选项为"AVAudioSessionCategoryOptionAllowBluetooth"从而支持蓝牙耳机。
3. AVAudioSessionModeVideoChat：适用与AVAudioSessionCategoryPlayAndRecord， 主要用于视频通话，系统也会选择最佳的输入设备，比如插上耳机就使用耳机上的麦克风进行采集并且会设置类别的选项为"AVAudioSessionCategoryOptionAllowBluetooth" 和 "AVAudioSessionCategoryOptionDefaultToSpeaker"。
4. AVAudioSessionModeGameChat：适用与AVAudioSessionCategoryPlayAndRecord，适用于游戏App的采集和播放，比如“GKVoiceChat”对象，一般不需要手动设置。
5. AVAudioSessionModeVideoRecording：适用与AVAudioSessionCategoryPlayAndRecord和AVAudioSessionCategoryRecord，主要用于录制视频。
6. AVAudioSessionModeMoviePlayback：适用与AVAudioSessionCategoryPlayAndRecord，主要用于视频播放；
7. AVAudioSessionModeMeasurement：适用与AVAudioSessionCategoryPlayAndRecord AVAudioSessionCategoryRecord AVAudioSessionCategoryPlayback，主要用于最小系统

### 设置Mode的方法

通过调用：
{% highlight ruby %}

- (BOOL)setMode:(NSString *)mode error:(NSError **)outError

{% endhighlight %}

可以在设置Category之后再设置模式。

# 系统中断响应
	中断系统分为两种：一种是一般性中断，包括其中将来电话、闹铃响等
	第二种是其他的app需要占用AudioSession的时候。

## 一般性中断

用`AVAudioSessionInterruptionNotification`来通知。其回调回来的userInfo主要包含两个键：
- AVAudioSessionInterruptionTypeKey：取值为`AVAudioSessionInterruptionTypeBegan`表示中断开始，我们应该暂停播放和采集，取值为`AVAudioSessionInterruptionTypeEnded`表示中断结束，我们可以继续播放和采集。
- AVAudioSessionInterruptionOptionKey： 当前只有一种值`AVAudioSessionInterruptionOptionShouldResume`表示此时也应该恢复继续播放和采集。

## 其他App占用时的中断
而将其他App占据`AudioSession`的时候用`AVAudioSessionSilenceSecondaryAudioHintNotification`来进行通知。其回调回来的`userInfo`键为：`AVAudioSessionSilenceSecondaryAudioHintTypeKey`
可能包含的值：
- AVAudioSessionSilenceSecondaryAudioHintTypeBegin： 表示其他App开始占据Session。
- AVAudioSessionSilenceSecondaryAudioHintTypeEnd: 表示其他App开始释放Session。

## 外面的声音设备改变的

默认情况下，AudioSession会在App启动时选择一个最优的输出方案，比如插入耳机的时候，就用耳机。但是这个过程中，用户可能拔出耳机，我们App要如何感知这样的情况呢？系统会通过	`AVAudioSessionRouteChangeNotification`来进行通知其中在其userInfo中有键：`AVAudioSessionRouteChangeReasonKey`来表示改变的原因，原因的键值有一下几种：
- AVAudioSessionRouteChangeReasonUnknown：未知原因
- AVAudioSessionRouteChangeReasonNewDeviceAvailable：有新设备可用
- AVAudioSessionRouteChangeReasonOldDeviceUnavailable：老设备不可用
- AVAudioSessionRouteChangeReasonCategoryChange：类别改变了
- AVAudioSessionRouteChangeReasonOverride：App重置了输出设置
- AVAudioSessionRouteChangeReasonWakeFromSleep：从睡眠状态呼醒
- AVAudioSessionRouteChangeReasonNoSuitableRouteForCategory	：当前Category下没有合适的设备
- AVAudioSessionRouteChangeReasonRouteConfigurationChange：Rotuer的配置改变了
	



![]({{ page.image1 }})

{% highlight ruby %}
{% endhighlight %}

点击去github下载[AVAudioRecorderDemo][1]

<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVAudioRecorderDemo.git
