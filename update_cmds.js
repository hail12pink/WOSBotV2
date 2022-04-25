const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { readdirSync } = require("fs")
const path = require("path")
const config = require("./config.json")

const commands = []
readdirSync("./src/commands").map(async (cmd) => {
    commands.push(require(`./src/commands/${cmd}`))
    console.log(`commands/${cmd}`)
})

const rest = new REST({ version: "9" }).setToken(config.token)

(async () => {
    try {
        console.log("[Discord API] Started refreshing application (/) commands.")
        await rest.put(
            // guild
            Routes.applicationGuildCommands(config.id, "661575869118283787"),

            // global
            //Routes.applicationCommands(config.id),
            
            
            { body: commands }
        )

        commands.map(async (cmd) => {
            console.log(cmd)
        })
    } catch (error) {
        console.error(error)
    }
})()