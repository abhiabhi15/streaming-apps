my_preprocess <- function(counts){
  tweets <- getMongoTweets(counts)
  tweets <- VCorpus(VectorSource(tweets))
  inspect(tweets)
  tweets <- preprocess(tweets)
  inspect(tweets)
}