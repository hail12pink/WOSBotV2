const {MessageEmbed} = require("discord.js")
const fetch = require("node-fetch")

function componentToHex(c) { // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) { // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

async function searchPart(part, parts, amnt, cur) {
	cur = cur || {}
	amnt = amnt || 1

	for (const [i, item] of Object.entries(part.Recipe)) {
		const entry = parts[item[0]]

		if (entry) {
			cur[item[0]] = (cur[item[0]] || 0) + amnt * item[1]
			
			if (entry.Recipe) {
				cur = await searchPart(entry, parts, amnt * item[1], cur)
			}
		}
	}
	
	console.log("cur:")
	console.log(cur)
	return cur
}

module.exports = {
	name: "factorize",
	description: "tells you what you need to make a factory for given part",
	cooldown: 1,
	guilds: [],
	permissions: [],
	options: [{
		name: "part",
		description: "The part's name.",
		type: 3,
		required: true
	},
	{
		name: "amount",
		description: "The amount of desired parts to be made per second.",
		type: 4,
		required: false
	}],

	run: async (client, interaction) => {
		const user = interaction.user
		const parts = await (await fetch("http://12pink.dev/data/parts.json")).json()
		let partName = interaction.options.getString("part")
		let amount = interaction.options.getString("amount") || 1
		let part = null

		for (const [partN, partI] of Object.entries(parts)) {
			if (partName.toLowerCase() == partN.toLowerCase()) {
				part = partI;
				partName = partN;
				break
			}
		}

		if (part) {
			console.log(interaction.user)

			const embed = new MessageEmbed()
			.setColor(rgbToHex(part.DefaultColor))
			.setTitle(`Machinery required for ${partName} factory making ${amount} per second`)
			.setFooter({
				text: `${user.username}#${user.discriminator}`,
				iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
			})
			
			if (part.Recipe) {
				let requiredMachinery = await searchPart(part, parts, amount)
				console.log(requiredMachinery)
				let assemblerString = ""
				let assemblerCost = 0
				let miningString = ""
				let miningCost = 0

				for (const [itemName, itemAmount] of Object.entries(requiredMachinery)) {
					console.log(itemName)
					let part = parts[itemName]
					
					if (part.Recipe) {
						assemblerString += `\n**${itemName}** x${itemAmount}`
						assemblerCount += itemAmount
					} else {
						miningString += `\n**${itemName}** x${itemAmount / 2}`
						miningCount += itemAmount
					}
				}

				embed.setDescription(`**__Mining Lasers__**\n${miningString}**\n\n__Assemblers__\n**${assemblerString}\n\nPower Cost: ${(25 * miningCost) + (12 * assemblerCost)}/s`)
			} else {
				embed.setDescription(`${partName} MiningLaser x${amount}`)
			}

			return interaction.reply({
				embeds: [embed]
			})

		} else {
			interaction.reply({content: "no part found"})
		}

		console.log(part)
	}
}
