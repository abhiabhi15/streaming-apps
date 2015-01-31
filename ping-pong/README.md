## L1: Ping Pong with Node.js, Express, Socket.IO
---
#####Software : `node.js, express, socket.io, git`
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
**2-** Express, Jade and socket.io can be installed as follows:
```
$ npm install express
$ sudo npm install -g jade
$ npm install socket.io 
```
**Note:** Please skip the above installation commands, if already installed.

**3-** To execute the **Ping-Pong App**, follow the commands below:  
[1] Please locate the ping-pong folder
```
$ cd ping-pong
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
[4] For starting the server, (ping-pong app)
```
$ node app.js
```
### Output Interpretation:
Please open the browser with url 127.0.0.1:3000  
**Server Side Ping-Pong** : From the server side "Ping Message" is sent to the client at every 5-10 seconds interval. In the browser, the left panel shows the server ping and client response as pong. The animation is controlled using jQuery hide and delay functions. 

**Client Side Ping-Pong** : From the client side "Ping Message" is sent to the Server by clicking "Client Ping" button. In the browser, the right panel shows the client ping and server response as pong. The animation is controlled using jQuery hide and delay functions.   
The messages are logged in both server and client side consoles.

### References
[1] http://nodejs.org/documentation/  
[2] For Jade tutorial: http://jade-lang.com/tutorial/

