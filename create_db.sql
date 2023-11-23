CREATE DATABASE wysi;

use wysi;

CREATE TABLE
    discord_users (
        discord_id varchar(255) PRIMARY KEY,
        osu_id int(32)
)