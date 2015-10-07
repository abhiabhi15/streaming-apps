library(rmongodb)
library(plyr)
collection <- 'twitterstream.cwctweets'
mg <- mongo.create() ## Mongo DB Instance Created
print("MongoDB Connection Opened")
cur <- mongo.find(mg, ns=collection)

getMongoTweets<-function(count=100){
    if(mongo.is.connected(mg)){
        #print(mongo.get.databases(mg))
        #print(mongo.get.database.collections(mg, 'twitterstream'))
        buf <- mongo.bson.buffer.create()
        tweets<-data.frame(stringsAsFactors = F)
        counter = 0 
        while (mongo.cursor.next(cur) && counter < count) {
            tmp = mongo.bson.to.list(mongo.cursor.value(cur))
            tmp.df = as.data.frame(t(unlist(tmp)), stringsAsFactors = F)
            text<-as.data.frame(tmp.df$tweet.txt)
            #print(text)
            tweets<-rbind.fill(tweets,text)
            counter<-counter+1
        }
        colnames(tweets)<-c("text")
        #print(tweets)
        return(tweets)
  }else {
    print("Not connected to MongoDB")
  }
}

getTotalTweetsCount <- function(){
    mongo.count(mg, collection)    
}


mongoDestroy <- function(){
    mongo.destroy(mg)
    print("MongoDB Connection Closed")
}
