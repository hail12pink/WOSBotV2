const { MessageEmbed, Message } = require("discord.js")
const fetch = require("node-fetch")

function componentToHex(c) { // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

function rgbToHex(rgb) { // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

module.exports = {
    name: "getpart",
    description: "gets information about a waste of space part",
    cooldown: 1,
    permissions: [],
    options: [
        {
            "name": "part",
            "description": "The part's name.",
            "type": 3,
            "required": true
        }
    ],

    run: async(client, interaction) => {
        const parts = await (await fetch("http://12pink.dev/data/parts.json")).json()
        const partName = interaction.options.getString("part")
        const user = interaction.user
        const part = parts[partName]

        if (part) {
            console.log(interaction.user)

            const embed = new MessageEmbed
            embed.setColor(rgbToHex(part.DefaultColor))
            embed.setTitle(partName)
            embed.setDescription(part.Description || "[ No description entry ]")
            embed.setFooter({ text: `${user.username}#${user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` })

            if (part.Recipe) {
                let finished = ""

                part.Recipe.map(async (item) => {
                    console.log(item)
                    finished += `${item[0]}: ${item[1]}\n`
                })

                embed.addField("Recipe", finished.substring(-2))
            } else {
                embed.addField("Recipe", "No crafting recipe.")
            }

            if (part.Malleabiltity && part.Malleability > 0) {
                embed.addField("Malleability", part.Malleability.toString())
            } else {
                const size = part.DefaultSize

                embed.addField("Malleability", `Fixed size (${size[0] || "?"}, ${size[1] || "?"}, ${size[2] || "?"})`)
            }

            embed.addField("State", part.ClassState)

            embed.addField("Flammable", String(part.Flammable || false))

            if (part.ConfigData) {
                for (const [i, data] of Object.entries(part.ConfigData)) {
                    const name = data[0]
                    const type = data[1];
                    const defaultValue = data[2];
                    const range = data[3];
                    const description = data[4];

                    if (type == "string") {
                        embed.addField(name, `${description}\nstring \ndefault: "**${defaultValue}**"`)
                    } else if (type == "ResourceString") {
                        embed.addField(name, `${description}\nstring or URL\ndefault: "**${defaultValue}**"`)
                    } else if (type == "boolean") {
                        embed.addField(name, `${description}\nboolean\ndefault: **${defaultValue || false}**`)
                    } else if (type == "number") {
                        embed.addField(name, `${description}\nnumber\ndefault: **${defaultValue| "?"}**`)
                    } else if (type == "Coordinate") {
                        embed.addField(name, `${description}\nCoordinates\ndefault: **${defaultValue}**`)
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