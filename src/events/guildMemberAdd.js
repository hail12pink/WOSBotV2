const welcomeMessages = ["@user sussy", "@user is among us", "@user i love among us", "@user joined the among us lobby", "@user sussy baka", "@user play among us with me please i'm desperate"]

module.exports = async (client, guildMember) => {
    const guild = guildMember.guild

    //console.log(guildMember)
    //console.log(guild.channels.cache)

    if (guild == "661575869118283787") {
        const channel = guild.channels.cache.get("752562855051657286")

        min = 0
        max = welcomeMessages.length
        num = Math.floor(Math.random() * (max - min + 1)) + min

        const msg = welcomeMessages[num].replace("@user", `<@${guildMember.id}>`)

        console.log(num)
        console.log(msg)

        channel.send(msg)
    }
}