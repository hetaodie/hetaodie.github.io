---
layout: post
title:AttributedString详解
description: 详细讲解了AttributedString常用的api和在使用过程中的一些技巧和常见问题的解决方法，并配置了一个小demo。

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [iOS, AttributedString]
---
**目录**

* 目录
 {:toc  }
 


# `AttributedString` 常用属性


## `NSFontAttributeName`

**说明：设置字体格式和大小**

例如：

{% highlight ruby %}

[attrStr addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:30.0f] range:NSMakeRange(0, 3)];

{% endhighlight %}

## `NSForegroundColorAttributeName`

**说明：添加文字颜色**

例如：

{% highlight ruby %}

[attrStr addAttribute:NSForegroundColorAttributeName value:[UIColor redColor] range:NSMakeRange(17, 7)];

{% endhighlight %}


## NSBackgroundColorAttributeName

**说明：添加文字背景颜色**

例如：

{% highlight ruby %}

[attrStr addAttribute:NSBackgroundColorAttributeName value:[UIColor orangeColor] range:NSMakeRange(17, 7)];

{% endhighlight %}

## NSUnderlineStyleAttributeName

**说明：添加下划线**

例如：


{% highlight ruby %}

[attrStr addAttribute:NSUnderlineStyleAttributeName value:[NSNumber numberWithInteger:NSUnderlineStyleSingle] range:NSMakeRange(8, 7)];


{% endhighlight %}



## NSLigatureAttributeName

**说明：NSLigatureAttributeName设置连体属性，取值为NSNumber对象（整数），1表示使用默认的连体字符，0表示不使用，2表示使用所有连体符号（iOS不支持2）。而且并非所有的字符之间都有组合符合。如 fly ，f和l会连起来。**

例如：

{% highlight ruby %}


[attrStr NSLigatureAttributeName value:[NSNumber numberWithInteger:1] range:NSMakeRange(8, 7)];

{% endhighlight %}


## NSKernAttributeName

**说明：NSKernAttributeName用来设置字符之间的间距，取值为NSNumber对象（整数），负值间距变窄，正值间距变宽**

例如：

{% highlight ruby %}


[attrStr NSKernAttributeName value:[NSNumber numberWithInteger:4] range:NSMakeRange(8, 7)];

{% endhighlight %}



## NSStrikethroughStyleAttributeName

**说明：NSStrikethroughStyleAttributeName设置删除线，取值为NSNumber对象，枚举NSUnderlineStyle中的值。NSStrikethroughColorAttributeName设置删除线的颜色。并可以将Style和Pattern相互 取与 获取不同的效果**

例如：

{% highlight ruby %}


[attrStr NSStrikethroughStyleAttributeName value:[NSNumber numberWithInteger: NSUnderlineStyleSingle] range:NSMakeRange(8, 7)];

{% endhighlight %}




## NSParagraphStyleAttributeName

**说明：添加段落设置**

例如：

{% highlight ruby %}

//段落样式
NSMutableParagraphStyle *paragraph = [[NSMutableParagraphStyle alloc]init];
//行间距
paragraph.lineSpacing = 10;
//段落间距
paragraph.paragraphSpacing = 20;
//对齐方式
paragraph.alignment = NSTextAlignmentLeft;
//指定段落开始的缩进像素
paragraph.firstLineHeadIndent = 30;
//调整全部文字的缩进像素
paragraph.headIndent = 10;

//添加段落设置
[attributedString addAttribute:NSParagraphStyleAttributeName value:paragraph range:NSMakeRange(0, attributedString.length)];


{% endhighlight %}





## NSStrokeColorAttributeName

**说明：NSStrokeColorAttributeName  设置填充部分颜色，取值为UIColor对象。**

例如：

{% highlight ruby %}

 
//设置笔画宽度和填充部分颜色
NSString *str6 = @"设置笔画宽度和填充颜色\n";
NSDictionary *dictAttr6 = @{NSStrokeWidthAttributeName:@(2),NSStrokeColorAttributeName:[UIColor blueColor]};
NSAttributedString *attr6 = [[NSAttributedString alloc]initWithString:str6 attributes:dictAttr6];
[attributedString appendAttributedString:attr6];


{% endhighlight %}




## NSTextEffectAttributeName

**说明：NSTextEffectAttributeName  //设置文本特殊效果，取值为NSString类型，目前只有一个可用效果  NSTextEffectLetterpressStyle（凸版印刷效果）**

例如：

{% highlight ruby %}

 NSString *str8 = @"设置特殊效果\n";
NSDictionary *dictAttr8 = @{NSTextEffectAttributeName:NSTextEffectLetterpressStyle};
NSAttributedString *attr8 = [[NSAttributedString alloc]initWithString:str8 attributes:dictAttr8];
[attributedString appendAttributedString:attr8];

{% endhighlight %}



## NSAttachmentAttributeName

**说明：NSAttachmentAttributeName  设置文本附件，取值为NSTextAttachment对象，常用于文字的图文混排**

例如：

{% highlight ruby %}

NSString *str9 = @"文字的图文混排\n";
NSTextAttachment *textAttachment = [[NSTextAttachment alloc]init];
textAttachment.image = [UIImage imageNamed:@"logo.png"];
textAttachment.bounds = CGRectMake(0, 0, 30, 30);
NSDictionary *dictAttr9 = @{NSAttachmentAttributeName:textAttachment};
NSAttributedString *attr9 = [[NSAttributedString alloc]initWithString:str9 attributes:dictAttr9];
[attributedString appendAttributedString:attr9];


{% endhighlight %}




## NSBaselineOffsetAttributeName

**说明：NSBaselineOffsetAttributeName  设置基线偏移值。取值为NSNumber （float），正值上偏，负值下偏**

例如：

{% highlight ruby %}

NSString *str11 = @"添加基线偏移值\n";
NSDictionary *dictAttr11 = @{NSBaselineOffsetAttributeName:@(-10)};
NSAttributedString *attr11 = [[NSAttributedString alloc]initWithString:str11 attributes:dictAttr11];
[attributedString appendAttributedString:attr11];

{% endhighlight %}


## NSUnderlineColorAttributeName

**说明：NSUnderlineColorAttributeName  设置下划线的颜色**

例如：

{% highlight ruby %}

NSString *str10 = @"添加下划线\n";
NSDictionary *dictAttr10 = @{NSUnderlineStyleAttributeName:@(NSUnderlineStyleSingle),NSUnderlineColorAttributeName:[UIColor redColor]};
NSAttributedString *attr10 = [[NSAttributedString alloc]initWithString:str10 attributes:dictAttr10];
[attributedString appendAttributedString:attr10];

{% endhighlight %}




## NSStrikethroughColorAttributeName

**说明：NSStrikethroughColorAttributeName  设置删除线的颜色**

例如：

{% highlight ruby %}

NSString *str51 = @"\n设置删除线为细单实线,颜色为红色";
NSDictionary *dictAttr51 = @{NSStrikethroughStyleAttributeName:@(NSUnderlineStyleSingle),NSStrikethroughColorAttributeName:[UIColor redColor]};
NSAttributedString *attr51 = [[NSAttributedString alloc]initWithString:str51 attributes:dictAttr51];
[attributedString appendAttributedString:attr51];

{% endhighlight %}




## NSObliquenessAttributeName

**说明：NSObliquenessAttributeName  设置字体倾斜度，取值为 NSNumber（float），正值右倾，负值左倾**

例如：

{% highlight ruby %}

//设置字体倾斜度 NSObliquenessAttributeName
NSString *str12 = @"设置字体倾斜度\n";
NSDictionary *dictAttr12 = @{NSObliquenessAttributeName:@(0.5)};
NSAttributedString *attr12 = [[NSAttributedString alloc]initWithString:str12 attributes:dictAttr12];
[attributedString appendAttributedString:attr12];


{% endhighlight %}




## NSExpansionAttributeName

**说明：NSExpansionAttributeName  设置字体的横向拉伸，取值为NSNumber （float），正值拉伸 ，负值压缩**

例如：

{% highlight ruby %}

//设置字体的横向拉伸 NSExpansionAttributeName
NSString *str13 = @"设置字体横向拉伸\n";
NSDictionary *dictAttr13 = @{NSExpansionAttributeName:@(0.5)};
NSAttributedString *attr13 = [[NSAttributedString alloc]initWithString:str13 attributes:dictAttr13];
[attributedString appendAttributedString:attr13];


{% endhighlight %}




## NSWritingDirectionAttributeName

**说明：NSWritingDirectionAttributeName  设置文字的书写方向，取值为以下组合**

例如：

{% highlight ruby %}

NSWritingDirectionAttributeName 设置文字的书写方向，取值为以下组合
 @[@(NSWritingDirectionLeftToRight | NSWritingDirectionEmbedding)]
 @[@(NSWritingDirectionLeftToRight | NSWritingDirectionOverride)]
 @[@(NSWritingDirectionRightToLeft | NSWritingDirectionEmbedding)]
 @[@(NSWritingDirectionRightToLeft | NSWritingDirectionOverride)]


{% endhighlight %}



## NSVerticalGlyphFormAttributeName

**说明：NSVerticalGlyphFormAttributeName  设置文字排版方向，取值为NSNumber对象（整数），0表示横排文本，1表示竖排文本  在iOS中只支持0**

例如：

{% highlight ruby %}

//设置文字排版方向 NSVerticalGlyphFormAttributeName
NSString *str15 = @"设置文字排版方向\n";
NSDictionary *dictAttr15 = @{NSVerticalGlyphFormAttributeName:@(0)};
NSAttributedString *attr15 = [[NSAttributedString alloc]initWithString:str15 attributes:dictAttr15];
[attributedString appendAttributedString:attr15];

{% endhighlight %}


# UITextView的代理




{% highlight ruby %}

// UITextView的代理方法
// 下面四个代理方法参考UITextField的教程。
- (BOOL)textViewShouldBeginEditing:(UITextView *)textView;
- (BOOL)textViewShouldEndEditing:(UITextView *)textView;
 
- (void)textViewDidBeginEditing:(UITextView *)textView;
- (void)textViewDidEndEditing:(UITextView *)textView;
 
- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text; // 告诉代理，某个textView的文本将要被修改。返回YES允许修改，NO不允许。
- (void)textViewDidChange:(UITextView *)textView;  // 告诉代理，textView的文本或文本属性已经被用户修改了。
 
- (void)textViewDidChangeSelection:(UITextView *)textView; // 告诉代理，指定文本段已被修改。并且可以通过textView的selectedRange属性获取到修改范围。
 
- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange NS_AVAILABLE_IOS(7_0); // 询问代理，是否允许用户可以对文本内的URL做出请求交互。返回YES允许，NO不允许。
- (BOOL)textView:(UITextView *)textView shouldInteractWithTextAttachment:(NSTextAttachment *)textAttachment inRange:(NSRange)characterRange NS_AVAILABLE_IOS(7_0); // 询问代理，是否允许用户对范围内文本的附属内容做出相应交互。YES允许，NO不允许

{% endhighlight %}







NSString *const NSLinkAttributeName;


点击去github下载[TextViewDemo][1]

 
<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/TextViewDemo.git