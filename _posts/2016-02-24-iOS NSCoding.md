---
layout: post
title: NSCoding
description: 本文详细讲解了NSCoding 详细用法
categories: [iOS]
tags: [iOS, NSCoding]
---


**目录**

* 目录
 {:toc  }


# NSCoding说明


NScoding 是一个协议，主要有下面两个方法
`-(id)initWithCoder:(NSCoder *)coder;`//从coder中读取数据，保存到相应的变量中，即反序列化数据
`-(void)encodeWithCoder:(NSCoder *)coder;`// 读取实例变量，并把这些数据写到coder中去。序列化数据
NSCoder 是一个抽象类，抽象类不能被实例话，只能提供一些想让子类继承的方法。
`NSKeyedUnarchiver`   从二进制流读取对象。
`NSKeyedArchiver`       把对象写到二进制流中去。

# 例子


{% highlight ruby %}

@interface Book : NSObject <NSCoding>
@property NSString *title;
@property NSString *author;
@property NSUInteger pageCount;
@property NSSet *categories;
@property (getter = isAvailable) BOOL available;
@end

@implementation Book

#pragma mark - NSCoding

- (id)initWithCoder:(NSCoder *)decoder {
    self = [super init];
    if (!self) {
        return nil;
    }

    self.title = [decoder decodeObjectForKey:@"title"];
    self.author = [decoder decodeObjectForKey:@"author"];
    self.pageCount = [decoder decodeIntegerForKey:@"pageCount"];
    self.categories = [decoder decodeObjectForKey:@"categories"];
    self.available = [decoder decodeBoolForKey:@"available"];

    return self;
}

- (void)encodeWithCoder:(NSCoder *)encoder {
    [encoder encodeObject:self.title forKey:@"title"];
    [encoder encodeObject:self.author forKey:@"author"];
    [encoder encodeInteger:self.pageCount forKey:@"pageCount"];
    [encoder encodeObject:self.categories forKey:@"categories"];
    [encoder encodeBool:[self isAvailable] forKey:@"available"];
}

@end

{% endhighlight %}

## 序列化写入磁盘

{% highlight ruby %}

Archiving
[NSKeyedArchiver archiveRootObject:books toFile:@"/path/to/archive"];


Unarchiving
[NSKeyedUnarchiver unarchiveObjectWithFile:@"/path/to/archive"];

{% endhighlight %}

## 序列化写入NSUserDefaults

{% highlight ruby %}

Archiving
NSData *data = [NSKeyedArchiver archivedDataWithRootObject:books];
[[NSUserDefaults standardUserDefaults] setObject:data forKey:@"books"];

{% endhighlight %}

{% highlight ruby %}

Unarchiving
NSData *data = [[NSUserDefaults standardUserDefaults] objectForKey:@"books"];
NSArray *books = [NSKeyedUnarchiver unarchiveObjectWithData:data];
{% endhighlight %}

<br />

