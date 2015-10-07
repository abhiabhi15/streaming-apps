library('sentiment')

getLabel <- function(df){
    cl <- df[,c("love","hate")]
    classFunc <- function(x){
        if(x[1] > x[2]){
            return("love")
        }
        else{
            return("hate")
        }
    }
    
    cl["label"] <- apply(cl, 1, classFunc)
    df["label"] <- cl$label
    df$label <- factor(df$label)
    df <- df[, -which(names(df) %in% c("love","hate"))]
}

getEmotionLabel<-function(df){
  # classify emotion
  class_emo = classify_emotion(df, algorithm="bayes", prior=1.0)
  # get emotion best fit
  emotion = class_emo[,7]
  # substitute NA's by "unknown"
  emotion[is.na(emotion)] = "unknown"
  return(emotion)
}

#accuracy <- function(data, pred){
#    accuracy = (length(which(data$label == pred)) / nrow(data)) * 100
#    cat( "% Accuracy : ", accuracy , "% ")
#}

accuracy <- function(gtruth, pred){
    accuracy = (length(which(gtruth == pred)) / length(gtruth)) * 100
    cat("----------------------------\n")
    cat( "% Accuracy : ", accuracy , "% \n")
    cat("----------------------------\n")
    
}


bubblePlot <- function(pred){
    wordFrequencyDF <- as.data.frame(table(pred))
    
    # Creating a new column of Percentage of Word Count
    sumAllFreq <- sum(wordFrequencyDF$Freq)
    wordFrequencyDF$Percent <- (wordFrequencyDF$Freq*100)/sumAllFreq
    
    # Defining Radius of the Word Bubble
    radius <- sqrt( wordFrequencyDF$Percent/ (pi) )
    
    # Plotting Word Bubbles
    symbols(wordFrequencyDF$Percent, log(wordFrequencyDF$Freq), radius, inches=0.35, fg="white", bg=sample(2:7, 1), xlab="Percentage", ylab="Log (Count)", xlim=c(0,100), main="Cricket Sentiment Bubble Plot")
    text(wordFrequencyDF$Percent, log(wordFrequencyDF$Freq), wordFrequencyDF$pred, cex=0.75)
}
