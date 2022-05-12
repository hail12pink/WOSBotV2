const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "getserial",
    description: "[among us empire command] gets information the ship assigned to the specified serial",
    cooldown: 1,
	guilds: ["967114437356056698"],
    permissions: [],
    roles: ["967123426533855232"],
    options: [
        {
            name: "serial",
            description: "the serial to lookup",
            type: 3,
            required: true
        }
    ],

    run: async (client, interaction) => {
        const serial = interaction.options.getString("serial")
        const shipData = client.serials[serial]

        if (shipData) {
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(serial)
            .addFields(
                { name: "Owner", value: shipData.Owner, inline: true },
                { name: "Status", value: shipData.Status, inline: true },
                { name: "Date-Of-Activation", value: `<t:${Math.floor(shipData.DOA/1000)}:R>`, inline: true },
                { name: "Assigned script", value: shipData.Script, inline: true }
            )

            interaction.reply({ embeds: [embed] })
        } else {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Invalid serial")
            .setDescription("The specified serial is not valid.")

            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}
