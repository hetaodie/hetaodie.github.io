---
layout: post
title: WebRTC57_RTCConfiguration 详解
description: WebRTC57版本RTCConfiguration 详解

tagline: original post at hetaodie.github.io
categories: [Android]
tags: [Android Studio]


---

**目录**

* 目录
 {:toc  }
 
 

{% highlight ruby %}

public static class RTCConfiguration {

 public IceTransportsType iceTransportsType;

 public List<IceServer> iceServers;

 public BundlePolicy bundlePolicy;

 public RtcpMuxPolicy rtcpMuxPolicy;

 public TcpCandidatePolicy tcpCandidatePolicy;

 public CandidateNetworkPolicy candidateNetworkPolicy;

 public int audioJitterBufferMaxPackets;

 public boolean audioJitterBufferFastAccelerate;

 public int iceConnectionReceivingTimeout;

 public int iceBackupCandidatePairPingInterval;

 public KeyType keyType;

 public ContinualGatheringPolicy continualGatheringPolicy;

 public int iceCandidatePoolSize;

 public boolean pruneTurnPorts;

 public boolean presumeWritableWhenFullyRelayed;

 public RTCConfiguration(List<IceServer> iceServers) {

 iceTransportsType = IceTransportsType.ALL;

 bundlePolicy = BundlePolicy.BALANCED;

 rtcpMuxPolicy = RtcpMuxPolicy.NEGOTIATE;

 tcpCandidatePolicy = TcpCandidatePolicy.ENABLED;

 candidateNetworkPolicy = candidateNetworkPolicy.ALL;

 this.iceServers = iceServers;

 audioJitterBufferMaxPackets = 50;

 audioJitterBufferFastAccelerate = false;

 iceConnectionReceivingTimeout = -1;

 iceBackupCandidatePairPingInterval = -1;

 keyType = KeyType.ECDSA;

 continualGatheringPolicy = ContinualGatheringPolicy.GATHER_ONCE;

 iceCandidatePoolSize = 0;

 pruneTurnPorts = false;

 presumeWritableWhenFullyRelayed = false;

 }

 };
 
{% endhighlight %}

1. IceTransportsType：收集的策略类型，目前可供选择的有ALL(全部收集),NOHOST(不收集host类的策略信息),RELAY(只使用服务器的策略信息，简言之就是不通过P2P，只走服务端流量),NONE(不收集策略信息，目前作用未知)。一般来说，如果你想减少流量，那么就用ALL，WebRTC会在能打通P2P情况下使用P2P；如果你想要保证客户端的联通率，那么RELAY是你最好的选择。
2. bundlePolicy：协商策略，balanced, max-compat, max-bundle,基本上是选择max-bundle，主要是防止另一个客户端属于策略不可协商型。
3. rtcpMuxPolicy：实时传输控制协议多路策略，negotiate, require，第一个是获取实时传输控制协议策略和实时传输协议策略，第二个只获取实时传输协议策略，如果另一个客户端不支持实时传输控制协议，那么协商就会失败。Tiki客户端测试发现Require比较适合移动客户端。
4. tcpCandidatePolicy：TCP候选策略控制开关，只有Enable和Disable，TCP策略虽然有握手来保证传输到达率，但这也是效率上最致命的，会极大拉低视频传输效率，所以建议不开启，除非有特别的需求。
5. candidateNetworkPolicy：候选网络策略，属于新出的策略，有ALL和LowCost两个值，暂时未知作用，如果有童鞋了解的话，可以交流下。
6. iceServers：服务端的候选地址，主要是用于客户端之间建立连接前的通信。
7. continualGatheringPolicy：收集策略时间段，有GATHER_ONCE和 GATHER_CONTINUALLY两种值，默认值为GATHER_ONCE，可以不用改。
8. keyType：加密类型，如果没有特殊需求，不建议更改。
其他参数，有些属于M52之后新加的类型，还没有测试过，不敢妄下定论，
还有一些属于测试后觉得不需要修改默认值的。
9. iceCandidatePoolSize：一个无符号的16位整数值，用于指定预获取的ICE候选池的大小。默认值为0（意味着不会发生候选预获取）。您可能发现在某些情况下，在开始尝试连接之前，允许ICE代理程序开始获取ICE候选项，可以更快地建立连接，以便在RTCPeerConnection.setLocalDescription()被调用时已经可以进行检查。
**更改ICE候选池的大小可能会触发ICE收集的开始。**
10. 其他参数，有些属于M52之后新加的类型，还没有测试过，不敢妄下定论，
还有一些属于测试后觉得不需要修改默认值的。

<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVAudioRecorderDemo.git
