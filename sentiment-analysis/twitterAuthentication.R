library(ROAuth)

TWITTER_CONSUMER_KEY="1cqHiFtcv6hPM462OEcxZDrl7"
TWITTER_CONSUMER_SECRET="YlsQJ27FBnRpefqCZQNSFx8aBR51bFMZexPolWgbMFzgt5lA3U"
TWITTER_ACCESS_TOKEN="access token"
TWITTER_ACCESS_SECRET="access secret"

requestURL <- "https://api.twitter.com/oauth/request_token"
accessURL <- "https://api.twitter.com/oauth/access_token"
authURL <- "https://api.twitter.com/oauth/authorize"
consumerKey <- TWITTER_CONSUMER_KEY
consumerSecret <- TWITTER_CONSUMER_SECRET
my_oauth <- OAuthFactory$new(consumerKey = consumerKey, consumerSecret = consumerSecret, 
                             requestURL = requestURL, accessURL = accessURL, authURL = authURL)
my_oauth$handshake(cainfo = system.file("CurlSSL", "cacert.pem", package = "RCurl"))
save(my_oauth, file = "my_oauth.Rdata")
