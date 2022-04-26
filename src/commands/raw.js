const { MessageEmbed, Message } = require("discord.js")
const fetch = require("node-fetch")

async function searchUntilRaw(part, parts, cur, amnt) {
    cur = cur || {}
    amnt = amnt || 1

    for (const [i, item] of Object.entries(part.Recipe)) {
        const entry = parts[item[0]]

        if (entry && entry.Recipe) {
            cur = await searchUntilRaw(parts[item[0]], parts, cur, amnt*item[1])
        } else {
            cur[item[0]] = (cur[item[0]] || 0) + amnt*item[1]
            console.log("added " + item[0])
        }
    }
    console.log(cur)

    return cur
}

module.exports = {
    name: "raw",
    description: "gets the raw crafting recipe for a part",
    cooldown: 1,
    permissions: [],
    options: [
        {
            "name": "part",
            "description": "The part's name.",
            "type": 3,
            "required": true
        },
    ],
    run: async (client, interaction) => {
        const parts = await (await fetch("http://12pink.dev/data/parts.json")).json()
        const partName = interaction.options.getString("part")
        const user = interaction.user
        const part = parts[partName]

        if (part && part.Recipe) {
            const rawRecipe = await searchUntilRaw(part, parts)

            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`${partName} raw recipe`)
            .setFooter({ text: `${user.username}#${user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` })

            let finishedString = ""
            for (const [item, amount] of Object.entries(rawRecipe)) {
                finishedString += `\n${item} x${amount}`
            }

            console.log(rawRecipe)
            console.log(finishedString)
            embed.setDescription(finishedString)

            return interaction.reply({embeds: [embed]})
        } else if (part && !part.Recipe) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Part has no recipe")
            .setImage("https://http.cat/400")
            .setFooter({ text: `${user.username}#${user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` })

            return interaction.reply({embeds: [embed]})
        } else {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Part not found")
            .setImage("https://http.cat/404")
            .setFooter({ text: `${user.username}#${user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` })


            return interaction.reply({embeds: [embed]})
        }
    }
}