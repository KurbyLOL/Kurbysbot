const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "play",
    description: "Play (a) track/tracks!",
    usage: `/play <query>`,
    options: [
        {
            name: "query",
            description: `The query to look for.`,
            type: 3,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.voice.channelId) return await interaction.followUp({ content: "You are not in a voice channel!", ephemeral: true });
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.followUp({ content: "You are not in my voice channel!", ephemeral: true });
        const query = interaction.options.getString("query");
        const results = await client.player.search(query, {
            requestedBy: interaction.user,
        })
        .catch(() => {});
        if (!results || !results.tracks.length) return interaction.followUp({ content: `No results found with your query.` });
        const queue = await client.player.createQueue(interaction.guild, {
            ytdlOptions: {
                filter: 'audioonly',
                highWaterMark: 1 << 30,
                dlChunkSize: 0,
            },
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destory();
            return interaction.followUp({ content: `Unable to join your voice channel!` });
        }

        if (results.playlist) {
            queue.addTracks(results.tracks);
            const response = config.messages.playlistLoad || `⏳ Adding **{PLAYLIST.TITLE}**...`;
            response.replace("{PLAYLIST}", `${results.playlist.title}`);
            response.replace("{PLAYLIST.TITLE}", `${results.playlist.title}`);
            response.replace("{PLAYLIST.LINK}", `${results.playlist.url}`);
            const playlistEmbed = new EmbedBuilder()
            .setColor(`Aqua`)
            .setDescription(`${response
                .replace("{PLAYLIST}", `${results.playlist.title}`)
                .replace("{PLAYLIST.TITLE}", `${results.playlist.title}`)
                .replace("{PLAYLIST.LINK}", `${results.playlist.url}`)
            }`)
            .setFooter({ text: `kurbys`, iconURL: `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png` })
            .setTimestamp();
            interaction.followUp({ embeds: [playlistEmbed] });
        } else {
            queue.addTrack(results.tracks[0]);
            const response = config.messages.trackLoad || `⏳ Adding **{TRACK.TITLE}**...`;
            const trackEmbed = new EmbedBuilder()
            .setColor(`Aqua`)
            .setDescription(`${response
                .replace("{TRACK}", `${results.tracks[0].title}`)
                .replace("{TRACK.TITLE}", `${results.tracks[0].title}`)
                .replace("{TRACK.LINK}", `${results.tracks[0].url}`)}`)
            .setFooter({ text: `https://github.com/Skyy2K/MusicBot`, iconURL: `https://cdn.discordapp.com/attachments/1202445750538342440/1210360411321409598/9cce8e1553b9646cd1765813fe5ffe92_1.png?ex=65ea46f9&is=65d7d1f9&hm=0d81a8f13d053e0879a9bc7993552b1724548e32cdcf25ca04e053aeeef7e47c&` })
            .setTimestamp();
            interaction.followUp({ embeds: [trackEmbed] });
        };

        if (!queue.playing) await queue.play();
    }
};