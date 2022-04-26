const { MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")

function componentToHex(c) { // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) { // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

module.exports = {
    name: "part",
    description: "gets information about a waste of space part",
    cooldown: 1,
    permissions: [],
    options: [
        {
            "name": "part",
            "description": "The part's name.",
            "type": 3,
            "required": true
        },
        {
            "name": "raw_json",
            "description": "whether to send json instead",
            "type": 5,
            "required": false
        }
    ],

    run: async (client, interaction) => {
        const parts = await (await fetch("http://12pink.dev/data/parts.json")).json()
        const partName = interaction.options.getString("part")
        const user = interaction.user
        const part = parts[partName]

        if (part) {
            console.log(interaction.user)

            if (interaction.options.getBoolean("raw_json") == true) {
                return interaction.reply("raw json:\n```js\n" + JSON.stringify(part) + "\n```")
            }

            const embed = new MessageEmbed()
            .setColor(rgbToHex(part.DefaultColor))
            .setTitle(partName)
            .setDescription(part.Description || "[ No description entry ]")
            .setFooter({ text: `${user.username}#${user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` })
            .addFields(
                { name: "Durability", value: (part.Durability || 3).toString(), inline: true },
                { name: "State", value: (part.ClassState || 3).toString(), inline: true },
            )

            if (part.Flammable) {
                embed.addField("Flammable", ":white_check_mark:", true)
            } else {
                embed.addField("Flammable", ":x:", true)
            }

            if (part.Recipe) {
                let finished = ""

                part.Recipe.map(async (item) => {
                    console.log(item)
                    finished += `${item[0]}: ${item[1]}\n`
                })

                embed.addField("Recipe", finished.substring(-2), true)
            } else {
                embed.addField("Recipe", "No crafting recipe.", true)
            }

            if (part.Malleabiltity && part.Malleability > 0) {
                embed.addField("Malleability", part.Malleability.toString(), true)
            } else {
                const size = part.DefaultSize

                embed.addField("Malleability", `Fixed size (${size[0] || "?"}, ${size[1] || "?"}, ${size[2] || "?"})`, true)
            }

            if (part.ConfigData) {
                for (const [i, data] of Object.entries(part.ConfigData)) {
                    const name = data[0]
                    const type = data[1];
                    const defaultValue = data[2];
                    const range = data[3];
                    const description = data[4];

                    if (type == "string") {
                        embed.addField(name, `${description}\n(string) default: "**${defaultValue}**"`)
                    } else if (type == "boolean") {
                        embed.addField(name, `${description}\n(boolean) default: **${defaultValue || false}**`)
                    } else if (type == "number") {
                        embed.addField(name, `${description}\n(number) default: **${defaultValue | "?"}**\nrange: ${range[0]} - ${range[1]}`)
                    } else if (type == "Coordinate") {
                        embed.addField(name, `${description}\n(Coordinates) default: **${defaultValue}**`)
                    } else if (type == "ResourceString") {
                        embed.addField(name, `${description}\n(string or URL) default: "**${defaultValue}**"`)
                    } else if (type == "MaterialToExtract") {
                        embed.addField(name, `${description}\n(MaterialToExtract) default: **${defaultValue}**`)
                    } else if (type == "Selection") {
                        embed.addField(name, `${description}\n(Selection) default: **${defaultValue}**\noptions:\n${range.join("\n")}`)
                    }
                }
            }

            interaction.reply({ embeds: [embed] })

        } else {
            interaction.reply({ content: "no part found" })
        }

        console.log(part)
    }
}
