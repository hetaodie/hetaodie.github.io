---
layout: post
title: UIMenuController详解
description: 详细讲解了UIMenuControllor的使用流程及各个函数的意义，并配置了一个小demo。

tagline: original post at hetaodie.github.io
categories: [iOS]
tags: [iOS, UIMenuController]
---
**目录**

* 目录
 {:toc  }

# 使用UIMenuController的步骤

1. Menu所处的View必须实现 – (BOOL)canBecomeFirstResponder, 且返回YES

2. Menu所处的View必须实现 – (BOOL)canPerformAction:withSender, 并根据需求返回YES或NO

3. 使Menu所处的View成为First Responder (becomeFirstResponder)

4. 定位Menu (- setTargetRect:inView:)

5. 展示Menu (- setMenuVisible:animated:)


# 代码及注释说明

下面是我使用UIMenuController制定的长按tableViewcell后出现menu并自定义“复制” “删除” “粘贴” 三个功能

{% highlight ruby %}

#import "TestTableViewCell.h"

@implementation TestTableViewCell

- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}


/*!
 *  是此cell成为可以第一相应着，确保菜单可以弹出来
 *
 *  @return 此处必须返回yes
 */
- (BOOL)canBecomeFirstResponder{
    return YES;
}


/**
 *  这个函数用来控制
 *
 *  @param action 返回所有的menu能相应的方法（包括自定义的和系统自己的）
 *  @param sender
 *
 *  @return 使想要显示的方法返回yes，不需要相应的方法返回no
 */
-(BOOL)canPerformAction:(SEL)action withSender:(id)sender{
    if (action == @selector(handleCopyCell:) || action == @selector(handleDeleteCell:) || action == @selector(handlePasteCell:) ) {
        return YES;
    }
    return NO;
}

/**
 *  此为长按手势调用的函数
 *
 *  @param recognizer 传入的相应手势
 */
- (void)cellLongPress:(UIGestureRecognizer *)recognizer{
    if (recognizer.state == UIGestureRecognizerStateBegan) {
        [self becomeFirstResponder];
        
        UIMenuItem *itCopy   = [[UIMenuItem alloc] initWithTitle:@"复制" action:@selector(handleCopyCell:)];
        UIMenuItem *itDelete = [[UIMenuItem alloc] initWithTitle:@"删除" action:@selector(handleDeleteCell:)];
        UIMenuItem *itPaste  = [[UIMenuItem alloc] initWithTitle:@"粘贴" action:@selector(handlePasteCell:)];
        
        UIMenuController *menu = [UIMenuController sharedMenuController];
        [menu setMenuItems:[NSArray arrayWithObjects:itCopy, itDelete,itPaste,  nil]];
        [menu setTargetRect:self.frame inView:self.superview];
        [menu setMenuVisible:YES animated:YES];
        
    }
}


/**
 *  自定义的三个函数
 *
 *  @param sender <#sender description#>
 */
- (void)handleCopyCell:(id)sender{//复制cell
    NSLog(@"handle copy cell");
}

- (void)handleDeleteCell:(id)sender{//删除cell
    NSLog(@"handle delete cell");
}

- (void)handlePasteCell:(id)sender{//删除cell
    NSLog(@"handle Paste cell");
}


@end


{% endhighlight %}

点击去github下载[UIMenuControllerDemo][1]


# 默认提供的选择项对应的selector

- cut: 剪切选中文字到剪贴版。
- copy: 拷贝/复制选中文字到剪贴版。
- select: 当处于文本编辑模式时，选中光标当前位置的一个单词。
- selectAll: 选中当前页所有文字。
- paste: 粘贴剪贴版中的文本到当前光标位置。
- delete: 处于文本编辑模式时，删除选中的文本。（since iOS 3.2）
- _promptForReplace: 即为上面Google+图片中显示的“替换为...”菜单，点击之后会给出与当前选中单词相近的其他单词。
- _showTextStyleOptions: 处于文本编辑模式时，用于编辑字体风格属性，如粗体/斜体等。
- _define: 调用iOS系统内置的英语词典，解释选中的单词。如果内置词典中找不到所选单词，则该项不予显示。
- _accessibilitySpeak: 朗读当前选中的文本。
- _accessibilityPauseSpeak: 暂停朗读文本。
- makeTextWritingDirectionRightToLeft: 调整选中文本的书写格式为从右至左。阿拉伯语会用到。（since iOS 5.0）
- makeTextWritingDirectionLeftToRight: 调整选中文本的书写格式为从左至右。


<!--本文所用的超链接-->

[1]:https://github.com/hetaodie/AVPlayerDemo