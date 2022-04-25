const fs = require("fs")

module.exports = async (client) => {
    fs.readdir(`${__dirname}/../../commands/`, (err, commands) => {
        if (err) console.error(err)
        commands.forEach(cmd => {
            const props = require(`${__dirname}/../../commands/${cmd}`)
            client.commands.set(props.name, props)

            console.log(`loaded command '${cmd}'`)
        })
    })
}