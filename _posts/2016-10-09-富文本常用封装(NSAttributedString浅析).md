---
layout: post
title: 富文本常用封装(NSAttributedString浅析)
description: 本文详细介绍了富文本常用封装(NSAttributedString浅析)。

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [javaScriptCore]

image1: /assets/media/NSAttributedString/1.png
image2: /assets/media/NSAttributedString/2.png

---

**目录**

* 目录
 {:toc  }

# 谈谈NSAttributedString

## 初始化方法

{% highlight ruby %}

- (instancetype)initWithString:(NSString *)str;
- (instancetype)initWithString:(NSString *)str attributes:(nullable NSDictionary<NSString *, id> *)attrs;
- (instancetype)initWithAttributedString:(NSAttributedString *)attrStr;

{% endhighlight %}

- 第一种使用字符串初始化初始化富文本
- 第二种使用字符串及属性字典（就是配置富文本的相关属性）初始化富文本
- 第三种就是用其他富文本初始化富文本


## 常用操作API

### 为某一范围内文字添加某个属性
{% highlight ruby %}

- (void)addAttribute:(NSString *)name value:(id)value range:(NSRange)range;

{% endhighlight %}

![]({{ page.image1 }})

### 为某一范围内文字添加多个属性（两个API效果与格式一样）

{% highlight ruby %}

- (void)addAttributes:(NSDictionary<NSString *, id> *)attrs range:(NSRange)range;

- (void)setAttributes:(nullable NSDictionary<NSString *, id> *)attrs range:(NSRange)range;

{% endhighlight %}


![]({{ page.image2 }})


### 移除某范围内的某个属性

{% highlight ruby %}

- (void)removeAttribute:(NSString *)name range:(NSRange)range;
- 
{% endhighlight %}

## 相关可设置属性对照

- NSFontAttributeName ：字体字号
	- value值：UIFont类型
- NSParagraphStyleAttributeName ： 段落样式
	- value值：NSParagraphStyle类型（其属性如下）
	- lineSpacing 行间距(具体用法可查看上面的设置行间距API)
	- paragraphSpacing 段落间距
	- alignment 对齐方式
	- firstLineHeadIndent 指定段落开始的缩进像素
	- headIndent 调整全部文字的缩进像素
- NSForegroundColorAttributeName 字体颜色
	- value值：UIColor类型
- NSBackgroundColorAttributeName 背景颜色
	- value值：UIColor类型
- NSObliquenessAttributeName 字体粗倾斜
v	- alue值：NSNumber类型
- NSExpansionAttributeName 字体加粗
	- value值：NSNumber类型(比例) 0就是不变 1增加一倍
- NSKernAttributeName 字间距
	- value值：CGFloat类型
- NSUnderlineStyleAttributeName 下划线
	- value值：1或0
- NSUnderlineColorAttributeName 下划线颜色
	- value值：UIColor类型
- NSStrikethroughStyleAttributeName 删除线
	- value值：1或0
- NSStrikethroughColorAttributeName 删除线颜色
	- value值：UIColor类型
- NSStrokeColorAttributeName 字体颜色
	- value值：UIColor类型
- NSStrokeWidthAttributeName 字体描边
	- value值：CGFloat
- NSLigatureAttributeName 连笔字
	- value值：1或0
- NSShadowAttributeName 阴影
	- value值：NSShawdow类型（下面是其属性）
	- shadowOffset 影子与字符串的偏移量
	- shadowBlurRadius 影子的模糊程度
	- shadowColor 影子的颜色
- NSTextEffectAttributeName 设置文本特殊效果,目前只有图版印刷效果可用
	- value值：NSString类型
- NSAttachmentAttributeName 设置文本附件
	- value值：NSTextAttachment类型（没研究过，可自行百度研究）
- NSLinkAttributeName 链接
	- value值：NSURL (preferred) or NSString类型
- NSBaselineOffsetAttributeName 基准线偏移
	- value值：NSNumber类型
- NSWritingDirectionAttributeName 文字方向 分别代表不同的文字出现方向
	- value值：@[@(1),@(2)]
- NSVerticalGlyphFormAttributeName 水平或者竖直文本 在- iOS没卵用，不支持竖版
	- value值：1竖直 0水平

# 常用需求封装

## 需求：在我们日常开发中，某些句子中会有改变某些字颜色的需求，当然颜色一般而言就是为了着重强调，常为同一种颜色，所以下面代码是单纯改变一句话中的某些字的颜色（一种颜色）


{% highlight ruby %}

/**
 *  单纯改变一句话中的某些字的颜色（一种颜色）
 *
 *  @param color    需要改变成的颜色
 *  @param totalStr 总的字符串
 *  @param subArray 需要改变颜色的文字数组(要是有相同的 只取第一个)
 *
 *  @return 生成的富文本
 */
+ (NSMutableAttributedString *)ls_changeCorlorWithColor:(UIColor *)color TotalString:(NSString *)totalStr SubStringArray:(NSArray *)subArray {

    NSMutableAttributedString *attributedStr = [[NSMutableAttributedString alloc] initWithString:totalStr];
    for (NSString *rangeStr in subArray) {

        NSRange range = [totalStr rangeOfString:rangeStr options:NSBackwardsSearch];
        [attributedStr addAttribute:NSForegroundColorAttributeName value:color range:range];
    }

    return attributedStr;
}

{% endhighlight %}

## 需求：需要更改字间距来适应整体UI

{% highlight ruby %}
/**
 *  单纯改变句子的字间距（需要 <CoreText/CoreText.h>）
 *
 *  @param totalString 需要更改的字符串
 *  @param space       字间距
 *
 *  @return 生成的富文本
 */
+ (NSMutableAttributedString *)ls_changeSpaceWithTotalString:(NSString *)totalString Space:(CGFloat)space {

    NSMutableAttributedString *attributedStr = [[NSMutableAttributedString alloc] initWithString:totalString];
    long number = space;
    CFNumberRef num = CFNumberCreate(kCFAllocatorDefault,kCFNumberSInt8Type,&number);
    [attributedStr addAttribute:(id)kCTKernAttributeName value:(__bridge id)num range:NSMakeRange(0,[attributedStr length])];
    CFRelease(num);

    return attributedStr;
}

{% endhighlight %}

## 需求：需要改变行间距来适应整体UI

{% highlight ruby %}

/**
 *  单纯改变段落的行间距
 *
 *  @param totalString 需要更改的字符串
 *  @param lineSpace   行间距
 *
 *  @return 生成的富文本
 */
+ (NSMutableAttributedString *)ls_changeLineSpaceWithTotalString:(NSString *)totalString LineSpace:(CGFloat)lineSpace {

    NSMutableAttributedString *attributedStr = [[NSMutableAttributedString alloc] initWithString:totalString];

    NSMutableParagraphStyle * paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:lineSpace];

    [attributedStr addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [totalString length])];

    return attributedStr;
}

{% endhighlight %}

## 需求：同时更改行间距和字间距

{% highlight ruby %}

/**
 *  同时更改行间距和字间距
 *
 *  @param totalString 需要改变的字符串
 *  @param lineSpace   行间距
 *  @param textSpace   字间距
 *
 *  @return 生成的富文本
 */
+ (NSMutableAttributedString *)ls_changeLineAndTextSpaceWithTotalString:(NSString *)totalString LineSpace:(CGFloat)lineSpace textSpace:(CGFloat)textSpace {

    NSMutableAttributedString *attributedStr = [[NSMutableAttributedString alloc] initWithString:totalString];

    NSMutableParagraphStyle * paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:lineSpace];

    [attributedStr addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [totalString length])];

    long number = textSpace;
    CFNumberRef num = CFNumberCreate(kCFAllocatorDefault,kCFNumberSInt8Type,&number);
    [attributedStr addAttribute:(id)kCTKernAttributeName value:(__bridge id)num range:NSMakeRange(0,[attributedStr length])];
    CFRelease(num);

    return attributedStr;
}

{% endhighlight %}

## 需求：更改某些文字的颜色并修改其字体，突出重点强调

{% highlight ruby %}

/**
 *  改变某些文字的颜色 并单独设置其字体
 *
 *  @param font        设置的字体
 *  @param color       颜色
 *  @param totalString 总的字符串
 *  @param subArray    想要变色的字符数组
 *
 *  @return 生成的富文本
 */
+ (NSMutableAttributedString *)ls_changeFontAndColor:(UIFont *)font Color:(UIColor *)color TotalString:(NSString *)totalString SubStringArray:(NSArray *)subArray {

    NSMutableAttributedString *attributedStr = [[NSMutableAttributedString alloc] initWithString:totalString];

    for (NSString *rangeStr in subArray) {

        NSRange range = [totalString rangeOfString:rangeStr options:NSBackwardsSearch];

        [attributedStr addAttribute:NSForegroundColorAttributeName value:color range:range];
        [attributedStr addAttribute:NSFontAttributeName value:font range:range];
    }

    return attributedStr;
}

{% endhighlight %}


{% highlight ruby %}


{% endhighlight %}

<!--本文所用的超链接-->

[1]:https://github.com/Glow-Inc/CADisplayLinkDemo.git
