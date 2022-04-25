const { Collection } = require("discord.js")
const { cooldown } = require("../commands/test")

module.exports = async (client, interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!interaction.guild) return
        if (!client.commands.has(interaction.commandName)) return

        const command = client.commands.get(interaction.commandName)
        try {
            if (!cooldowns.has(command.name)) { cooldowns.set(command.name, new Collection()) }
            
            const now = Date.now()
            const timestamps = cooldowns.get(command.name)
            const cooldownAmount = command.cooldown || (1 * 1000)

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000
                    return interaction.reply({ content: `wait ${timeLeft.toFixed(1)} more second(s)`, ephemeral: true })
                }
            }
            
            timestamps.set(interaction.user.id, now)
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
            if (command.permissions) {
                if (!interaction.member.permissions.has(command.permissions)) {
                    return interaction.reply({ content: `you're missing permissions [${command.permissions.map(p => `\`${p}\``).join(", ") }]`, ephemeral: true })
                }
            }

            command.run(client, interaction)
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: "an error occured!!!" })
        }
    }
}