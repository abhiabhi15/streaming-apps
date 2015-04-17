## P3 : Real-time Twitter Sentiment Analysis of Cricket World Cup 2015 Event
---
#####Software : `Java-7, R-3.1.0, `
#####OS : `Ubuntu 12.04 (Linux 3.2.0-58-generic)`
##### Team : `Abhishek Agrawal(akagrawa), Karthik Krishna Gadiraju(kgadira), Nirmesh Khandelwal(nbkhande), Nisarg Gandhi(ndgandh2), Rohit Arora( rarora4)`
 ---
### Installation Guide 

Install software packages:  
(a) Download [**MongoDB**](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/) from the MongoDB web-site  
(b) Download and install [**Java 7**](http://java.com/en/download/).  

**Note:** Please skip the above installations, if already installed.  

## Environment Variables
```
$JAVA_HOME = /YOUR JAVA HOME PATH/
$R_LIB= /YOUR R LIB PATH/
```
Copy the above $JAVA_HOME path in your .bashrc file.
And run command:
```
    source .bashrc
```
**Note:** Skip the above command in JAVA-7 is already installed and configured.
## Execution Commands
**[1]** Unpackage p3.zip file and locate cwctweets.json file as the tweet data and start mongodb.
```
    sudo service mongod start
```
**[2]** Copy absolute path to data/cwctweets.json file in your machine and paste it in the following line: 
```
    mongoimport --db twitterstream --collection cwctweets --file data/cwctweets.json
    
```
Mongodb will be installed and started Tweets are being stored in mongodb under the database named 'twitterstream' and in a collection named 'cwctweets'.  

**[3]** For adding more stop words[1], we can configure it in stop-word.txt file. 

**[4]** For custom sentiment words for our ground truth data[2], copy our custom added sentiment words as ground truth data in the following folder.
```
    cp  data/sentiment.csv.gz $R_LIB/sentiment/data
```
**[5]** Run the dependency libraries before running the main file. From R Command line
```
    source("installDependencies.R")
```
**[6]** After successful installation of libraries, we can run the main file.
```
    source("main.R")
```

## Input APIs

**[1]** **execute(tweetcounts=1000)**   
This is the default API for our program, it takes tweetcounts as input and create batch over these tweets to test and update the model. We are dividing tweetcounts in batch, with default batch size of 200 to update the model and get the latest features to project test data. For more detail working, please refer the project report document.

**[2]** **demo()**  
We have a demo function that emulate the real-time event processing extracting tweets from mongoDB and run sentiment prediction for some sample tweets.

## Output: 
We can see the output of the real-time emulated tweets sentiment analysis with the overall accuracy with contingency table and the sentiment label distribution as a **bubble plot**.
```
==================== NEW TWEET ====================

 [INFO] Tweet Counter :   100 
 Prediction =  unknown  
 Ground Truth =  unknown 

 ---- Contingency Matrix ------- 
         
batchPred anger disgust joy sadness surprise unknown
  anger       3       0   0       0        0       1
  joy         0       1  23       1        1       4
  sadness     0       0   0       1        0       0
  unknown     0       0   5       0        0      60
----------------------------
% Accuracy :  87 % 
----------------------------

 [INFO] .... Updating model ....
```

##References:  
[1] Stop word list: http://www.ranks.nl/stopwords   
[2] Sentiment Package Example:   https://sites.google.com/site/miningtwitter/questions/sentiment/sentiment

