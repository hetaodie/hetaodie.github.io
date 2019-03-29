---
layout: post
title: Python笔记（1）--NumPy
description: 记录下python 中 numpy的基本语法

tagline: original post at hetaodie.github.io
categories: [Python]
tags: [Python]
image0: /assets/media/python/python0.png
image1: /assets/media/python/python1.png
---

**目录**
* 目录
 {:toc  }
# 基本概念

1. NumPy中定义的最重要的对象是称为ndarray的N纬数组类型，它描述形同类型的元素集合。可以使用基于零的索引访问集合中的项目。

2. ndarray中的每个元素在内存中使用相同大小的块。ndarray中的每个元素是数据类型对象的对象（称为'dtype'）

3. ndarray的构造结构

   ```python
   numpy.array(object, dtype = None, copy = True, order = None, subok = False, ndmin = 0)
   # 说明：
   #object：数组或是任何(嵌套)序列
   #dtype:数组的所需数据类型
   #copy:可选，默认为true,对象是否被复制
   #order:C(按行),F(按列)或A(任意，默认)
   #subok:默认情况下，返回的数组被强制为基类数组。如果为ture,则范围子类。
   #ndimin:指定返回数组的最小维数
   ```



# 数据类型对象（dtype）

​	数据类型对象描述了对应于数组的固定内存块的解释，取决于以下方面：

- 数据类型（基本数据类型，或者python对象）
- 数据大小
- 字节序
- 在结构化类型的情况下，字段的名称，每个字段的数据类型和每个字段占用的内存块的部分
- 如果数据类型是子序列，它的形状和数据类型

**说明：字节的顺序取决于数据类型的前缀 < 或> 。 <意味着编码是小端；>意味着编码是大端**

```python
numpy.dtype(object, align, copy)
#参数说明：
#object：被转换的数据类型的对象
#Align:如果为True,则向字段添加间隔，使其类似C的结构体
#Copy:生成dtype对象的新副本，如果为False，结果是内建数据类型对象的引用

例如：创建机构化的数据类型
dt = np.dtype(['age', np.int8])
pring dt

[(age, 'i1')]
```



# 内建类型的字符代码

- ’b‘:布尔值
- 'i':有符号整数
- 'u':五符号整数
- 'f':浮点
- 'c':复数浮点
- 'm':时间间隔
- 'M':日期时间
- 'O':Python对象
- 'S','a':字节串
- 'U':Unicode
- 'V':原始数据（void）



# 数组属性



## ndarray.shape

返回一个包含数组维度的元组，

```Python
import numpy as np
a= np.array([[1,2,3],[4,5,6]])
print a.shape

输出：(2，3)
```

它可以用于调整数组的大小：

```python
import numpy as np
a= np.array([[1,2,3],[4,5,6]])
a.shape = (3,2)
print a

输出：[[1 2]
 [3 4]
 [5 6]]
```



```
import numpy as np
a= np.array([[1,2,3],[4,5,6]])
b = a.reshape(3,2)

print b

输出：
[[1 2]
 [3 4]
 [5 6]]
```

##numpy.itemsize返回数组中每个元素的字节单元长度

```python
#数组的dtype为int8(一个字节)
x = np.array([1, 2, 3],dtype=np.int8)
print x.itemsize
输出：1
```



# 数组创建例程

## numpy.empty:它创建指定形状和dtype的未初始化数组，以随机数值填充新数组

```python
numpy.empty(shape, dtype = float, order = 'C')
说明：
1、shape：空数组的形状，整数或整数元组
2、dtype：所需的输出数组类型
3、order：'C'为按行的C风格数组，'F'为按列的Fortran风格数组

```

​			

## numpy.zeros:返回特定大小，以0填充新数组

```python
numpy.empty(shape, dtype = float, order = 'C')


```

​		

## numpy.ones：返回特定大小，以1填充的新数组

```python
numpy.ones(shape, dtype = float, order = 'C')
```



```html
<iframe src="http://nbviewer.jupyter.org/github/LiaoPan/MyCodeSpace/blob/master/Demo_juypter.ipynb" width="850" height="500"></iframe>
```

