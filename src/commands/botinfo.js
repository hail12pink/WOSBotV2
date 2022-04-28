const { MessageEmbed } = require("discord.js")
const os = require("os")
const process = require("process")

module.exports = {
    name: "botinfo",
    description: "gets information about the bot",
    cooldown: 1,
    permissions: [],
    options: [],

    run: async(client, interaction) => {
        const uptime = client.readyTime //Date.now() - client.readyTime
        console.log(uptime)

        console.log(os.totalmem())

        const totalmem = Math.round((os.totalmem()/1000/1000*100)/1000)
        const usedmem = Math.round((process.memoryUsage().heapTotal/1000/1000*100)/1000)

        console.log(usedmem)
        console.log(process.memoryUsage())
        
        const embed = new MessageEmbed()

            .addFields(
                { name: "Operating System", value: `${os.type()} (${os.arch()})`, inline: true },
                { name: "Uptime", value: `Since <t:${Math.floor(uptime/1000)}:R>` },
                { name: "Memory Usage", value: `${usedmem*10}MB/${totalmem*10}MB (${Math.round((usedmem/totalmem)*100)/100}%)`, inline: true }
            )

        interaction.reply({ embeds: [embed] })
    }
}
