![alt text](../logo.png "RattleSnake")

# feedme.js

Spawns snakes that will go to your current position and crash into you

[View video on Youtube](http://www.youtube.com/watch?v=J2sZUos6et8)

### Run the Example

Unlike the other scripts, running this example takes a tiny bit more work

#### 1. Proxy Settings

Slither servers cap the amount of connections that can be made from your address. If you request too many you will be temporary blocked from connecting to the server. It is recommended to run no more then 3 snakes per proxy.

***Skip this step if you will not be using a proxy server. Keep in mind that if you spawn too many bots from your IP, you or your bots may not be able to login again after you die**

*Only supports HTTP proxies right now.*

Paste your proxies inside of ```examples/proxies.txt``` in the format below:

```
5.5.5.5:1234
5.5.5.6:4321
...
```

Do not use too many proxies because the script will spawn ```the amount of proxies * 3``` bots by default. So if you enter 20 proxies, 60 bots will be spawned. You can change the amount of bots per proxy inside of ```examples/feedme.js``` in the variable ```perProxy```

#### 2. Start the script

```
node examples/feedme.js
```

#### 2. Inject browser code

It's now time to inject the browser code which will tell the bots where to find you.

1. Go into your browsers console
 * [Chrome Instructions](https://developer.chrome.com/devtools/docs/console)
 * [Firefox Instructions](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console)
2. Paste and enter the code below into it

```
var xhttp=new XMLHttpRequest;xhttp.onreadystatechange=function(){4==xhttp.readyState&&200==xhttp.status&&eval(xhttp.responseText)},xhttp.open("GET","http://127.0.0.1:1337/inject",!0),xhttp.send();
```

### 3. Login

If you haven't received any errors yet then it's time to login. As soon as you press login the bots will spawn and start slithering their way to your current position.

### Controls

X - Speed up all bots

***Note: Bots will not change servers if you decide to, you will have to restart this process again***

***Another Note: There are people out there who are trying to have fun, try not to ruin it for them!***
