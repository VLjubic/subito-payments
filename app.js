const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Sequelize, DataTypes, Op } = require("sequelize");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  // Serve static files from /client
  app.use(express.static(path.join(__dirname, "client/build")));
}

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

app.get("/api/entities/:type", async (req, res) => {
  let type = req.params.type;
  let categoryIDs = [];
  if (type === "gov") {
    categoryIDs = [1, 2, 3];
  } else if (type === "genius") {
    categoryIDs = [4];
  }
  const entities = await Entity.findAll({
    where: {
      categoryID: categoryIDs,
    },
  });
  res.json(entities);
});

app.post("/api/payments", async (req, res) => {
  const { entity, amount, paidDate } = req.body;
  const payment = await Payment.create({ EntityId: entity, amount, paidDate });
  res.json(payment);
});

app.get("/api/payments/overview/:type", async (req, res) => {
  let type = req.params.type;
  let categoryIDs = [];

  if (type === "gov") {
    categoryIDs = [1, 2, 3];
  } else if (type === "genius") {
    categoryIDs = [4];
  }

  try {
    // Fetch all payments for given categories
    const payments = await Payment.findAll({
      include: [
        {
          model: Entity,
          attributes: ["id", "name", "categoryID"],
          where: {
            categoryID: categoryIDs,
          },
        },
      ],
      attributes: ["id", "EntityId", "amount", "paidDate"],
      order: [["paidDate", "DESC"]],
      raw: true,
      nest: true,
    });

    const data = {};

    for (let p of payments) {
      if (!p.paidDate) continue;

      const date = new Date(p.paidDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      if (!data[year]) data[year] = {};
      if (!data[year][month]) data[year][month] = [];

      data[year][month].push({
        entity: p.Entity.name,
        amount: p.amount,
        paidDate: p.paidDate,
      });
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
