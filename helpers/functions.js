export function getUserEmbed(user) {
    return {
        color: 0x555a74,
        title: user.username,
        url: `https://wysi727.com/users/${user.id}`,
        thumbnail: {
          url: user.avatar_url,
        },
        fields: [
          {
            name: "Global Rank:",
            value: `#${user.statistics.global_rank}`,
            inline: true,
          },
          {
            name: "Country Rank:",
            value: `#${user.statistics.country_rank}`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "wysi727.com",
        },
      }
}