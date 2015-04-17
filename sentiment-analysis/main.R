rm(list=ls())
#source("installDependencies.R")
library("devtools")
library(ff)
library(rJava)
#install_github("jwijffels/RMOA", subdir="RMOAjars/pkg")
#install_github("jwijffels/RMOA", subdir="RMOA/pkg")
library(RMOA)
source("helper.R")
source("preprocess.R")
source("rmongo.R")

##############################################################################
## For Streaming
## Pipeline
## GetMongoTweets | Divide into train and test Stream | Pre-process Train Stream |
## Train Model | Get Model Terms | Pre-process Test Stream | Apply Model | Validate Results
demo <- function(){
    cat("======== CSC 591/791 DEMO: \n P3: SENTIMENT ANALYSIS OF CRICKET WORLD CUP 2015 IND VS AUSTRALIA SEMIFINAL========\n\n\n")
    Sys.sleep(0.5)
    cat(" TEAM MEMBERS:\n Abhishek Agrawal\n Nisarg Gandhi\n Rohit Arora\n Nirmesh Khandelwal\n Krishna Karthik Gadiraju\n\n")
    Sys.sleep(0.5)
    cat(" ======== NOTE: Before running demo, please follow steps in ReadMe.md========\n\n")
    Sys.sleep(0.5)
    cat("======== Beginning Execution: ========\n")
    execute(1000)
}


execute <- function( totalTweets = getTotalTweetsCount()){
    
    ctrl <- MOAoptions(model = "NaiveBayesMultinomial")
    nb <- NaiveBayesMultinomial(control=ctrl)
    
    ## Initial Model Building
    init_count = 1000
    cat(" Reading tweets.. \n")
    tweets <- getMongoTweets(count=init_count)
    
    ## Pre-process
    cat(" Beginning pre-processing:\n 1. Creating Corpus \n 2. Removing punctuations twitter handles \n 3. Removing URLs \n 4. Removing small words (Length<3) \n 5. Removing stop words (in stop-word.txt)\n 6. Converting to lower case\n 7. Strip White Space \n 8. Stemming\n\n ")
    train_tweets_text <- tweets$text
    train_tweets_text <- preprocess(train_tweets_text)
    
    cat('Building TDM\n\n')
    train_tweets <- getTDM(tweetDf=train_tweets_text, wordFreq=2)
    
    cat("Getting Emotion Labels\n\n")
    train_tweet_emo <- getEmotionLabel(train_tweets_text)
    
    ## Adding ground truth label
    train_tweets['label'] = as.factor(train_tweet_emo)
    
    ## Model Training
    cat("Training Initial Model : Tweets Counts = ", init_count, "\n\n")
    train_stream <- datastream_dataframe(data=train_tweets)
    
    model <- trainMOA(model=nb, formula=label ~ ., data=train_stream, reset=FALSE, trace=T)
    cat("Trained Initial Model : Tweets Counts = ", init_count, "\n\n")
    ########################################################################################
    
    # Testing and updation of model
    cat('Beginning testing and updating model\n\n')
        
    batchSize <- totalTweets
    cat('Getting ', batchSize , 'tweets\n\n')
    tweets <- getMongoTweets(batchSize)
        
    cat('Pre-processing ...\n\n')
    ## Pre-process
    tweets_text <- tweets$text
    tweets_text <- preprocess(tweets_text)
    modelTerms <- names(attr(model$terms,"dataClasses"))[-1]
    tweets <- getTestTDM(tweets_text, modelTerms)
    cat('Getting emotion value...\n\n')
    tweet_emo <- getEmotionLabel(tweets_text)
    
    ## Adding ground truth label
    tweets["label"] <- as.factor(tweet_emo)
    batchGtruth <-  as.factor(tweet_emo)
    
    ## Creating Data Stream
    tweet_stream <- datastream_dataframe(data=tweets)
    batchPred <- c()
    cat('Beginning Updating model dynamically for every new tweet...\n\n')
    s <- 10      
    cat("Processing tweets in chunk size ", s , " \n")
    for(i in 1:batchSize){
        
        tweet <- tweet_stream$get_points(s)
        cat("\n ==================== NEW TWEET ====================\n")
        cat("\n [INFO] Tweet Counter :  " , (s*i) , "\n")
        
        ## Prediction
        pred <- predict(model, newdata=tweet, type="response")
        
        #cat(" Prediction = " , pred, " \n Ground Truth = ", as.character(batchGtruth[1:s]) , "\n")
        batchPred <- append(batchPred, pred) 
        cat("\n ---- Contingency Matrix ------- \n")
        print(table(batchPred, as.character(batchGtruth[1:(s*i)])))
        accuracy(batchPred, as.character(batchGtruth[1:(s*i)]))
        bubblePlot(batchPred)
        
        cat("\n [INFO] .... Updating model ....\n")
        model <- trainMOA(model=model$model, formula=label ~ ., data=datastream_dataframe(tweet), reset=F)
        i <- i+s
    }
    cat('Closing MongoDB connection...\n\n')
    mongoDestroy()
}

############# Main Executions ###################
#execute(totalTweets= 1000)
demo()