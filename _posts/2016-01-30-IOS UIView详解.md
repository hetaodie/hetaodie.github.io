---
layout: post
title: UIView详解
description: UIView表示屏幕上的一块矩形区域，它在App中占有绝对重要的地位，因为iOS中几乎所有可视化控件都是UIView的子类。负责渲染区域的内容，并且响应该区域内发生的触摸事件。

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [iOS, UIView]
---
**目录**

* 目录
 {:toc  }


# UIView的基本属性

// UIView是否接受events事件，默认为YES<br />
`BOOL userInteractionEnabled;` <br />
// 用于做标识所用，默认为0 <br />
`NSInteger tag;` <br />       
// Core Animation layer有关，在常用方法中再详细讲解<br />
`CALayer  *layer;`    <br />
// UIView在父视图中的位置<br />
`CGRect            frame;`    
// UIView相对自己的位置<br />
`CGRect            bounds;`<br />
// UIView的中心点. animatable<br />
`CGPoint           center;` <br />
// 线性代数里面讲的矩阵变换，这个是恒等变换,一般用来旋转，缩放<br />
`CGAffineTransform transform;`<br />
// 修改contentScaleFactor可以让UIView的渲染精度提高，这样即<br />使在CGAffineTransform放大之后仍然能保持锐利。<br />
`CGFloat contentScaleFactor;`<br />
// 是否允许多点触摸<br />
`BOOL multipleTouchEnabled;` <br />  
// default is NO<br />
`BOOL       exclusiveTouch;`  <br />       
// UIView的背影颜色<br />
`UIColor   backgroundColor;`  <br />
// UIView是否隐藏<br />
`BOOL hidden;`  <br />
// 为0时完全透明，为1时完全不透明。<br />
`CGFloat  alpha;` <br />
//在类的层次结构中，如果clipsTobounds设为YES,超出superView的部分subview就不会显示，否则会做显示， 默认情况下是NO。<br />
`BOOL clipsToBounds;`<br />
//这是一个优化属性，如果该值为YES, 那么绘图在绘制该视图的时候把整个视图当作不透明对待。这样，绘图系统在执行绘图过程中会优化一些操作并提升系统性能；如果是设置为NO, 绘图系统将其和其他内容平等对待，不去做优化操作。为了性能方面的考量，默认被置为YES(意味着‘优化’)。<br />
`BOOL opaque;`   <br />

`UIView  *superview;`// 父视图<br />
`NSArray *subviews;`// 子视图<br />
注：`frame`和`center`都是相对于父视图的，`bounds`是相对于自身的。当view完全透明和隐藏时不能响应事件。<br />
opaque 和 alpha是有关系的系的。 一个不透明视图需要整个边界里面的内容都是不透明的。基于这个原因，opaque设置为YES，要求对应的alpha必须为1.0。如果一个UIView实例opaque被设置为YES, 而同时它又没有完全填充它的边界(bounds),或者它包含了整个或部分的透明的内容视图，那么将会导致未知的结果。 因此，如果视图部分或全部支持透明，那么你必须把opaque这个值设置为No。<br />


# 几何方法类

// hitTest主要用途是用来寻找那个视图是被触摸了<br />
`- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event; `  <br />
// 如果我们不想让某个视图响应事件，让此方法返回NO就行了。默认为YES<br />
`- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event;`<br />
举个例子，建立一个TestView里面重载hitTest和pointInside方法：<br />

{% highlight ruby %}

- (UIView*)hitTest:(CGPoint)point withEvent:(UIEvent *)event{
    [super hitTest:point withEvent:event];
    return self;
}  

- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event{
    NSLog(@"view pointInside");
    return YES;
}  

{% endhighlight %}

然后在TestView中增加一个子视图TestSecondView也重载这两个方法


{% highlight ruby %}
- (UIView*)hitTest:(CGPoint)point withEvent:(UIEvent *)event{
    [super hitTest:point withEvent:event]; 
    return self;  
}  

- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event{
    NSLog(@"second view pointInside");
    return YES; 
}  

{% endhighlight %}

这里注意`[super hitTest:point withEvent:event];`必须要包括，否则`hitTest`无法调用父类的方法，这样就没法 使用`PointInside:withEvent:`进行判断，那么就没法进行子视图的遍历。当去掉这个语句的时候，触摸事件就不可能进到子视图中了，除非你在方法中直接返回子视图的对象。这样你在调试的过程中就会发现，每次你点击一个view都会先进入到这个view的父视图中的hitTest方法，然后 调用super的hitTest方法之后就会查找pointInside是否返回YES如果是，则就把消息传递个子视图处理，子视图用同样的方法递归查找 自己的子视图。所以从这里调试分析看，hitTest方法这种递归调用的方式就一目了然了。

{% highlight ruby %}

// 将像素point由point所在视图转换到目标视图view中，返回在目标视图view中的像素值
- (CGPoint)convertPoint:(CGPoint)point toView:(UIView *)view;
// 将像素point从view中转换到当前视图中，返回在当前视图中的像素值
- (CGPoint)convertPoint:(CGPoint)point fromView:(UIView *)view;
// 将rect由rect所在视图转换到目标视图view中，返回在目标视图view中的rect
- (CGRect)convertRect:(CGRect)rect toView:(UIView *)view;
// 将rect从view中转换到当前视图中，返回在当前视图中的rect
- (CGRect)convertRect:(CGRect)rect fromView:(UIView *)view;

{% endhighlight %}

# 控制级别类

{% highlight ruby %}

// 把视图从父类移除
- (void)removeFromSuperview;
// 添加子视图到某个位置
- (void)insertSubview:(UIView *)view atIndex:(NSInteger)index;
// 更改子视图的位置
- (void)exchangeSubviewAtIndex:(NSInteger)index1 withSubviewAtIndex:(NSInteger)index2;

// 添加子视图
- (void)addSubview:(UIView *)view;
// 把view放在siblingSubview下面
- (void)insertSubview:(UIView *)view belowSubview:(UIView *)siblingSubview;
// 把view放在siblingSubview上面
- (void)insertSubview:(UIView *)view aboveSubview:(UIView *)siblingSubview;
注：1、addSubview:和insertSubview: atIndex:的区别：
  [view addSubView:oneView] == [view insertSubview:oneView atIndex:view.subviews.cout];
// 将view显示在最前面（要将一个view显示在最前面，只要调用其父视图的bringSubviewToFront：方法）
- (void)bringSubviewToFront:(UIView *)view;
// 将view推送到背后
- (void)sendSubviewToBack:(UIView *)view;
// 当加入视图完成后调用
- (void)didAddSubview:(UIView *)subview;
// 将移除子视图会调用
- (void)willRemoveSubview:(UIView *)subview;
// 通知即将移动到新的父视图中
- (void)willMoveToSuperview:(UIView *)newSuperview;
// 通知已经到新父视图
- (void)didMoveToSuperview;
// 通知即将已移动到新的窗口
- (void)willMoveToWindow:(UIWindow *)newWindow;
// 通知已经移动新的窗口
- (void)didMoveToWindow;
// 判断一个视图是否在父视图层中
- (BOOL)isDescendantOfView:(UIView *)view;
// 获取标记的子视图
- (UIView *)viewWithTag:(NSInteger)tag;     
// 标记为需要重新布局，异步调用layoutIfNeeded刷新布局，不立即刷新，但layoutSubviews一定会被调用
- (void)setNeedsLayout;
// 如果有需要刷新的标记，立即调用layoutSubviews进行布局（如果没有标记，不会调用layoutSubviews）
- (void)layoutIfNeeded;
// 重新布局
- (void)layoutSubviews; 

{% endhighlight %}

# 渲染类

{% highlight ruby %}

// 重写此方法，执行重绘
- (void)drawRect:(CGRect)rect;
// 标记为需要重绘，异步调用drawRect
- (void)setNeedsDisplay;
// 标记为需要局部重绘
- (void)setNeedsDisplayInRect:(CGRect)rect;
注：drawRect是对receiver的重绘。setNeedDisplay在receiver标上一个需要被重新绘图的标记，在下一个draw周期自动重绘，iphone device的刷新频率是60hz，也就是1/60秒后重绘

{% endhighlight %}

# 动画类

{% highlight ruby %}

// 开始一个动画
+ (void)beginAnimations:(NSString *)animationID context:(void *)context; 
// 执行动画,类似数据库的事务处理
+ (void)commitAnimations; 
// 设置动画代理，默认为nil
+ (void)setAnimationDelegate:(id)delegate; 
// 当动画执行开始时，执行selector方法，默认为NULL
+ (void)setAnimationWillStartSelector:(SEL)selector;
// 当动画执行结束时，执行selector方法
+ (void)setAnimationDidStopSelector:(SEL)selector; 
// 设置动画时间，时间参数为double类型，默认0.2
+ (void)setAnimationDuration:(NSTimeInterval)duration;
// 设置动画延迟时间
+ (void)setAnimationDelay:(NSTimeInterval)delay;  
// 设置在动画块内部动画内部动画属性改变的开始时间
+ (void)setAnimationStartDate:(NSDate *)startDate;
// 设置动画的旋转曲度变化，默认为UIViewAnimationCurveEaseInOut.值定义在UIViewAnimationCurve结构体中。
typedef NS_ENUM(NSInteger, UIViewAnimationCurve) { //动画曲线
    // 缓慢开始，中间加速，然后减速到结束
    UIViewAnimationCurveEaseInOut,   
    // 缓慢开始，加速到结束     
    UIViewAnimationCurveEaseIn,    
    // 加速开始，加速到结束        
    UIViewAnimationCurveEaseOut, 
    //正常速度          
    UIViewAnimationCurveLinear  
};
+ (void)setAnimationCurve:(UIViewAnimationCurve)curve; 
// 设置动画在动画模块中的重复次数
+ (void)setAnimationRepeatCount:(float)repeatCount;                 
// 设置动画块中的动画效果是否自动重复播放
+ (void)setAnimationRepeatAutoreverses:(BOOL)repeatAutoreverses;    
// 设置动画是否从当前状态开始播放，默认为NO.
+ (void)setAnimationBeginsFromCurrentState:(BOOL)fromCurrentState;  
// 在动画设置过渡效果
+ (void)setAnimationTransition:(UIViewAnimationTransition)transition forView:(UIView *)view cache:(BOOL)cache;
transition把一个过渡效果应用到视图中。值定义在UIViewAnimationTransition结构体中。
typedef NS_ENUM(NSInteger, UIViewAnimationTransition) {
    UIViewAnimationTransitionNone, 没有过渡
    UIViewAnimationTransitionFlipFromLeft,  翻转视图从左到右
    UIViewAnimationTransitionFlipFromRight, 翻转视图从右到左
    UIViewAnimationTransitionCurlUp, 从上卷动
    UIViewAnimationTransitionCurlDown, 从下卷动
};
view:需要过渡的视图对象。
cache:如果是YES，那么在开始和结束图片视图渲染一次并在动画中创建帧；否则，视图将会在每一帧都渲染。例如缓存，你不需要在视图转变中不停的更新，你只需要等到转换完成再去更新视图。
1、开始一个动画块。
2、在容器视图中设置转换。
3、在容器视图中移除子视图。
4、在容器视图中添加子视图。
5、结束动画块。
// 设置是否开启动画，默认YES,开启
+ (void)setAnimationsEnabled:(BOOL)enabled;
// 验证动画是否开启，YES开启，NO关闭
+ (BOOL)areAnimationsEnabled;               
// iOS7之后替代 setAnimationsEnabled
+ (void)performWithoutAnimation:(void (^)(void))actionsWithoutAnimation;
// iOS4.0之后,动画效果处理块
+ (void)animateWithDuration:(NSTimeInterval)duration delay:(NSTimeInterval)delay options:(UIViewAnimationOptions)options animations:(void (^)(void))animations completion:(void (^)(BOOL finished))completion;
(NSTimeInterval)duration :动画时间
(NSTimeInterval)delay:延迟时间
(UIViewAnimationOptions)options 动画参数
typedef NS_OPTIONS(NSUInteger, UIViewAnimationOptions) {
    UIViewAnimationOptionLayoutSubviews            = 1 <<  0,
    UIViewAnimationOptionAllowUserInteraction      = 1 <<  1, // turn on user interaction while animating
    UIViewAnimationOptionBeginFromCurrentState     = 1 <<  2, // start all views from current value, not initial value
    UIViewAnimationOptionRepeat                    = 1 <<  3, // repeat animation indefinitely
    UIViewAnimationOptionAutoreverse               = 1 <<  4, // if repeat, run animation back and forth
    UIViewAnimationOptionOverrideInheritedDuration = 1 <<  5, // ignore nested duration
    UIViewAnimationOptionOverrideInheritedCurve    = 1 <<  6, // ignore nested curve
    UIViewAnimationOptionAllowAnimatedContent      = 1 <<  7, // animate contents (applies to transitions only)
    UIViewAnimationOptionShowHideTransitionViews   = 1 <<  8, // flip to/from hidden state instead of adding/removing

    UIViewAnimationOptionCurveEaseInOut            = 0 << 16, // default
    UIViewAnimationOptionCurveEaseIn               = 1 << 16,
    UIViewAnimationOptionCurveEaseOut              = 2 << 16,
    UIViewAnimationOptionCurveLinear               = 3 << 16,

    UIViewAnimationOptionTransitionNone            = 0 << 20, // default
    UIViewAnimationOptionTransitionFlipFromLeft    = 1 << 20,
    UIViewAnimationOptionTransitionFlipFromRight   = 2 << 20,
    UIViewAnimationOptionTransitionCurlUp          = 3 << 20,
    UIViewAnimationOptionTransitionCurlDown        = 4 << 20,
    UIViewAnimationOptionTransitionCrossDissolve   = 5 << 20,
    UIViewAnimationOptionTransitionFlipFromTop     = 6 << 20,
    UIViewAnimationOptionTransitionFlipFromBottom  = 7 << 20,
} NS_ENUM_AVAILABLE_IOS(4_0);
(void))animations :动画效果块
可以设置属性如下：frame\bounds\center\transform\alpha\backgroundColor\contentStretch
completion:(void (^)(BOOL finished))completion 动画结束块
例：
[UIView animateWithDuration: 2.00 delay:3.00 options:UIViewAnimationOptionAllowAnimatedContent
                 animations:^{
                         insertDemoTwo.alpha = 0.1;
                         insertDemoOne.alpha = 1.0;
                                        }
                 completion:^(BOOL finished) {
                     [UIView animateWithDuration:3.00
                                      animations:^{
                                          insertDemoTwo.center = CGPointMake(500.0, 470.0);
                                          insertDemoOne.center = CGPointMake(140.0, 100.0);
                                      }
                      ];


                 }

 ];


// 动画效果处理（无延迟，无参数）iOS4.0之后，默认delay = 0.0,options = 0;
+ (void)animateWithDuration:(NSTimeInterval)duration animations:(void (^)(void))animations completion:(void (^)(BOOL finished))completion;
例：
[UIView animateWithDuration:3.00
                 animations:^{
                     insertDemoOne.alpha = 1.0;
                     insertDemoTwo.alpha = 0.1;
                 }
                 completion:^(BOOL finished) {
                     insertDemoTwo.center = CGPointMake(500.0, 470.0);
                     insertDemoOne.center = CGPointMake(140.0, 100.0);                    
                     }
 ];

//动画效果处理简单版 iOS4.0之后（delay = 0.0,options = 0,completion = NULL）
+ (void)animateWithDuration:(NSTimeInterval)duration animations:(void (^)(void))animations;

+ (void)animateWithDuration:(NSTimeInterval)duration delay:(NSTimeInterval)delay usingSpringWithDamping:(CGFloat)dampingRatio initialSpringVelocity:(CGFloat)velocity options:(UIViewAnimationOptions)options animations:(void (^)(void))animations completion:(void (^)(BOOL finished))completion NS_AVAILABLE_IOS(7_0);

// 过渡动画效果块，iOS4.0
+ (void)transitionWithView:(UIView *)view duration:(NSTimeInterval)duration options:(UIViewAnimationOptions)options animations:(void (^)(void))animations completion:(void (^)(BOOL finished))completion;
例：
[UIView transitionWithView:insertDemoOne duration: 1.0 options:UIViewAnimationOptionTransitionFlipFromLeft
                                     animations:^{
                                         [insertDemoTwo removeFromSuperview];
                                         [insertDemoOne addSubview:insertDemoTwo];
                                     }
                                     completion:^(BOOL finished) {
                                         insertDemoOne.backgroundColor = [UIColor brownColor];
                                     }];

// 视图之间切换的过渡动画效果块，iOS4
+ (void)transitionFromView:(UIView *)fromView toView:(UIView *)toView duration:(NSTimeInterval)duration options:(UIViewAnimationOptions)options completion:(void (^)(BOOL finished))completion;


+ (void)performSystemAnimation:(UISystemAnimation)animation onViews:(NSArray *)views options:(UIViewAnimationOptions)options animations:(void (^)(void))parallelAnimations completion:(void (^)(BOOL finished))completion NS_AVAILABLE_IOS(7_0);

{% endhighlight %}


# 手势类

{% highlight ruby %}

// 手势识别器（iOS3.2）
NSArray *gestureRecognizers;

UIKit 中UIGestureRecognizer类的子类系列如下：
UITapGestureRecognizer – “轻击”手势。可以配置为“单击”和“连击”的识别。
UIPinchGestureRecognizer –“捏合”手势。该手势通常用于缩放视图或改变可视组件的大小。
UIPanGestureRecognizer – “平移”手势。识别拖拽或移动动作。
UISwipeGestureRecognizer – “轻扫”手势。当用户从屏幕上划过时识别为该手势。可以指定该动作的方向（上、下、左、右）。
UIRotationGestureRecognizer – “转动”手势。用户两指在屏幕上做相对环形运动。
UILongPressGestureRecognizer – “长按”手势。使用1指或多指触摸屏幕并保持一定时间。
// 绑定手势到视图（iOS3.2）
- (void)addGestureRecognizer:(UIGestureRecognizer*)gestureRecognizer; 
//从视图中移除手势 (iOS3.2)
- (void)removeGestureRecognizer:(UIGestureRecognizer*)gestureRecognizer;
//手势识别处理方式在gesture recognizer视图转出《UIGestureRecognizerStatePossible》状态时调用，如果返回NO,则转换到《UIGestureRecognizerStateFailed》;如果返回YES,则继续识别触摸序列.(默认情况下为YES)。(iOS6.0)
- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer;
8、移动效果类(iOS7.0)
- (void)addMotionEffect:(UIMotionEffect *)effect;
- (void)removeMotionEffect:(UIMotionEffect *)effect;
9、基于布局约束类(iOS6.0)
// 视图布局约束
- (NSArray *)constraints;
// 视图布局上添加一个约束
- (void)addConstraint:(NSLayoutConstraint *)constraint;
// 视图布局上添加多个约束
- (void)addConstraints:(NSArray *)constraints;
// 移除视力布局上的一个约束
- (void)removeConstraint:(NSLayoutConstraint *)constraint;
// 移除视图布局上的多个约束
- (void)removeConstraints:(NSArray *)constraints;

{% endhighlight %}

# 基于布局的约束core方法(iOS 6.0)

{% highlight ruby %}

// 调用新的视图布局自动触发，更新视图布局上的约束
- (void)updateConstraintsIfNeeded;
// 更新自定义视图布局约束
- (void)updateConstraints; 
// 判断视图布局是否需要更新约束
- (BOOL)needsUpdateConstraints;
// 设置视图布局是否需要更新约束
- (void)setNeedsUpdateConstraints;

{% endhighlight %}

# 基于约束的兼容性（iOS 6.0）

{% highlight ruby %}

// 标示是否自动遵循视图布局约束，默认为YES
- (BOOL)translatesAutoresizingMaskIntoConstraints; 
// 设置是否自动遵循视图布局约束
- (void)setTranslatesAutoresizingMaskIntoConstraints:(BOOL)flag;
// 返回是遵循自定义视图布局约束
+ (BOOL)requiresConstraintBasedLayout NS_AVAILABLE_IOS(6_0);

{% endhighlight %}

# 层次布局的约束（iOS 6.0）

{% highlight ruby %}

// 返回矩形对于指定视图框架
- (CGRect)alignmentRectForFrame:(CGRect)frame;
// 返回框架对于指定视图矩形
- (CGRect)frameForAlignmentRect:(CGRect)alignmentRect;
// 返回自定义视图大小
- (UIEdgeInsets)alignmentRectInsets;
// 如果超出约束范围，自动生成基线限制，以满足视图需求
- (UIView *)viewForBaselineLayout;
// 返回放大的视图布局轴线
- (UILayoutPriority)contentHuggingPriorityForAxis:(UILayoutConstraintAxis)axis;
// 设置放大的视图布局的轴线
- (void)setContentHuggingPriority:(UILayoutPriority)priority forAxis:(UILayoutConstraintAxis)axis;
// 返回缩小的视图布局的轴线
- (UILayoutPriority)contentCompressionResistancePriorityForAxis:(UILayoutConstraintAxis)axis;
// 设置缩小的视图布局轴线
- (void)setContentCompressionResistancePriority:(UILayoutPriority)priority forAxis:(UILayoutConstraintAxis)axis;

{% endhighlight %}


# 设备大小布局约束(iOS 6.0)

{% highlight ruby %}

// 满足约束视图布局的大小
- (CGSize)systemLayoutSizeFittingSize:(CGSize)targetSize;

# 布局调度(iOS 6.0)

// 返回影响视图布局限制的轴线
- (NSArray *)constraintsAffectingLayoutForAxis:(UILayoutConstraintAxis)axis;
// 返回视图布局约束是否影响指定视图，主要用于调试约束布局，结合exerciseAmbiguityInLayout。
- (BOOL)hasAmbiguousLayout;
// 随机改变不同效值布局视图，主要用于调试基于约束布局的视图
- (void)exerciseAmbiguityInLayout; 

{% endhighlight %}

# 状态恢复(iOS 6.0)

{% highlight ruby %}

// 标志是否支持保存，恢复视图状态信息
@property (nonatomic, copy) NSString *restorationIdentifier;
// 保存视图状态相关信息
- (void) encodeRestorableStateWithCoder:(NSCoder *)coder;
// 恢复和保存视图相关信息
- (void) decodeRestorableStateWithCoder:(NSCoder *)coder; 

{% endhighlight %}

# 快照 （iOS7.0）

{% highlight ruby %}

我们有时候可能需要取UIView对象的快照，有几个原因，您可能希望从动画性能改进上去分享您的应用程序的屏幕截图。现有的方法面临几个问题：
1代码不简单
2复杂的渲染选项，比如层面罩的难再生
3OpenGL层需要特殊的事例代码
4快照处理十分慢
事实上,真的没有任何通用的“快照”代码可以应付所有可能的场景。 但是IOS7将会改变，UIView和UIScreen会有一些新的方法，为各种用例提供简单的快照功能。
动画快照 我们可能经常想对一个视图进行动画处理，但是视图的动画太复杂，要么是动画太密集，要么就是需要额外的代码来控制正确的行为。 例如附带的项目，我们创建一个UIView的子类，它只是简单的添加一些子视图，并旋转来生成一个有趣的几何排列。
// 调用snapshotViewAfterScreenUpdates：方法去创建复杂视图的快照。方法返回一个UIView，来呈现被调用的视图的界面。用这个方法去获取视图快照非常有效，比制作位图要快的多。 当获得视图快照后，我们把它添加到容器视图上，并移除实际的复杂视图。然后可以动画处理快照视图了：
- (UIView *)snapshotViewAfterScreenUpdates:(BOOL)afterUpdates;

- (UIView *)resizableSnapshotViewFromRect:(CGRect)rect afterScreenUpdates:(BOOL)afterUpdates withCapInsets:(UIEdgeInsets)capInsets;
- (BOOL)drawViewHierarchyInRect:(CGRect)rect afterScreenUpdates:(BOOL)afterUpdates;

{% endhighlight %}



