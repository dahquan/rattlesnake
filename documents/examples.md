![alt text](logo.png "RattleSnake")


# Examples

RattleSnake has a couple examples already made for you to play around with.

## Get the source

You can get the source by cloning ```https://github.com/dahquan/rattlesnake.git``` or downloading the current version [here](https://github.com/dahquan/rattlesnake/archive/master.zip).

Before continuing make sure you have taken a look at the [requirements](requirements.md)

```
cd rattlesnake
npm install
```

## Changing your name

##### Linux/OSX/*nix
```export SLITHER_SERVER_NAME=<name>```

##### Windows

```set SLITHER_SERVER_NAME=<name>```

## Changing the Server

For most of the examples you can change the server by typing the command below or manually changing it inside the file.

##### Linux/OSX/*nix
```export SLITHER_SERVER=<ip>:<port>```

##### Windows

```set SLITHER_SERVER=<ip>:<port>```

## Included Scripts

###### [feedme.js](examples/feedme.md)
Spawns many snakes that go to your current position and crash into you.

###### [leaderboard.js](examples/leaderboard.md)
Prints out the current leaderboard once connected to the the server

###### [surroundings.js](examples/surroundings.md)
Prints out other snakes that come in and out of the view
