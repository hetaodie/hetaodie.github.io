---
layout: post
title:UITextView详解
description: 详细讲解了UITextView常用的api和在使用过程中的一些技巧和常见问题的解决方法，并配置了一个小demo。

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [iOS, title:UITextView]
---
**目录**

* 目录
 {:toc  }
 


# UITextView 常用属性



{% highlight ruby %}

// 初始化输入框并设置位置和大小
UITextView *textView = [[UITextView alloc] initWithFrame:CGRectMake(10, 10, 300, 180)];
// 设置预设文本
textView.text = @"";
// 设置文本字体
textView.font = [UIFont fontWithName:@"Arial" size:16.5f];
// 设置文本颜色
textView.textColor = [UIColor colorWithRed:51/255.0f green:51/255.0f blue:51/255.0f alpha:1.0f];
// 设置文本框背景颜色
textView.backgroundColor = [UIColor colorWithRed:254/255.0f green:254/255.0f blue:254/255.0f alpha:1.0f];
// 设置文本对齐方式
textView.textAlignment = NSTextAlignmentLeft;

// iOS7中文本对齐方式有以下几种：
//    enum {
//        NSTextAlignmentLeft      = 0,  左对齐，默认
//        NSTextAlignmentCenter    = 1,  居中对齐
//        NSTextAlignmentRight     = 2,  右对齐
//        NSTextAlignmentJustified = 3,  在一个段落的最后一行自然对齐
//        NSTextAlignmentNatural   = 4,  默认对齐方式
//    } NSTextAlignment;

// 设置自动纠错方式
textView.autocorrectionType = UITextAutocorrectionTypeNo;

// 自动纠错方式有以下几种：
//    enum {
//        UITextAutocorrectionTypeDefault,  默认
//        UITextAutocorrectionTypeNo,       不自动纠错
//        UITextAutocorrectionTypeYes,      自动纠错
//    } UITextAutocorrectionType;

// 设置自动大写方式
textView.autocapitalizationType = UITextAutocapitalizationTypeNone;

// 自动大写方式有以下几种：
//    enum {
//        UITextAutocapitalizationTypeNone,           不自动大写
//        UITextAutocapitalizationTypeWords,          单词首字母大写
//        UITextAutocapitalizationTypeSentences,      句子的首字母大写
//        UITextAutocapitalizationTypeAllCharacters,  所有字母都大写
//    } UITextAutocapitalizationType;

// 设置键盘的样式
textView.keyboardType = UIKeyboardTypeDefault;

// 键盘样式有以下几种：
//    enum {
//        UIKeyboardTypeDefault,                默认键盘，支持所有字符
//        UIKeyboardTypeASCIICapable,           支持ASCII的默认键盘
//        UIKeyboardTypeNumbersAndPunctuation,  标准电话键盘，支持＋＊＃字符
//        UIKeyboardTypeURL,                    只支持URL字符的URL键盘，支持.com按钮
//        UIKeyboardTypeNumberPad,              数字键盘
//        UIKeyboardTypePhonePad,               电话键盘
//        UIKeyboardTypeNamePhonePad,           支持输入人名的电话键盘
//        UIKeyboardTypeEmailAddress,           电子邮件键盘
//        UIKeyboardTypeDecimalPad,             有数字和小数点的数字键盘
//        UIKeyboardTypeTwitter,                优化的键盘，方便输入@、#字符
//        UIKeyboardTypeAlphabet = UIKeyboardTypeASCIICapable,
//    } UIKeyboardType;

// 设置return键样式
textView.returnKeyType = UIReturnKeyDefault;

// return键有以下几种样式：
//    enum {
//        UIReturnKeyDefault,        默认，灰色按钮，标有Return
//        UIReturnKeyGo,             标有Go的蓝色按钮
//        UIReturnKeyGoogle,         标有Google的蓝色按钮，用于搜索
//        UIReturnKeyJoin,           标有Join的蓝色按钮
//        UIReturnKeyNext,           标有Next的蓝色按钮
//        UIReturnKeyRoute,          标有Route的蓝色按钮
//        UIReturnKeySearch,         标有Search的蓝色按钮
//        UIReturnKeySend,           标有Send的蓝色按钮
//        UIReturnKeyYahoo,          标有Yahoo的蓝色按钮
//        UIReturnKeyYahoo,          标有Yahoo的蓝色按钮
//        UIReturnKeyEmergencyCall,  紧急呼叫按钮
//    } UIReturnKeyType;

 textview.dataDetectorTypes = UIDataDetectorTypeAll; //显示数据类型的连接模式（如电话号码、网址、地址等）

// 设置是否可以拖动
textView.scrollEnabled = YES;
// 设置代理
textView.delegate = self;
textView.editable  = NO;   // 设置textView是否可以编辑
textView.selectable = NO;  //设置textView是否可以进行选择，是否显示编辑menu

textView.selectedRange = NSRangeMake(0,10);  // 用来设置选择的范围


//用来设置滚动到那个位置
- (void)scrollRangeToVisible:(NSRange)range;


{% endhighlight %}


# UITextView的代理方法



{% highlight ruby %}

//将要开始编辑
- (BOOL)textViewShouldBeginEditing:(UITextView *)textView;

//将要结束编辑
- (BOOL)textViewShouldEndEditing:(UITextView *)textView;

//开始编辑
- (void)textViewDidBeginEditing:(UITextView *)textView;

//结束编辑
- (void)textViewDidEndEditing:(UITextView *)textView;

//内容将要发生改变编辑
- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text;

//内容发生改变编辑
- (void)textViewDidChange:(UITextView *)textView;

//焦点发生改变
- (void)textViewDidChangeSelection:(UITextView *)textView;


{% endhighlight %}


# UITextView通知

{% highlight ruby %}

UIKIT_EXTERN NSString * const UITextViewTextDidBeginEditingNotification;    //文本开始编辑通知

UIKIT_EXTERN NSString * const UITextViewTextDidChangeNotification;           //文本已经改变通知

UIKIT_EXTERN NSString * const UITextViewTextDidEndEditingNotification;      //文本结束编辑通知

{% endhighlight %}



点击去github下载[TextViewDemo][1]

 
<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/TextViewDemo.git