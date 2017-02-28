---
layout: post
title: AVAudioPlayer
description: 详细介绍了AVAudioPlayer的使用

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [AVAudioPlayer]


---

**目录**

* 目录
 {:toc  }

#  属性

{% highlight ruby %}

@property(readonly, getter=isPlaying) BOOL playing    //是否正在播放，只读
@property(readonly) NSUInteger numberOfChannels    //音频声道数，只读
@property(readonly) NSTimeInterval duration    //音频时长
@property(readonly) NSURL *url    //音频文件路径，只读
@property(readonly) NSData *data    //音频数据，只读
@property float pan    //立体声平衡，如果为-1.0则完全左声道，如果0.0则左右声道平衡，如果为1.0则完全为右声道
@property float volume    //音量大小，范围0-1.0
@property BOOL enableRate    //是否允许改变播放速率
@property float rate    //播放速率，范围0.5-2.0，如果为1.0则正常播放，如果要修改播放速率则必须设置enableRate为YES
@property NSTimeInterval currentTime    //当前播放时长
@property(readonly) NSTimeInterval deviceCurrentTime    //输出设备播放音频的时间，注意如果播放中被暂停此时间也会继续累加
@property NSInteger numberOfLoops    //循环播放次数，如果为0则不循环，如果小于0则无限循环，大于0则表示循环次数
@property(readonly) NSDictionary *settings    //音频播放设置信息，只读
@property(getter=isMeteringEnabled) BOOL meteringEnabled    //是否启用音频测量，默认为NO，一旦启用音频测量可以通过updateMeters方法更新测量值


{% endhighlight %}

