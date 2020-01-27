## 内容：监督式学习
## 项目：为 *CharityML* 寻找捐赠者

## 项目概述
在此项目中，你将运用监督式学习技巧对美国人口普查数据进行分析，帮助 CharityML（一家虚拟的慈善机构）发现最有可能向他们捐款的人士。你首先将探索这些人口普查数据，了解数据的记录结构。接着，你将应用一系列的转换和预处理技巧操纵数据，使其变成可处理的格式。然后，你将自己选择几个监督式学习器并将它们应用到数据上，看看哪个学习器最能满足需求。之后，你将优化所选的模型并当做解决方案呈现给 CharityML。最后，你将探索所选的模型和背后的预测原理，看看它在处理给定的数据时，效果如何。

## 项目要点
此项目旨在帮助你熟悉 sklearn 中提供的很多监督式学习算法，并且能够评估每个模型在某种类型的数据上的效果。在机器学习领域，务必要明白应该何时在什么场合使用特定的算法，以及何时避免使用某个算法。

完成此项目后，你将学会以下技能：

- 如何判断何时需要预处理数据，以及如何进行预处理。
- 如何为问题的解决方案建立基准。
- 对于给定的数据集，每种监督式学习算法会取得什么样的结果。
- 如何确定候选解决方案模型算法是否足以解决问题。


## 软件要求

此项目使用以下软件和 Python 库：

- [Python 2.7](https://www.python.org/download/releases/2.7/)
- [NumPy](http://www.numpy.org/)
- [Pandas](http://pandas.pydata.org/)
- [scikit-learn](http://scikit-learn.org/stable/)
- [matplotlib](http://matplotlib.org/)

你还需要安装软件，才能运行并执行 [Jupyter Notebook](http://ipython.org/notebook.html)。

如果你尚未安装 Python，强烈建议你安装 Python  的 [Anaconda](http://continuum.io/downloads) 分发系统，该系统已经包含上述软件包，并且包含更多其他软件包。请确保你选择的是 Python 2.7 安装包，而不是 Python 3.x 安装包。

## 开始项目

对于此任务，你可以在[机器学习项目 GitHub](https://github.com/udacity/machine-learning) 上的 `projects` 文件夹下找到其中包含必要项目文件的 `finding_donors` 文件夹。你可以从此代码库中下载我们将在此纳米学位课程中用到的所有项目文件。请确保在完成项目时，使用最新版项目文件！

此项目包含三个文件：
 
- `finding_donors.ipynb`：这是主要文件，你将在此文件中执行项目任务。
- `census.csv`：项目数据集。你将在 notebook 中加载此数据。
- `visuals.py`：此 Python 脚本提供了项目的补充可视化内容。请勿修改此文件。
 
在终端或命令行提示符窗口中，转到包含项目文件的文件夹，然后使用命令 `jupyter notebook finding_donors.ipynb` 打开浏览器窗口或标签页来处理你的 notebook。此外，你可以使用命令 `jupyter notebook` 或 `ipython notebook` 在打开的浏览器窗口中转到该 notebook 文件。按照 notebook 中的说明操作，并回答其中的每个问题，这样才能成功完成项目。除了项目文件外，我们还提供了 **README** 文件，其中可能包含关于项目的其他必要信息或说明。
 

## 提交项目
 
### 评估
优达学城的审阅专家将根据**<a href="https://review.udacity.com/#!/rubrics/868/view" target="_blank">为 CharityML 寻找捐助者的项目审阅标准</a>** 来审阅你的项目。在提交项目之前，确保仔细阅读该审阅标准并对项目进行自我评估。必须满足该审阅标准中的所有*规范条件*，才能通过审阅。
 
### 提交文件
准备好提交项目后，收集以下文件并将它们压缩成一个文件以准备上传。此外，你可以在 GitHub Repo 上叫做 `finding_donors` 的文件夹中提供以下文件，以便我们能轻松访问你的文件：

 - `finding_donors.ipynb` notebook 文件，回答了所有问题，执行了所有代码单元格并显示输出。
 - 项目 notebook 的 **HTML** 导出文件，名称为 **report.html**。在提交项目以供评估时，*必须*包含此文件。
 
**你可以使用工作区（在下一部分）直接提交项目以供审阅。在处理完 Jupyter  notebook 后，记得向工作区上传 HTML 报告，然后再提交报告。**
 
收集好这些文件并阅读项目审阅标准完毕后，请转到项目提交页面。


### 我准备好了！
当你准备好提交项目时，请点击页面底部的**提交项目**按钮。

如果你在提交项目时遇到任何问题，或是想确认你的提交状态，请发邮件到 **machine-support@udacity.com** 或访问 <a href="http://discussions.udacity.com" target="_blank">discussion forums</a>。

### 接下来会发生什么？
审阅专家会将反馈信息发送到你的电子邮箱。同时，当你准备好，你可以随时开始学习下一节课。
