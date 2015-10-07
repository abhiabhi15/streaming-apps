rm(list=ls())
#source("installDependencies.R")
library("devtools")
library(ff)
library(rJava)
#library(caret)
#install_github("jwijffels/RMOA", subdir="RMOAjars/pkg")
#install_github("jwijffels/RMOA", subdir="RMOA/pkg")
library(RMOA)
source("helper.R")
source("preprocess.R")

### Get Tweets 
tweets <- getTweets(filename="tweets1.json",timeout=5)

### Test and Train Sampling from Processed Tweets
sample_index <- sample(1:nrow(tweets), round(0.7 * nrow(tweets)))
train_set <- tweets[sample_index,]
test_set <- tweets[-sample_index,]


train_tweets <- getTDM(tweetDf=train_set, counts=200, wordFreq=2)
train_tweets <- getLabel(train_tweets)
print(dim(train_tweets))

## Classifiers
hdt <- HoeffdingTree(splitConfidence="1e-3")
ohdt <- OzaBoost(baseLearner = "trees.HoeffdingTree", ensembleSize = 30)
ctrl <- MOAoptions(model = "NaiveBayesMultinomial")
nb <- NaiveBayesMultinomial(control=ctrl)

### Model Training

train_stream <- datastream_dataframe(data=train_tweets)
model <- trainMOA(model=nb, formula=label ~ ., data=train_stream, reset=FALSE)
modelTerms <- names(attr(model$terms,"dataClasses"))[-1]

## TODO: Now these modelTerms can be used as features for test Data
test_data_frame = getTestTDM(tweetDf=test_set, modelTerms)

pred <- predict(model, newdata=test_data_frame, type="response")

## Validation
#gtruth <- test_set[,ncol(test_set)]
#print(table(pred, gtruth))
#cat("-----------\n")
#accuracy(test_set, pred)


##############################################################################
