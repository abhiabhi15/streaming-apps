## Project 1: Tweet Sentiment Analyzer
---
#####Software : `node.js, express, socket.io, jade, ntwitter`
#####OS : `Ubuntu 12.04 (Linux 3.2.0-58-generic)`
##### Author : `Abhishek`
 ---
### Installation Guide [As per Tutorial-1]
**1.** Install **Node.js** web server using following commands :
```
$ sudo apt-get update
# to install all the dependencies
$ sudo apt-get install git-core curl build-essential openssl libssl-dev 
$ git clone https://github.com/joyent/node.git && cd node
$ pwd # to make sure you are in the node directory.
$ ./configure
$ make
$ sudo make install
$ which node # to verify where node is installed
```
**2-** Express, Jade, socket.io and ntwitter can be installed as follows:
```
$ npm install express
$ sudo npm install -g jade
$ npm install socket.io 
$ npn install ntwitter
```
**Note:** Please skip the above installation commands, if already installed.

### Environment Variables
**ntwitter** uses **Twitter streaming API** which is accessed via access tokens and secret keys. You need to create the credentials by logging  into [apps.twitter.com](https://apps.twitter.com/). Here you can create a new app for which you can get your own access tokens and secret keys. After this step, save the below variables in your **.bashrc** file after replacing the values from the actual tokens which you have accessed after creating a twitter app. 
````
export TWITTER_CONSUMER_KEY= "YOUR_CONSUMER_KEY"
export TWITTER_CONSUMER_SECRET= "YOUR_CONSUMER_SECRET"
export TWITTER_ACCESS_TOKEN= "YOUR_ACCESS_TOKEN"
export TWITTER_ACCESS_SECRET= "YOUR_ACCESS_SECRET"
```
After saving the above system variables, run the .bashrc file.
```
$ source .bashrc
```

## Execution Commands

**1-** To execute the **Twitter Sentiment Analysis App**, follow the commands below:  
[1] Please locate the myTwitApp folder
```
$ cd myTwitApp
```
[2] Install the packages, using npm command. Saving is not necessary as it is already their in package.json
```
$ npm install
```
[3] Kill the node process, if already running
```
$ ps -ef | grep node
$ kill -9 process-id   #First Number output is process-id 
```
[4] For starting the server, **(twitter app)**
```
$ node app.js love hate
```
Here the server script takes two arguments, word1 and word2, these words can be anything as the API takes words as input.  
**Eg:** 
```
$ node app.js obama eminem  
$ node app.js bigdata cloud
$ node app.js happy sad
```
To kill the server, Press Ctrl+C.

### Design and Assumptions
1. The twitter app takes two mandatory word arguments, without these it will throw error and process will exit.  
2. The tweets and stats send to the client (browser) are at some small time interval. As it will always be proportional to the percentage of the tweets of each words. Eg. 'Hate' word tweets will be less than "Love" word tweets.  
3. All the summary statistics are captured on server side only and embedded in a single json which is sent to client side via socket.io emits.  
4. Twitter 'status/filter' with track words API is used to capture the on-demand word tweets. The wordCounts here are managed with the if-else logic. So the minor cases where the tweet has both words may not have been covered.   

### Input and Output Interpretation:
As mention above the input takes two words as an argument while starting the server, otherwise it will print the error and stop the process. 
```
$ node app.js love hate
```
For the implementation details, please refer the scripts lib/twitter.js   
**Note:** Summary Analytics are calculated at server side.  
Now, open the browser with url ```127.0.0.1:3000```  after starting the server:

##### Output can be interpreted as: 
**[1] Total Tweets :** Gives the total number of tweets for word1 and word2  
**[2] Word1 Tweet Count :** Gives the total number of tweets for word1  
**[3] Word2 Tweet Count :** Gives the total number of tweets for word2  
**[4] Word Tweets:** These tweet streams are random tweets at certain interval. **[5] Pie Chart:** Here the percentage tweets can be compared by pie-chart. And it can answer which word occurs more frequently than other.  
**Note:** All the tweets are not sent to the client as it will be difficult to analyze with such fast streaming rate.  
### References 
[1] http://nodejs.org/documentation/  
[2] For Jade tutorial: http://jade-lang.com/tutorial/  
[3] For ntwitter API : https://github.com/AvianFlu/ntwitter

