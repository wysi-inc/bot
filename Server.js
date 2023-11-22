import { auth } from "osu-api-extended";
import mysql from "mysql2";

class Server {
  constructor() {
    this.database();
    this.osuApi();
  }

  async database() {
    this.mysqldb = mysql
      .createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      })
      .promise();
      console.log("Connected to SQL database");
  }

  async osuApi() {
    await auth.login(process.env.OSU_CLIENT_ID, process.env.OSU_CLIENT_SECRET, [
      "public",
    ]);
    console.log("Logged into Application");

    setInterval(() => this.login(), 1000 * 60 * 60 * 24);
  }
}

const srv = new Server();
export default srv;