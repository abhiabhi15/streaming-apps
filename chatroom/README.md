## B1: Multi Client Chat Room with Node.js, Express, Socket.IO, Redis
---
#####Software : `node.js, express, socket.io, redis`
#####OS : `Ubuntu 12.04 (Linux 3.2.0-58-generic)`
##### Author : `Abhishek (Unity Id : akagrawa)`
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
**Note**: Ignore the above installation commands if node.js is already installed.

**2-** Install Redis Server  
```
$ sudo apt-get install redis-server
```
**3-** Now install node-dependencies listed in package.json
```
$ cd chatroom
$ npm install 
```
**4-** To run/start the chatroom server
```
$ node app.js
```

### Output Interpretation:
Please open the browser with url 127.0.0.1:3000  
**1-** The default name will be assigned to every new client side user, with **guest** as prefix.  
**2-** User can change their nickname in the input tab and the same will be stored in browser session.   
**3-** Type Message : Hi. Anyone there?  
**4-** Open another web browser or another private browser which will act as a new user.  
**5-** You can see the messages of user 1  
**6-** Similary, new users can change their nicknames, see the chat history and type new chat messages.




### References
[1] http://nodejs.org/documentation/  
[2] For Jade tutorial: http://jade-lang.com/tutorial/  
[3] For Redis : http://redis.io/commands/lrange  
