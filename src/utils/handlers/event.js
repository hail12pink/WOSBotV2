const fs = require("fs")

module.exports = async (client) => {
    fs.readdir(`${__dirname}/../../events/`, (err, events) => {
        if (err) console.error(err)
        events.forEach(file => {
            const event = require(`../../events/${file}`)
            let eventName = file.split(".")[0]
            client.on(eventName, event.bind(null, client))

            console.log(`loaded event '${file}'`)
        })
    })
}