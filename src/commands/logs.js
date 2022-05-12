const { MembershipScreeningFieldType } = require('discord-api-types/v10');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "logs",
    description: "checks base logs. only works for among us empire members",
    cooldown: 1,
	guilds: ["967114437356056698"],
    permissions: [],
    roles: ["967122553921503283"],
    options: [
        {
            name: "start",
            description: "the place to start the search",
            type: 4,
            required: false
        }
    ],
    run: async (client, interaction) => {
        if (!(interaction.channel.id == "968542334381875310")) return interaction.reply("This command can only be used in <#968542334381875310>")
        console.log(interaction.channel.id)

        await interaction.deferReply()

        const reply = await interaction.fetchReply()

        const user = interaction.user

        let filter = null
        let cur = (interaction.options.getInteger("start") || 1) - 1

        const ifilter = m => m.customId == "back" || "forward" || "filter" && m.user.id === user.id && m.message.id === reply.id
        const collector = interaction.channel.createMessageComponentCollector({ ifilter, time: 15000 });

        async function update() {
            let logAmnt = 0
            let embeds = []

            if (client.logs.length > 1) {
                for (const [i, log] of Object.entries(client.logs)) {
                    if (logAmnt < 3 && i >= cur - 1 && ((log.event == filter) || !filter)) {
                        console.log(`at #${Number(i) + 1}`)
                        embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle(`Log ${Number(i) + 1}/${client.logs.length}`)
                            .addFields(
                                { name: "event type", value: log.event, inline: true },
                                { name: "location", value: log.location, inline: true },
                                { name: "time", value: `<t:${Math.floor(log.timestamp / 1000)}>`, inline: true }
                            )

                        if (log.event == "base_enter") {
                            embed.addField("user", log.user, true)
                        }

                        logAmnt += 1

                        embeds.push(embed)
                    }
                }
            } else {
                embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("No logs")
                    .setDescription("There are currently no logs.")

                embeds.push(embed)
            }

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("back")
                        .setLabel("Back")
                        .setStyle("PRIMARY")
                        .setDisabled(cur - 1 < 0),
                    new MessageButton()
                        .setCustomId("forward")
                        .setLabel("Forward")
                        .setStyle("PRIMARY")
                        .setDisabled(cur + 1 >= client.logs.length),
                )
            const selectMenu = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId("filter")
                        .setPlaceholder("No filter")
                        .addOptions([
                            {
                                label: "No filter",
                                description: "Don't filter anything",
                                value: "no_filter"
                            },
                            {
                                label: "Base entrances",
                                description: "Entrances to the base detected",
                                value: "base_enter"
                            },
                        ])
                )

            return interaction.editReply({ embeds: embeds, components: [selectMenu, row] })
        }

        collector.on("collect", async i => {
            try {
                await i.deferUpdate()

                if (i.customId === "forward") {
                    console.log("forward")

                    cur = Math.min(cur + 3, client.logs.length)
                } else if (i.customId === "backward") {
                    console.log("backward")

                    cur = Math.max(cur - 3, 0)
                } else if (i.customId === "filter") {
                    const value = i.values[0]
                    console.log(value)

                    if (value === "no_filter") {
                        filter = null
                    } else {
                        filter = value
                    }
                }

                update()
            } catch (error) {
                console.log(error)
            }
        })

        update()
    }
}
