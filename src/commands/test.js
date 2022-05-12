module.exports = {
    name: "test",
    description: "this is a test obviously",
    cooldown: 1,
	guilds: [],
    permissions: [],
    options: [],

    run: async(client, interaction) => {
        interaction.reply({content: "get real."})
    }
}
