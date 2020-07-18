/*

Module discord-lobby
Authors: Flisher
Version: 3.0.3

Todo:
    -Validate Discord App Intention and give proper warning
    -return a message if the bot don't have read history permission

*/

module.exports = (bot, options) => {
    // const Discord = require("discord.js");
    const description = {
        name: `discord-lobby`,
        filename: `discord-lobby.js`,
        version: `3.0.3`
    }

    if (!options) {
        options = {};
    }

    // Check if version is 12, if not, abort
    let DiscordJSversion = require('discord.js').version
    if ( DiscordJSversion.substring(0,2) !== "12" ) console.error(`This version of discord-lobby only run on DiscordJS v12 and up, please run "npm install discord-lobby@2.2.1" to install an DiscordJS v11`)
    if ( DiscordJSversion.substring(0,2) !== "12" ) return

    if (options.AlreadyReady === true) {
        onReady()
    } else {
        bot.on("ready", () => {
            onReady()
        });
    }

    async function onReady() {
        console.log(`Module: ${description.name} | Loaded version ${description.version} from ("${description.filename}")`)
        // Cleanup the AlreadyReady parameber since it's not a server
        if (options.AlreadyReady) delete options.AlreadyReady
        // Initialize if options are multi-server


        for (let guildid in options) {
            if (typeof options[guildid].watchguild == 'undefined') options[guildid].watchguild = guildid; // guild.id
            if (typeof options[guildid].watchchannel == 'undefined') options[guildid].watchchannel = `lobby`; // channel.name or channel.id
            if (typeof options[guildid].reactionEmoji == 'undefined') options[guildid].reactionEmoji = `✅`; // unicode
            if (typeof options[guildid].grouptoadd == 'undefined') options[guildid].grouptoadd = `guest`; // role.name or role.id
            if (typeof options[guildid].welcomechannel == 'undefined') options[guildid].welcomechannel = false; // false or channel.name or channel.id. by default ,the bot will NOT great new user
            if (typeof options[guildid].welcomemsg == 'undefined') options[guildid].welcomemsg = `Welcome among us @MEMBER!`; // string, support @MEMBER and @GUILDNAME replacement
            if (typeof options[guildid].welcomedelay == 'undefined') options[guildid].welcomedelay = 0; // delay in millisecond before the bot send the welcome message after the reaction
            if (typeof options[guildid].maxFetchMessage == 'undefined') options[guildid].maxFetchMessage = 100; // DiscordJS max, this is used to fetch messages posted prior to the bot startup

            let localoptions = options[guildid];
            localoptions.valid = true;

            // This code will search for guild and fetch channels message from the guild, default max is 50 mnessage
            let guild = bot.guilds.cache.find(val => val.id === localoptions.watchguild)

            // Overide the any value above 300 to prevent API Spamming
            if (options[guildid].maxFetchMessage > 300) {
                options[guildid].maxFetchMessage = 300;
                console.log(`${description.name}: Overriding "maxFetchMessage" for guild "${guild.name}" guild" to 300 to prevent API spamming`)
            }

            if (guild) {
                // Guild Exist, Search for channel by ID or Name
                let channel = bot.guilds.cache.find(val => val.id === localoptions.watchguild).channels.cache.find(val => val.id === localoptions.watchchannel) || bot.guilds.cache.find(val => val.id === localoptions.watchguild).channels.cache.find(val => val.name === localoptions.watchchannel) || false
                if (channel) {
                    let messageCount = 0
                    let lastCount = 0

                    // Fetch a Maximum of 3x100 message to avoid API Spamming
                    // Fetch #1
                    let maxFetchMessage = localoptions.maxFetchMessage;
                    if (maxFetchMessage >= 100) maxFetchMessage = 100;

                    let messages = ''
                    try {
                        messages = await channel.messages.fetch({
                            limit: maxFetchMessage
                        })
                    } catch (err) {
                        console.error(err)
                    }

                    messageCount = messageCount + messages.size;
                    lastCount = messages.size;

                    // Fetch #2
                    if (localoptions.maxFetchMessage > 100) maxFetchMessage = localoptions.maxFetchMessage - messageCount;
                    if (maxFetchMessage >= 100) maxFetchMessage = 100;

                    if (lastCount == maxFetchMessage && messageCount < localoptions.maxFetchMessage && maxFetchMessage > 0) {
                        try {
                            messages = await channel.s({
                                limit: maxFetchMessage
                            })
                        } catch (err) {
                            console.error(err)
                        }

                        messageCount = messageCount + messages.size;
                        lastCount = messages.size;
                    }

                    // Fetch #3
                    if (localoptions.maxFetchMessage >= 100) maxFetchMessage = localoptions.maxFetchMessage - messageCount;
                    if (maxFetchMessage >= 100) maxFetchMessage = 100;

                    if (lastCount == maxFetchMessage && messageCount < localoptions.maxFetchMessage && maxFetchMessage > 0) {
                        try {
                            messages = await channel.messages.fetch({
                                limit: maxFetchMessage
                            })
                        } catch (err) {
                            console.error(err)
                        }

                        messageCount = messageCount + messages.size;
                        lastCount = messages.size;
                    }
                    console.log(`${description.name} -> Fetched ${messageCount} message from channel "${guild.name}" / "${channel.name}"`)
                } else {
                    console.log(`${description.name} -> Couldn't find channel "${localoptions.watchchannel}" on "${guild.name}" guild", removing from options`)
                    localoptions.valid = false
                }
            } else {
                // Log and remove invalid guilds from options
                console.log(`${description.name} -> Guild ${localoptions.watchguild} not found, removing from options`)
                localoptions.valid = false
            }
            if (!localoptions.valid) delete options[localoptions.watchguild]

        }
    }

    bot.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.channel.type !== "text") return; // Exit event if not a message from guild.

        // Set localoptions based on guild option
        let localoptions = options[reaction.message.guild.id] || false;
        if (!localoptions) return; // Exit if no valid options are found (reaction from an unwatched guild)   

        // Check if channel is watched
        if (!(reaction.message.channel.name === localoptions.watchchannel || reaction.message.channel.id === localoptions.watchchannel)) return;

        // Check if the Emoji is watched
        if (!(reaction.emoji.name === localoptions.reactionEmoji)) return;

        // Set guild variable
        let guild = reaction.message.guild

        // Set Role variable
        let role = guild.roles.cache.find(val => val.name === localoptions.grouptoadd) || guild.roles.cache.find(val => val.id === localoptions.grouptoadd)

        // Check if role exist
        if (!role) console.log(`${description.name}: role ${localoptions.grouptoadd} not found for guild "${guild.name}"`)
        if (!role) return;

        // Validate member information
        let member = reaction.message.guild.members.cache.find(val => val.id === user.id)
        if (!member) console.log(`${description.name}: member ${user.id} not found for guild "${guild.name}"`)
        if (!member) return;

        try {
            await member.roles.add(role)
        } catch (err) {
            console.error(err)
        }

        // Validate greeting channel and send message if applicable
        if (!localoptions.welcomechannel) return; // Exit if no channel configured
        let channel = member.guild.channels.cache.find(val => val.name === localoptions.welcomechannel) || member.guild.channels.cache.find(val => val.id === localoptions.welcomechannel);
        if (!channel) console.log(`${description.name}: channel ${localoptions.welcomechannel} not found in guild "${guild.name}"`)
        if (!channel) return;

        let msg = localoptions.welcomemsg.replace(`@MEMBER`, `${member.user}`).replace(`@GUILDNAME`, `${member.guild.name}`);
        msg = msg.replace(`@GUILDNAME`, `${member.guild.name}`);
        setTimeout(function () {
            try {
                channel.send(msg)
            } catch (err) {
                console.error(err)
            }

        }, localoptions.welcomedelay || 1);
    })
}