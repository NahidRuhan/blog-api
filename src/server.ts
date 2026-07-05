import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
import "dotenv/config";

const PORT = config.port;

function main() {
  try {
    app.listen(PORT, () => {
      console.log(`
                🚀 Server is running on port ${PORT}
            `);
    });
  } catch (error) {
    console.error("❌ Something went wrong", error);
    process.exit(1);
  }
}

main();

export default app;
