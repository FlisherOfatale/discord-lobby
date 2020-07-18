<p align="center"><a href="https://nodei.co/npm/discord-lobby/"><img src="https://nodei.co/npm/discord-lobby.png"></a></p>

# discord-lobby
Simple Discord.js V12 Module that handle basic captive lobby functions
Latest version of this module is only compatible with DiscordJS V12.1.1 and up.

This module should be configured to watch captive or read-only lobby, with a limited number of message.
This module expect the user to click on a configured Emoji and will assign a configured role

Typical use-case would be to assign a role once the user read rules on a server to get out of a captive lobby.

This module can send live or delayed a welcome message to a specified channel.

Note that DiscordJS does not fetch messages posted prior to the bot launch by default.  
In order to trigger reaction events on past message, this module will will fetch 100 channel from the watched channel per default.  
It can be lowered or increased to a maximum of 300 to limit spaming API call.

This module can be loaded as standalone, or witin the bot.on("ready") if configured properly.
This option was added with 2.1.0 and is backward compatible without any configuration change.
It was added to avoid reaching the default maximum listeners to quickly.

## Installation
This module assumes you already have a basic [Discord.js](https://discord.js.org/#/) bot setup.
Simply type the following command to install the module and it depedencies.
```
npm i discord-lobby
``` 

Once you've done this, setting the module will be very easy.
And you can use the following to get started!

## Configuration Samples
This sample will use default configuration for all options


```js
// value no declared will be defaulted to those in the sample
const DiscordLobby = require("discord-lobby")
DiscordLobby(bot, {
	"125048273865015296" : {
			watchchannel = `lobby`;		// channel.name or channel.id
			reactionEmoji = `✅`;		// unicode
			grouptoadd = `guest`;		// role.name or role.id
			welcomechannel = false;		// false or channel.name or channel.id. by default ,the bot will NOT great new user
			welcomemsg = `Welcome among us @MEMBER!`;	// string, support @MEMBER and @GUILDNAME replacement
			welcomedelay = 0;			// delay in millisecond before the bot send the welcome message after the reaction
			maxFetchMessage = 100 ;		// DiscordJS max, this is used to fetch messages posted prior to the bot startup
		}
	//"AlreadyReady" : true			// Optionnal, default = False.  Set to true if the module is called within your bot.on("ready")
	}
	// support multiple servers separated by ","
);
```

###English:
This module was initialy coded by Flisher for the Bucherons.ca gamers community and the Star Citizen Organization "Gardiens du LYS".

###Français:
Ce module a initiallement été conçu par Flisher pour la communauté de gamers Bucherons.ca, la communauté gaming pour adultes au Québec, et l'organisation des Gardiens du LYS dans Star Citizen.  
Liens:  https://www.bucherons.ca et https://www.gardiensdulys.com  

##Support:
You can reach me via my Discord Development Server at https://discord.gg/Tmtjkwz

###History:  
3.0.3	Added reference to github repository
3.0.2	Minor fix to README.md 
3.0.1	Added deprecation warning if using v11, removed doscordjs from the depedency in package.json
3.0.0	Initial push for DiscordJS V12.0.1
2.2.1   NodeJS Beautified - Latest Build for DiscordJS 11.5.1
2.2.0   NodeJS Linting
2.1.3   Fixed missed declaration of guild variable for error on previous line 141
2.1.2   2nd fix on onReady
2.1.1   Fixed onReady to async  
2.1.0   new onReady Mechanism  
2.0.7   Added more explicit variable declaration to avoid potential issues and adjusted console.log format for consistency across modules  
2.0.6   explicitely defined guild in loop to avoid conflit when multiple guild are loaded  
2.0.5   removed lefover debug message  
2.0.4   Fixed some variable declaration to prevent race condition  
2.0.3   Fixed version in description of the module  
2.0.2   Changed logic evaluation related to channel.send  
2.0.1   Removed verbose try message and ajusted README.md formatting  
2.0.0	Initial Public Release based on Flisher private discord-bienvenue module  
