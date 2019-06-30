import pandas
import numpy

# Read the data
data = pandas.read_csv('data.csv')

# Split the data into X and y
X = numpy.array(data[['x1', 'x2']])
y = numpy.array(data['y'])

# import statements for the classification algorithms
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC

# TODO: Pick an algorithm from the list:
# - Logistic Regression
# - Decision Trees
# - Support Vector Machines
# Define a classifier (bonus: Specify some parameters!)
# and use it to fit the data, make sure you name the variable as "classifier"
# Click on `Test Run` to see how your algorithm fit the data!
