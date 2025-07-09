const app = require("./app");
const sequelize = require("./config/db");

const PORT = 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });
