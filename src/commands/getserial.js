module.exports = {
    name: "getserial",
    description: "[among us empire command] gets information the ship assigned to the specified serial",
    cooldown: 1,
    permissions: [],
    roles: ["967123426533855232"],
    options: [
        {
            name: "serial",
            description: "the serial to lookup",
            type: 3,
            required: true
        }
    ],

    run: async (client, interaction) => {
        console.log("not even real yet")
    }
}