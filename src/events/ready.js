module.exports = async(client) => {
    client.user.setActivity(`testing v2`, { type: 4 })

    console.log(`online!`)
}