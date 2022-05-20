const express = require("express")
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
const port = 2069

const fetch = require("node-fetch")

const { Client, Collection, Intents } = require("discord.js")
const { readdirSync, writeFileSync, readFileSync } = require("fs")
const logs = require("./src/commands/logs")

// make a client thing that we can add stuff to
const client = new Client({
    allowedMentions: { parse: ['users', 'roles'] },
    fetchAllMembers: false,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]
})

// add a bunch of stuff to the client thing
client.commands = new Collection()
client.config = require("./config.json")
client.serials = require("./serials.json")
client.universe = require("./universe.json")
client.logs = []
cooldowns = new Collection()

// load handlers
readdirSync("./src/utils/handlers/").map(async (handler) => {
    require(`./src/utils/handlers/${handler}`)(client)

    console.log(`loaded handler '${handler}'`)
})

app.listen(port, () => {
    console.log(`server listening at localhost:${port}`)
})

client.login(client.config.token)
