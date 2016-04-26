---
layout: post
title: 动态计算UITableViewCell高度详解
description: 动态计算UITableViewCell高度详解

tagline: original post at hetaodie.github.io
categories: [UITableViewCell]
tags: [UITableViewCell]

image1: /assets/media/autoLayout/1.jpg
image2: /assets/media/autoLayout/2.jpg
image3: /assets/media/autoLayout/3.jpg
image4: /assets/media/autoLayout/4.jpg
image5: /assets/media/autoLayout/5.jpg
image6: /assets/media/autoLayout/6.jpg
image7: /assets/media/autoLayout/7.jpg
image8: /assets/media/autoLayout/8.jpg


---


* 目录
 {:toc  }
 

# Auto Layout with UILabel in UITableViewCell

创建一个空的xib,命名为C1.xib, 然后拖入一个UITableViewCell控件。接着创建一个UITableViewCell的子类，命名为C1类。然后在C1.xib中，将与C1类进行关联。别给我说你不会关联，如果不会那看下图你就明白了。

![]({{ page.image1 }})

只需要在Class那里写入关联的类名C1即可。


还有由于UITableViewCell需要重用功能，所以我们还需要设置一个重用标识

![]({{ page.image2 }})

在Identifier那里写入重用标识C1,当然你也可以用任意字符。不过后面代码里需要这个字符。


接着我们来布局。用到了auto layout, 在此我不想介绍auto layout, 以后有时间再专门介绍，下图就是我布局

![]({{ page.image3 }})

这儿有两点需要说明：1. UILabel的属性Lines这儿设为了0表示显示多行。2. Auto Layout一定要建立完完整。


接着我们在UITableView中来使用我们自定义的UITableViewCell C1.
首先我们创建一个UITableViewController的子类T1ViewController, 接着在Main.storyboard中拖入一个UITableViewController，并关联T1ViewController.

![]({{ page.image4 }})

一切都准备好了，那我们现在来写点代码，给UITableView加点料。
我们想要我们的UITableView使用C1.xib中自定义的Cell,那么我们需要向UITableView进行注册。

{% highlight ruby %}

UINib *cellNib = [UINib nibWithNibName:@"C1" bundle:nil];
[self.tableView registerNib:cellNib forCellReuseIdentifier:@"C1"];

{% endhighlight %}


这样就进行注册了，接着我们还需要每行显示的数据，为了简单一点，我就声明了一个NSArray变量来存放数据。

{% highlight ruby %}

self.tableData = @[@"1\n2\n3\n4\n5\n6", @"123456789012345678901234567890", @"1\n2", @"1\n2\n3", @"1"];

{% endhighlight %}

现在实现UITableViewDataSource的protocol:

{% highlight ruby %}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    // Return the number of rows in the section.
    return self.tableData.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    C1 *cell = [self.tableView dequeueReusableCellWithIdentifier:@"C1"];
    cell.t.text = [self.tableData objectAtIndex:indexPath.row];
    return cell;
}

{% endhighlight %}

从self.tableData中的数据我们可以看到，每一个Cell显示的数据高度是不一样的，那么我们需要动态计算Cell的高度。由于是auto layout，所以我们需要用到一个新的API systemLayoutSizeFittingSize:来计算UITableViewCell所占空间高度。Cell的高度是在- (CGFloat)tableView:(UITableView )tableView heightForRowAtIndexPath:(NSIndexPath )indexPath这个UITableViewDelegate的方法里面传给UITableView的。

`这里有一个需要特别注意的问题，也是效率问题。UITableView是一次性计算完所有Cell的高度，如果有1W个Cell，那么- (CGFloat)tableView:(UITableView )tableView heightForRowAtIndexPath:(NSIndexPath )indexPath就会触发1W次，然后才显示内容。不过在iOS7以后，提供了一个新方法可以避免这1W次调用，它就是- (CGFloat)tableView:(UITableView )tableView estimatedHeightForRowAtIndexPath:(NSIndexPath )indexPath。要求返回一个Cell的估计值，实现了这个方法，那只有显示的Cell才会触发计算高度的protocol. 由于systemLayoutSizeFittingSize需要cell的一个实例才能计算，所以这儿用一个成员变量存一个Cell的实列，这样就不需要每次计算Cell高度的时候去动态生成一个Cell实例，这样即方便也高效也少用内存，可谓一举三得。`

我们声明一个存计算Cell高度的实例变量：

{% highlight ruby %}

@property (nonatomic, strong) UITableViewCell *prototypeCell;

{% endhighlight %}

然后初始化它：

{% highlight ruby %}

self.prototypeCell  = [self.tableView dequeueReusableCellWithIdentifier:@"C1"];

{% endhighlight %}

下面是计算Cell高度的实现：

{% highlight ruby %}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    C1 *cell = (C1 *)self.prototypeCell;
    cell.t.text = [self.tableData objectAtIndex:indexPath.row];
    CGSize size = [cell.contentView systemLayoutSizeFittingSize:UILayoutFittingCompressedSize];
    NSLog(@"h=%f", size.height + 1);
    return 1  + size.height;
}

{% endhighlight %}

看了代码，可能你有点疑问，为何这儿要加1呢？笔者告诉你，如果不加1，结果就是错误的，Cell中UILabel将显示不正确。原因就是因为这行代码`CGSize size = [cell.contentView systemLayoutSizeFittingSize:UILayoutFittingCompressedSize];`由于是在`cell.contentView`上调用这个方法，那么返回的值将是`contentView`的高度，`UITableViewCell`的高度要比它的`contentView`要高1,也就是它的分隔线的高度。如果你不相信，那请看`C1.xib`的属性，比较下面两张图。

![]({{ page.image5 }})


 发现没`Cell`的高度是127, 面`contentView`的高度是126, 这下明白了吧。

为了让读者看清楚，我将`Cell`中`UILabel`的背景色充为了`light gray`.下面是运行效果：

![]({{ page.image6 }})

# Auto Layout with UITextView in UITableViewCell



本小段教程将介绍UITextView在cell中计算高度需要注意的地方。同样参考上面我们创建一个C2.xib, UITableViewCell的子类C2,并关联C2.xib与C2类。并在C2.xib中对其布局，同样使用了auto layout. 布局如下图：

![]({{ page.image7 }})

创始UITableViewController的了类T2ViewController，在Main.storyboard中拖入UITableViewController,并关联他们。接着代码中注册C2.xib到UITableView.

下面计是计算高度的代码：

{% highlight ruby %}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    C2 *cell = (C2 *)self.prototypeCell;
    cell.t.text = [self.tableData objectAtIndex:indexPath.row];
    CGSize size = [cell.contentView systemLayoutSizeFittingSize:UILayoutFittingCompressedSize];
    CGSize textViewSize = [cell.t sizeThatFits:CGSizeMake(cell.t.frame.size.width, FLT_MAX)];
    CGFloat h = size.height + textViewSize.height;
    h = h > 89 ? h : 89;  //89是图片显示的最低高度， 见xib
    NSLog(@"h=%f", h);
    return 1 + h;
}

{% endhighlight %}

在这儿我们是通过`sizeThatFits:`计算的`UITextView`的高度(这是计算`UITextView`内容全部显示时的方法，在第四小段中我们还会用到它)，然后加上`systemLayoutSizeFittingSize:`返回的高度。为什么要这样呢？ 因为`UITextView`内容的高度不会影响`systemLayoutSizeFittingSize`计算。这句话什么意思呢？我真不知道如何用言语表达了。还是先上一张图吧：

![]({{ page.image8 }})

此图中距顶的约束是10, 距底的约束8, 距左边约束是87,距右边的约束是13, 那么`systemLayoutSizeFittingSize:`返回的`CGSize`为`height`等于19, `width`等于100. 它`UITextView`的`frame`是不影响`systemLayoutSizeFittingSize:`的计算。不知道这样说大家明白没。
所以，我们需要加上`textViewSize.height`. 

下面是运行效果：

![]({{ page.image9 }})


# Demo

具体Demo代码下载：

[Demo][1]


<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/CellHeightDemo-master

{% highlight ruby %}

{% endhighlight %}