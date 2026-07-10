import "dotenv/config";
import app from "./app";
import env from "./config/env";
import { Transmission } from "./prisma/generated/enums";

const port = env.app.PORT;

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});