const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",
    description: "Get a list of commands.",
    usage: `/help [command]`,
    options: [
        {
            name: "command",
            description: "The command to get help for.",
            type: 3,
            required: false,
        },
    ],
    run: async (client, interaction) => {
        const command = interaction.options.get("command")?.value;
        if (command) {
            const cmd = client.commands.get(command);
            if (!cmd) return interaction.followUp({ content: `Invalid command!` });
            const commandEmbed = new EmbedBuilder()
            .setColor(`Aqua`)
            .setTitle(`${cmd.name}`)
            .addFields(
                { name: `Description`, value: `${cmd.description ?? "None"}`, inline: true },
                { name: `Usage`, value: `${cmd.usage ?? `/${cmd.name}`}`, inline: true },
            )
            .setFooter({ text: `Kurbys`, iconURL: `https://cdn.discordapp.com/attachments/1202445750538342440/1210360411321409598/9cce8e1553b9646cd1765813fe5ffe92_1.png?ex=65ea46f9&is=65d7d1f9&hm=0d81a8f13d053e0879a9bc7993552b1724548e32cdcf25ca04e053aeeef7e47c&` })
            .setTimestamp();
            return interaction.followUp({ embeds: [commandEmbed] });
        }
        const commands = client.commands.map((cmd) => `**${cmd.name}** - ${cmd.description}`);
        const helpEmbed = new EmbedBuilder()
        .setColor(`Aqua`)
        .setTitle(`${client.user.tag}'s Commands`)
        .setDescription(`${commands.join("\n")}`)
        .setFooter({ text: `kurbys`, iconURL: `https://cdn.discordapp.com/attachments/1202445750538342440/1210360411321409598/9cce8e1553b9646cd1765813fe5ffe92_1.png?ex=65ea46f9&is=65d7d1f9&hm=0d81a8f13d053e0879a9bc7993552b1724548e32cdcf25ca04e053aeeef7e47c&` })
        .setTimestamp();
        return interaction.followUp({ embeds: [helpEmbed] });
    }
};