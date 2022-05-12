const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { readdirSync } = require("fs")
const path = require("path")
const config = require("./config.json")

const guilds = {}
const globalCommands = []

readdirSync("./src/commands").map(async (cmd) => {
	const cmdata = require(`./src/commands/${cmd}`)	
	
	if (cmdata.guilds && cmdata.guilds.length > 0) {
		for (const id of cmdata.guilds) {
			guilds[id] = guilds[id] || []

			guilds[id].push(cmdata)
		}
	} else {
    	globalCommands.push(cmdata)
	}
    console.log(`commands/${cmd}`)
})

console.log(guilds)

const rest = new REST({ version: "9" }).setToken(config.token);

(async () => {
    try {
        console.log("[Discord API] Started refreshing application (/) commands.")
        await rest.put(
            // guild
            //Routes.applicationGuildCommands(config.id, "661575869118283787"),

            // global
            Routes.applicationCommands(config.id),
            
            
            { body: globalCommands }
        )

		for (const [guildID, guildCommands] of Object.entries(guilds)) {
			await rest.put(
				Routes.applicationGuildCommands(config.id, guildID),
				{ body: guildCommands }
			)

			console.log(guildID)
		}

        globalCommands.map(async (cmd) => {
            console.log(cmd)
        })
    } catch (error) {
        console.error(error)
    }
})()
