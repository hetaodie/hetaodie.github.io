# 机器学习工程师纳米学位
# 监督式学习
## 项目：为 *CharityML* 寻找捐赠者

### 安装

本项目要求安装 **Python 2.7** 和以下 Python 库：

- [NumPy](http://www.numpy.org/)
- [Pandas](http://pandas.pydata.org)
- [matplotlib](http://matplotlib.org/)
- [scikit-learn](http://scikit-learn.org/stable/)

你还需要安装软件，才能运行并执行 [Jupyter Notebook](http://ipython.org/notebook.html)。
 
我们建议学员安装 Python  的 [Anaconda](http://continuum.io/downloads) 分发系统，该系统已经包含上述软件包，并且包含项目所需的其他软件包。


### 代码

你可以在 notebook 文件 `finding_donors.ipynb` 中找到代码模板。你还将被要求使用 Python 文件 `visuals.py` 和数据集文件 `census.csv` 来完成你的任务。我们已经提供了一些初始代码来帮助你开始，你需要补充额外函数来顺利完成本项目。请注意，学员无需更改 `visuals.py` 中的代码。如果你对 notebook 中的可视化文件感兴趣，请随意探索。

### 运行

在终端或命令行窗口中，跳转至最上面的项目目录 `finding_donors/`（包含 README 文件），并运行如下命令：

```bash
ipython notebook finding_donors.ipynb
```  
或者
```bash
jupyter notebook finding_donors.ipynb
```

这将在你的浏览器中打开 iPython Notebook 软件和项目文件。browser.

### 数据

修改后的人口普查数据集包含近 32000 个数据点，每个数据点有 13 个特征。该数据集是 Ron Kohavi 发表的论文*“放大朴素贝叶斯分类器的准确性：决策树混合（Scaling Up the Accuracy of Naive-Bayes Classifiers: a Decision-Tree Hybrid）"*中数据集的修改版。你也可以在[网上](https://www.aaai.org/Papers/KDD/1996/KDD96-033.pdf)找到这篇论文，在 [UCI](https://archive.ics.uci.edu/ml/datasets/Census+Income) 中有原始数据。

**特征**

- `age`: 年龄
- `workclass`: 劳动阶级(Private, Self-emp-not-inc, Self-emp-inc, Federal-gov, Local-gov, State-gov, Without-pay, Never-worked)
- `education_level`: 教育情况(Bachelors, Some-college, 11th, HS-grad, Prof-school, Assoc-acdm, Assoc-voc, 9th, 7th-8th, 12th, Masters, 1st-4th, 10th, Doctorate, 5th-6th, Preschool)
- `education-num`: 受教育年限
- `marital-status`: 婚姻状况(Married-civ-spouse, Divorced, Never-married, Separated, Widowed, Married-spouse-absent, Married-AF-spouse)
- `occupation`: 职业情况(Tech-support, Craft-repair, Other-service, Sales, Exec-managerial, Prof-specialty, Handlers-cleaners, Machine-op-inspct, Adm-clerical, Farming-fishing, Transport-moving, Priv-house-serv, Protective-serv, Armed-Forces)
- `relationship`: 亲属情况(Wife, Own-child, Husband, Not-in-family, Other-relative, Unmarried)
- `race`: 种族(White, Asian-Pac-Islander, Amer-Indian-Eskimo, Other, Black)
- `sex`: 性别(Female, Male)
- `capital-gain`: 资本盈利
- `capital-loss`: 资本损失
- `hours-per-week`: 每周工作小时
- `native-country`: 国籍(United-States, Cambodia, England, Puerto-Rico, Canada, Germany, Outlying-US(Guam-USVI-etc), India, Japan, Greece, South, China, Cuba, Iran, Honduras, Philippines, Italy, Poland, Jamaica, Vietnam, Mexico, Portugal, Ireland, France, Dominican-Republic, Laos, Ecuador, Taiwan, Haiti, Columbia, Hungary, Guatemala, Nicaragua, Scotland, Thailand, Yugoslavia, El-Salvador, Trinadad&Tobago, Peru, Hong, Holand-Netherlands)

**目标变量**
- `income`: 收入等级 (<=50K, >50K)
