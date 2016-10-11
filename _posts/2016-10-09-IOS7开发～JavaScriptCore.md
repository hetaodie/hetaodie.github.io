---
layout: post
title: IOS7开发～JavaScriptCore
description: 本文详细介绍了javascriptCore的使用。

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [javaScriptCore]

image1: /assets/media/iosJS/1.png
image2: /assets/media/iosJS/2.png
image3: /assets/media/iosJS/3.png

image2: /assets/media/iosJS/4.png
image3: /assets/media/iosJS/5.png

---

**目录**

* 目录
 {:toc  }

# 简介

JavaScriptCore.framework ：iOS7 中新加入的框架，用来处理JavaScript。要在代码中使用，首先引入框架   #import <JavaScriptCore/JavaScriptCore.h>

# 主要内容

## Objective-C → JavaScript

了解下面几个类：

JSContext：一个 Context 就是一个 JavaScript 代码执行的环境，也叫作用域。他主要作用是执行js代码和注册native方法接口<br\>

JSValue：JS是弱类型的，ObjectiveC是强类型的，JSValue被引入处理这种类型差异，在 Objective-C 对象和 JavaScript 对象之间起转换作用<br\>
JSManagedValue是JSValue的封装，用它可以解决js和原声代码之间循环引用的问题<br\>
JSVirtualMachine 管理JS运行时和管理js暴露的native对象的内存
JSExport是一个协议，通过实现它可以完成把一个native对象暴漏给js<br\>

Objective-C 和 JavaScript 中类型的对照表：
![]({{ page.image1 }})

实例代码：1

{% highlight ruby %}

int main() {  
    JSContext *context = [[JSContextalloc]init];  
    JSValue *result = [context evaluateScript:@"2 + 2"];  
    NSLog(@"2 + 2 = %d", [result toInt32]);  
    return 0;  
}  

{% endhighlight %}

实例代码：2

（1）新建一个test.js文件，其中实现代码：
{% highlight ruby %}
2
//计算阶乘  
var factorial = function(n) {  
    if (n < 0)  
        return;  
    if (n === 0)  
        return 1;  
    return n * factorial(n - 1)  
};  

{% endhighlight %}

![]({{ page.image2 }})

（2）调用时实现代码：

{% highlight ruby %}

- (void) factorial  
    {  
        NSString *path = [[NSBundlemainBundle]pathForResource:@"test"ofType:@"js"];  
        NSString *testScript = [NSStringstringWithContentsOfFile:pathencoding:NSUTF8StringEncodingerror:nil];  
          
        JSContext *context = [[JSContextalloc]init];  
        [context evaluateScript:testScript];  
          
        JSValue *function = context[@"factorial"];  
        JSValue *result = [function callWithArguments:@[@10]];  
        NSLog(@"factorial(10) = %d", [resulttoInt32]);  
    }  
    
{% endhighlight %}

这样就计算出了10的阶乘。

注意：如果运行结果不正确，注意js文件是否已经加到项目的Buddle Resources中
![]({{ page.image3 }})


## JavaScript → Objective-C

可以通过两种方式在 JavaScript 中调用 Objective-C

1.  Blocks ：JS functions （对应 JS 函数）
2.  JSExport protocol ：JS objects （对应 JS 对象）

（1）Blocks


{% highlight ruby %}

- (void) testMakeUIColor  
    {  
        JSContext *context = [[JSContextalloc]init];  
          
        context[@"creatUIColor"] = ^(NSDictionary *rgbColor){  
            return [UIColor colorWithRed:([rgbColor[@"red"] floatValue] /255.0)  
                                   green:([rgbColor[@"green"]floatValue] /255.0)  
                                    blue:([rgbColor[@"blue"]floatValue] /255.0)  
                                   alpha:1];  
        };  
        JSValue *color = [contextevaluateScript:@"makeUIColor({red: 150, green: 150, blue: 200})"];  
        NSLog(@"color:%@",[colortoObject]);  
    } 
    
{% endhighlight %}
注意：
1、不要在 Block 中直接使用外面的 JSValue 对象, 把 JSValue 当做参数来传进 Block 中。
2、避免循引用，不要在 Block 中直接引用使用外面的 JSContext 对象，应该用[JSContext currentContext];

错误的做法：
![]({{ page.image4 }})

正确的做法：
![]({{ page.image5 }})

（2）JSExport protocol

首先引入 <br\>
 #import <objc/runtime.h><br\>
实例代码1:    JS代码设置Button 的 title<br\>

{% highlight ruby %}


@protocol UIButtonExport <JSExport>  
- (void)setTitle:(NSString *)title forState:(UIControlState)state;  
@end  
- (void) test  
{  
    class_addProtocol([UIButtonclass],@protocol(UIButtonExport));  
      
UIButton *button = [UIButtonbuttonWithType:UIButtonTypeSystem];  
    [button setTitle:@"Hello Objective-C"forState:UIControlStateNormal];  
    button.frame = CGRectMake(20,40,280,40);  
  
    JSContext *context = [[JSContextalloc]init];  
context[@"button"] = button;  
[context evaluateScript:@"button.setTitleForState('Hello JavaScript', 0)"];  
      
    [self.view addSubview:button];  
} 

{% endhighlight %}

说明：
上面代码中，我们申明一个 UIButtonExport 协议，该协议继承于 JSExport，并将setTitle:forState:方法开放到该协议中（只有 JSExport 协议中的方法才能被 JavaScript 识别），然后通过运行时让 UIButton 遵循 UIButtonExport 协议。这样你就可以在 JS 中为 Button 设置 title 了，需要说明一点的是，在 JS 中方法的命名规则与 Objective-C 中有点不一样，如 Objective-C 中的方法-(void)setX:(id)x Y:(id)y Z:(id)z;，加入到 JSExport 协议中，在 JS 中调用就得是setXYZ(x, y, z);，当然如果你不想根据这种命名转换规则，你也可以通过 JSExport.h 中的方法来修改：
{% highlight ruby %}

 #define JSExportAs(PropertyName, Selector) \
    @optional Selector __JS_EXPORT_AS__##PropertyName:(id)argument; @required Selector
#endif

{% endhighlight %}

如 setX:Y:Z 方法，我们可以给他重命名，让 JS 中通过 set3D(x,y,z) 来调用

{% highlight ruby %}

JSExportAs(set3D,
     - (void)setX:(id)x Y:(id)y Z:(id)z
);
<br\>

{% endhighlight %}


实例代码2:

a、新建类 NativeObject，代码实现L：
.h代码：

{% highlight ruby %}

#import <Foundation/Foundation.h>  
@import JavaScriptCore;  
@protocol NativeObjectExport <JSExport>  
-(void)log:(NSString*)string;  
@end  
  
@interface NativeObject : NSObject <NativeObjectExport>  
@end  
  
.m代码：  
#import "NativeObject.h"  
@implementation NativeObject  
  
-(void)log:(NSString*)string {  
    NSLog(@"js: %@", string);  
}  
@end  
  
调用代码：  
- (void) testLog  
{  
    JSContext *context = [[JSContextalloc]init];  
    context[@"nativeObject"] = [[NativeObjectalloc]init];  
    [context evaluateScript:@"nativeObject.log(\"Hello Javascript\")"];  
}

{% endhighlight %}


## Memory management

根据官方文档关于JS－OC内存管理总结：由于JS中全部都是强引用，如果JS 与 OC互相引用时，就要防止OC也强引用JS，这样会形成引用循环，所以OC要想办法弱引用，但弱引用会被系统释放，所以把可能被释放的对象放到一个容器中来防止对象被被错误释放<br\>

看代码（一）：

{% highlight ruby %}

JS：
function ClickHandler(button, callback) {
     this.button = button;
     this.button.onClickHandler = this;
     this.handleEvent = callback;
};
OC：
@implementation MyButton
- (void)setOnClickHandler:(JSValue *)handler
{
     _onClickHandler = handler; // Retain cycle
}
@end

{% endhighlight %}

如果直接保存 handler，就会出现内存泄露，因为 JS 中引用 button 对象是强引用，如果 Button 也用强引用来保存 JS 中的 handler，这就导致了 循环引用。我们没法改变 JavaScript 中的强引用机制，只能在 Objective-C 中弱引用 handler，为了防止 onclick handler 被错误释放， JavaScriptCore 给出的解决方案如下：

{% highlight ruby %}

- (void)setOnClickHandler:(JSValue *)handler
{
     _onClickHandler = [JSManagedValue managedValueWithValue:handler];
     [_context.virtualMachine addManagedReference:_onClickHandler
                                        withOwner:self]
}

{% endhighlight %}


代码（二）：


{% highlight ruby %}

- (void)loadColorsPlugin
{    
    // Load the plugin script from the bundle.
    NSString *path = [[NSBundlemainBundle]pathForResource:@"colors"ofType:@"js"];
    NSString *pluginScript = [NSStringstringWithContentsOfFile:pathencoding:NSUTF8StringEncodingerror:nil];
    
    _context = [[JSContextalloc]init];
    
    // We insert the AppDelegate into the global object so that when we call
    // -addManagedReference:withOwner: for the plugin object we're about to load
    // and pass the AppDelegate as the owner, the AppDelegate itself is reachable from
    // within JavaScript. If we didn't do this, the AppDelegate wouldn't be reachable
    // from JavaScript, and there wouldn't be anything keeping the plugin object alive.
    _context[@"AppDelegate"] =self;
    
    // Insert a block so that the plugin can create NSColors to return to us later.
    _context[@"makeNSColor"] = ^(NSDictionary *rgb){
        return [NSColorcolorWithRed:[rgb[@"red"]floatValue] / 255.0f
                               green:[rgb[@"green"]floatValue] /255.0f
                                blue:[rgb[@"blue"]floatValue] /255.0f
                               alpha:1.0f];
    };
    
    JSValue *plugin = [_contextevaluateScript:pluginScript];
    
    _colorPlugin = [JSManagedValuemanagedValueWithValue:plugin];
    [_context.virtualMachineaddManagedReference:_colorPluginwithOwner:self];
    [self.windowsetDelegate:self];
}


{% endhighlight %}

** 注意：**

- JSManagedValue：
将 JSValue 转为 JSManagedValue 类型后，可以添加到 JSVirtualMachine 对象中，这样能够保证你在使用过程中 JSValue 对象不会被释放掉，当你不再需要该 JSValue 对象后，从 JSVirtualMachine 中移除该 JSManagedValue 对象，JSValue 对象就会被释放并置空。

- JSVirtualMachine：JSVirtualMachine就是一个用于保存弱引用对象的数组，加入该数组的弱引用对象因为会被该数组 retain，所以保证了使用时不会被释放，当数组里的对象不再需要时，就从数组中移除，没有了引用的对象就会被系统释放。

## JavaScriptCore C API

{% highlight ruby %}

JSValue ↔ JSValueRef ：
        JSValueRef valueRef = XXX;
       JSValue *value = [JSValue valueWithJSValueRef:valueRef inContext:context];

       JSValue *value =  XXX;
      JSValueRef valueRef = [value JSValueRef];

JSContext ↔ JSGlobalContextRef ：
        JSGlobalContextRef ctx =  XXX;
        JSContext *context = [JSContext contextWithJSGlobalContextRef:ctx];

        ￼JSContext *context =  XXX;
        JSGlobalContextRef ctx = [context JSGlobalContextRef];

{% endhighlight %}



{% highlight ruby %}


{% endhighlight %}

