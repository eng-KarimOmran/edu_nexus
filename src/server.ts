import "dotenv/config";
import app from "./app";
import env from "./config/env";

const port = env.app.PORT;

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});