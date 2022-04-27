const { MessageEmbed } = require("discord.js")
const os = require("os")

module.exports = {
    name: "botinfo",
    description: "gets information about the bot",
    cooldown: 1,
    permissions: [],
    options: [],

    run: async(client, interaction) => {
        const uptime = client.readyTime //Date.now() - client.readyTime
        console.log(uptime)
        
        const embed = new MessageEmbed()

            .addFields(
                { name: "Operating System", value: `${os.type()} ${os.arch()}`, inline: true },
                { name: "Uptime", value: `Since <t:${Math.floor(uptime/1000)}:R>` }
            )

        interaction.reply({ embeds: [embed] })
    }
}