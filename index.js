const mineflayer = require('mineflayer')
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let data = JSON.parse(rawdata);
var lasttime = -1;
var moving = 0;
var connected = 0;
var actions = ['forward', 'back', 'left', 'right']
var lastaction;
var pi = 3.14159;
var moveinterval = 1; // 2 second movement interval
var maxrandom = 1; // 0-5 seconds added to movement interval (randomly)
var host = data["ip"];
var port = data["port"];
var username = data["name"]
var bot = mineflayer.createBot({
  host: host,
  port: port,
  username: username
});
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;

}
bot.on('login', function() {
  console.log('Logged In');
  // bot.chat("The administrators of Dragon SMP have identified a potential hacker/cheater. As a precautionary measure, all players will be under watch. We appreciate your cooperation in maintaining a fair and enjoyable gaming experience. Thank you!");
  //bot.chat("Shadow Kitty is now warned for being a cute little furry which is an amazing friend.");

});
bot.on('time', function() {
  if (connected < 1) {
    return;
  }
  if (lasttime < 0) {
    lasttime = bot.time.age;
  } else {
    var randomadd = Math.random() * maxrandom * 20;
    var interval = moveinterval * 20 + randomadd;
    if (bot.time.age - lasttime > interval) {
      if (moving == 1) {
        bot.setControlState(lastaction, false);
        moving = 0;
        lasttime = bot.time.age;
      } else {
        var yaw = Math.random() * pi - (0.5 * pi);
        var pitch = Math.random() * pi - (0.5 * pi);
        bot.look(yaw, pitch, false);
        lastaction = actions[Math.floor(Math.random() * actions.length)];
        bot.setControlState(lastaction, true);
        moving = 1;
        lasttime = bot.time.age;
        bot.activateItem();
      }
    }
  }
});


var teleportUser = "TrivCodez";
var targetUser = "DragonSMP";
var isFollowing = false;

bot.on('chat', function(username, message) {
  if (username === teleportUser && message === '-startscan') {
    bot.chat('Starting scan...');
  } else if (username === teleportUser && message === '-tp') {
    executeTeleportCommand(targetUser, teleportUser);
  } else if (username === teleportUser && message === '-s') {
    executeGiveCommand(teleportUser, 'minecraft:diamond_sword', 'Bot Crusher', [{ id: 'minecraft:sharpness', lvl: 255 }, { id: 'minecraft:unbreaking', lvl: 3 }], 1);
  } else if (username === teleportUser && message === '-pa') {
    executeGiveCommand(teleportUser, 'minecraft:diamond_pickaxe', 'Admin Drill', [{ id: 'minecraft:efficiency', lvl: 255 }, { id: 'minecraft:unbreaking', lvl: 3 }], 1);
  } else if (username === teleportUser && message === '-a') {
    executeGiveCommand(teleportUser, 'minecraft:diamond_axe', 'Hacker Torturer', [{ id: 'minecraft:fire_aspect', lvl: 255 }, { id: 'minecraft:unbreaking', lvl: 3 }], 1);
  }
  else if (username === teleportUser && message === '-followtoggle') {
    toggleFollow();
  } else if (username === teleportUser && message === '-tpcammy') {
    executeCammyTeleport(teleportUser);
  } else if (username === teleportUser && message === '-spawncammy') {
    spawnCammy();
  } else if (username === teleportUser && message === '-sh') {
    executeGiveCommand(teleportUser, 'minecraft:diamond_shovel', 'Admin Digger', [{ id: 'minecraft:efficiency', lvl: 255 }, { id: 'minecraft:unbreaking', lvl: 3 }], 1);
  }
});

function executeTeleportCommand(target, destination) {
  if (destination === "TrivCodez") {
    var command = `/tp ${target} ${destination}`;
    bot.chat(command);
  } else {
    bot.chat('You do not have permission to execute this command.');
  }
}

function executeCammyTeleport(target) {
  var command = `/execute at ${target} run tp @e[name=Cammy] ~ ~ ~`;
  bot.chat(command);
}

function spawnCammy() {
  var command = `/execute as TrivCodez run summon minecraft:camel ~ ~ ~ {CustomName:'[{"text":"Cammy"}]', HandItems:[{id:"minecraft:totem_of_undying",Count:1b,tag:{Unbreakable:1,Infinite:1}}], SaddleItem:{id:"minecraft:saddle",Count:1b}}`;
  bot.chat(command);
}

function executeCammyTeleport(target) {
  var command = `/execute at ${target} run tp @e[name=Cammy] ~ ~ ~`;
  bot.chat(command);
}

function executeGiveCommand(user, item, name, enchantments, count) {
  if (user === "TrivCodez") {
    var command = `/minecraft:give ${user} ${item}{display:{Name:'{"text":"${name}"}'},Enchantments:[${enchantments.map(e => `{id:'${e.id}',lvl:${e.lvl}}`).join()}]} ${count}`;
    bot.chat(command, (err) => {
      if (err) {
        console.log(`Error executing command: ${command}`);
      } else {
        console.log(`Command executed: ${command}`);
      }
    });
  } else {
    bot.chat('You do not have permission to execute this command.');
  }
}

function toggleFollow() {
  if (isFollowing) {
    isFollowing = false;
    bot.chat('DragonSMP is now wandering freely.');
    clearInterval(intervalId); // Stop the interval
  } else {
    isFollowing = true;
    bot.chat('DragonSMP is now following TrivCodez.');
    intervalId = setInterval(() => {
      bot.chat(`/tp ${targetUser} ${teleportUser}`);
    }, 100); // Execute the command every 0.1 milliseconds
  }
}


bot.on('spawn', function() {
  connected = 1;
});

require("http").createServer((_, r) => r.end("Alive!")).listen(8080)