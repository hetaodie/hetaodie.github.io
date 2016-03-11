---
layout: post
title: NSOperation详解
description: 本文详细讲解了NSOperation的常用的Api，子类的用法
categories: [iOS]
tags: [iOS, NSOperation]

---

**目录**

* 目录
 {:toc  }
 
# Operation 对象

在 iOS 开发中，我们可以使用 NSOperation 类来封装需要执行的任务，而一个 operation 对象（以下正文简称 operation ）指的就是 NSOperation 类的一个具体实例。NSOperation 本身是一个抽象类，不能直接实例化，因此，如果我们想要使用它来执行具体任务的话，就必须创建自己的子类或者使用系统预定义的两个子类，NSInvocationOperation 和 NSBlockOperation 。<b />

NSInvocationOperation ：我们可以通过一个 object 和 selector 非常方便地创建一个 NSInvocationOperation ，这是一种非常动态和灵活的方式。假设我们已经有了一个现成的方法，这个方法中的代码正好就是我们需要执行的任务，那么我们就可以在不修改任何现有代码的情况下，通过方法所在的对象和这个现有方法直接创建一个 NSInvocationOperation 。<b />

NSBlockOperation ：我们可以使用 NSBlockOperation 来并发执行一个或多个 block ，只有当一个 NSBlockOperation 所关联的所有 block 都执行完毕时，这个 NSBlockOperation 才算执行完成，有点类似于 dispatch_group 的概念。<b />

另外，所有的 operation 都支持以下特性：

- 支持在 operation 之间建立依赖关系，只有当一个 operation 所依赖的所有 operation 都执行完成时，这个 operation 才能开始执行；
- 支持一个可选的 completion block ，这个 block 将会在 operation 的主任务执行完成时被调用；
- 支持通过 KVO 来观察 operation 执行状态的变化；
- 支持设置执行的优先级，从而影响 operation 之间的相对执行顺序；
- 支持取消操作，可以允许我们停止正在执行的 operation 。

<b />
 

# NSOperation常用的Api


1. - (void)start; //在当前任务状态和依赖关系合适的情况下，启动NSOperation的main方法任务，需要注意缺省实现只是在当前线程运行。如果需要并发执行，子类必须重写这个方法，并且是在 - (BOOL)isConcurrent 方法返回YES的情况下进行的。
2. - (void)main; //定义NSOperation的主要任务代码。
3. - (BOOL)isCancelled; //当前任务状态是否已标记为取消
4. - (void)cancel; //取消当前NSOperation任务，实质是标记isCancelled状态
5. - (BOOL)isExecuting; //NSOperation任务是否在运行
6. - (BOOL)isFinished; //NSOperation任务是否已结束
7. - (void)addDependency:(NSOperation *)op; //加上任务的依赖，也就是说依赖的任务都完成后，才能执行当前任务
8. - (void)removeDependency:(NSOperation *)op; //取消任务的依赖，依赖的任务关系不会自动消除，必须调用该方法
9. - (NSArray *)dependencies; //得到所有依赖的NSOperation任务
10. - (BOOL)isReady; //是否能准备运行，这个值和任务的依赖关系相关
11. - (void)waitUntilFinished; //阻塞当前线程，直到该NSOperation结束。可用于线程执行顺序的同步
12. - (void)setCompletionBlock:(void (^)(void))block; //设置NSOperation结束后运行的block代码，由于NSOperation有可能被取消，所以这个block运行的代码应该和NSOperation的核心任务无关。


# NSOperationQueue的常用方法

1. - (void)addOperations:(NSArray *)ops waitUntilFinished:(BOOL)wait; //批量加入执行operation，wait标志是否当前线程等待所有operation结束后，才返回
2. - (void)addOperationWithBlock:(void (^)(void))block; //相当于加入一个NSBlockOperation执行任务
3. - (NSArray *)operations; //返回已加入执行operation的数组，当某个operation结束后会自动从这个数组清除
4. - (NSUInteger)operationCount //返回已加入执行operation的数目
5. - (void)setSuspended:(BOOL)b; //是否暂停将要执行的operation，但不会暂停已开始的operation
6. - (BOOL)isSuspended; //返回暂停标志
7. - (void)cancelAllOperations; //取消所有operation的执行，实质是调用各个operation的cancel方法
8. + (id)currentQueue; //返回当前NSOperationQueue，如果当前线程不是在NSOperationQueue上运行则返回nil
9. + (id)mainQueue; //返回主线程的NSOperationQueue，缺省总是有一个queue


# 执行Operation对象

主要有两种方式来执行一个 operation ：

- 将 operation 添加到一个 operation queue 中，让 operation queue 来帮我们自动执行；
- 直接调用 start 方法手动执行 operation 。

## 添加 Operation 到 Operation Queue 中

就目前来说，将 `operation` 添加到 `operation queue` 中是最简单的执行 `operation` 的方式。另外，这里的 `operation queue` 指的就是 `NSOperationQueue` 类的一个具体实例。就技术上而言，我们可以在应用中创建任意数量的 `operation queue` ，但是 `operation queue` 的数量越多并不意味着我们就能同时执行越多的 `operation` 。因为同时并发的 `operation` 数量是由系统决定的，系统会根据当前可用的核心数以及负载情况动态地调整最大的并发 `operation` 数量。创建一个 `operation queue` 非常简单，跟创建其他普通对象没有任何区别：


{% highlight ruby %}

NSOperationQueue *operationQueue = [[NSOperationQueue alloc] init];

{% endhighlight %}

创建好 operation queue 后，我们可以使用下面三个方法添加 `operation` 到 `operation queue` 中：

- `addOperation:` ，添加一个 operation 到 operation queue 中；
- `addOperations:waitUntilFinished:` ，添加一组 `operation` 到 `operation queue `中；
- `addOperationWithBlock:` ，直接添加一个 `block` 到 `operation queue` 中，而不用创建一个 `NSBlockOperation` 对象。


在大多数情况下，一个 `operation` 被添加到 `operation queue` 后不久就会执行，但是也有很多原因会使 `operation queue` 延迟执行入队的 `operation` 。比如，我们前面提到了的，如果一个 operation 所依赖的其他 operation 还没有执行完成时，这个 `operation` 就不能开始执行；再比如说 `operation queue` 被暂停执行或者已经达到了它最大可并发的 `operation` 数。

注意，在将一个 operation 添加到 operation queue 后就不要再修改这个 operation 了。因为 operation 被添加到 operation queue 后随时可能会执行，这个是由系统决定的，所以再修改它的依赖关系或者所包含的数据就很有可能会造成未知的影响。

尽管 `NSOperationQueue` 类是被设计成用来并发执行 `operation` 的，但是我们也可以强制一个 `operation queue` 一次只执行一个 `operation` 。我们可以通过 `setMaxConcurrentoperationCount:` 方法来设置一个 `operation queue` 最大可并发的 `operation` 数，因此将这个值设置成 1 就可以实现让 `operation queue` 一次只执行一个 `operation` 的目的。但是需要注意的是，虽然这样可以让 `operation queue` 一次只执行一个 `operation` ，但是 `operation` 的执行顺序还是一样会受其他因素影响的，比如 `operation` 的 `isReady` 状态、`operation` 的队列优先级等。因此，一个串行的 `operation queue` 与一个串行的 `dispatch queue` 还是有本质区别的，因为 `dispatch queue` 的执行顺序一直是 FIFO 的。如果 `operation` 的执行顺序对我们来说非常重要，那么我们就应该在将 `operation `添加到 `operation queue` 之前就建立好它的依赖关系。

## 手动执行 Operation

尽管使用 `operation queue` 是执行一个 `operation` 最方便的方式，但是我们也可以不用 `operation queue` 而选择手动地执行一个 `operation` 。从原理上来说，手动执行一个 `operation` 也是非常简单的，只需要调用它的 `start` 方法就可以了。但是从严格意义上来说，在调用 `start` 方法真正开始执行一个 `operation` 前，我们应该要做一些防范性的判断，比如检查 `operation` 的 `isReady` 状态是否为 `YES` ，这个取决于它所依赖的 `operation` 是否已经执行完成；又比如检查 `operation` 的 `isCancelled` 状态是否为 `YES` ，如果是，那么我们就根本不需要再花费不必要的开销去启动它。

另外，我们应该一直通过 `start` 方法去手动执行一个 `operation` ，而不是 `main` 或其他的什么方法。因为默认的 `start` 方法会在真正开始执行任务前为我们做一些安全性的检查，比如检查 `operation` 是否已取消等。另外，正如我们前面说的，在默认的 `start` 方法中会生成一些必要的 `KVO` 通知，比如 `isExcuting` 和 `isFinished` ，而这些 `KVO` 通知正是 `operation` 能够正确处理好依赖关系的关键所在。

更进一步说，如果我们需要实现的是一个并发的 `operation` ，我们也应该在启动 `operation` 前检查一下它的 `isConcurrent` 状态。如果它的 `isConcurrent` 状态为 `NO` ，那么我们就需要考虑一下是否可以在当前线程同步执行这个 `operation` ，或者是先为这个 `operation` 创建一个单独的线程，以供它异步执行。

当然，如果你已经能够确定一个 `operation` 的可执行状态，那么你大可不必做这些略显啰嗦的防范性检查，直接调用 `start` 方法执行这个 `operation` 即可.

# 取消 Operation

从原则上来说，一旦一个 `operation` 被添加到 `operation queue` 后，这个 `operation` 的所有权就属于这个 `operation queue` 了，并且不能够被移除。唯一从 `operation queue` 中出队一个 `operation` 的方式就是调用它的 `cancel` 方法取消这个 `operation` ，或者直接调用 `operation queue` 的 `cancelAllOperations` 方法取消这个 `operation queue` 中所有的 `operation` 。另外，我们前面也提到了，当一个 `operation` 被取消后，这个 `operation` 的 `isFinished` 状态也会变成 `YES` ，这样处理的好处就是所有依赖它的 `operation` 能够接收到这个 `KVO` 通知，从而能够清除这个依赖关系正常执行。

# 等待 Operation 执行完成

一般来说，为了让我们的应用拥有最佳的性能，我们应该尽可能地异步执行所有的 operation ，从而让我们的应用在执行这些异步 operation 的同时还能够快速地响应用户事件。当然，我们也可以调用 NSOperation 类的 `waitUntilFinished` 方法来阻塞当前线程，直到这个 operation 执行完成。虽然这种方式可以让我们非常方便地处理 operation 的执行结果，但是却给我们的应用引入了更多的串行，限制了应用的并发性，从而降低了我们应用的响应性。

注意，我们应该要坚决避免在主线程中去同步等待一个 operation 的执行结果，阻塞的方式只应该用在辅助线程或其他 operation 中。因为阻塞主线程会大大地降低我们应用的响应性，带来非常差的用户体验。

除了等待一个单独的 operation 执行完成外，我们也可以通过调用 NSOperationQueue 的 `waitUntilAlloperationsAreFinished` 方法来等待 operation queue 中的所有 operation 执行完成。有一点需要特别注意的是，当我们在等待一个 operation queue 中的所有 operation 执行完成时，其他的线程仍然可以向这个 operation queue 中添加 operation ，从而延长我们的等待时间。

# 暂停和恢复 Operation Queue

如果我们想要暂停和恢复执行 operation queue 中的 operation ，可以通过调用 operation queue 的 `setSuspended:` 方法来实现这个目的。不过需要注意的是，暂停执行 operation queue 并不能使正在执行的 operation 暂停执行，而只是简单地暂停调度新的 operation 。另外，我们并不能单独地暂停执行一个 operation ，除非直接 `cancel` 掉。

