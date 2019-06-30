# The kernel that works best here is rbf, with large values of gamma.
# For example, this one:

classifier = SVC(kernel = 'rbf', gamma = 200)
