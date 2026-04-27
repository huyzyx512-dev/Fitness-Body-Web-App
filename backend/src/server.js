import app from "./app.js";
import { appConfig } from "./config/env.js";

app.listen(appConfig.port, () => {
  console.log(`Server running on http://localhost:${appConfig.port}`);
});
