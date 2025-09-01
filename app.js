const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from /client
app.use(express.static(path.join(__dirname, "client/build")));

const DB_NAME = process.env.DB_NAME || process.env.APPSETTING_DB_NAME;
const DB_USER = process.env.DB_USER || process.env.APPSETTING_DB_USER;
const DB_PASS = process.env.DB_PASS || process.env.APPSETTING_DB_PASS;
const DB_HOST = process.env.DB_HOST || process.env.APPSETTING_DB_HOST;
const DB_PORT = process.env.DB_PORT || process.env.APPSETTING_DB_PORT;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT || 3306,
});

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Entity = sequelize.define("Entity", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Payment = sequelize.define("Payment", {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  entityID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Entity.hasMany(Payment);
Payment.belongsTo(Entity);

app.get("/api/entities", async (req, res) => {
  const entities = await Entity.findAll();
  res.json(entities);
});

app.post("/api/payments", async (req, res) => {
  const { entity, amount, paidDate } = req.body;
  const payment = await Payment.create({ EntityId: entity, amount, paidDate });
  res.json(payment);
});

app.get("/api/payments/overview", async (req, res) => {
  try {
    // Get all unique (year, month) combinations from Payment.paidDate
    const payments = await Payment.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("paidDate")), "year"],
        [Sequelize.fn("MONTH", Sequelize.col("paidDate")), "month"],
      ],
      group: ["year", "month"],
      order: [
        [Sequelize.fn("YEAR", Sequelize.col("paidDate")), "ASC"],
        [Sequelize.fn("MONTH", Sequelize.col("paidDate")), "ASC"],
      ],
      raw: true,
    });

    const entities = await Entity.findAll();
    const data = [];

    for (let entry of payments) {
      const { year, month } = entry;

      for (let entity of entities) {
        const payment = await Payment.findOne({
          where: Sequelize.and(
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("paidDate")),
              month
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("paidDate")),
              year
            ),
            { EntityId: entity.id }
          ),
        });

        data.push({
          month: `${year}-${String(month).padStart(2, "0")}`,
          entity: entity.name,
          amount: payment?.amount ?? null,
          paidDate: payment?.paidDate ?? null,
        });
      }
    }

    res.json(data);
  } catch (error) {
    console.error("Error in /api/payments/overview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

sequelize
  .sync({ force: false })
  .then(() => console.log("MySQL DB synced"))
  .catch((err) => console.error("DB error:", err));

// Example POST route
app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create({ name: req.body.name });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
  // const users = await User.findAll();
  // res.json(users);
});

app.get("/vlaho", async (req, res) => {
  //res.sendFile(path.join(__dirname, 'client', 'index.html'));
  const users = await User.findAll();
  const payments = await Payment.findAll();
  const entities = await Entity.findAll();
  res.json({ data: { users: users, payments: payments, entities: entities } });
});

app.get("/testing", async (req, res) => {
  let testing = { message: "This is a test!" };
  res.json(testing);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
