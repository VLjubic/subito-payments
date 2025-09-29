const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_KEY;

// Middleware
app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  // Serve static files from /client
  app.use(express.static(path.join(__dirname, "client/build")));
}
const { User, Payment, Entity, sequelize, Sequelize } = db;

const calendarRoutes = require("./routes/calendar");
const tasksRoutes = require("./routes/tasks");
const adminRoutes = require("./routes/admin");

app.use("/api/calendar", calendarRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/admin", adminRoutes);

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  console.log(username, password, hashed);

  await User.create({
    name: username,
    username,
    password: hashed,
  });

  res.json({ success: true });
});

// Verify token
app.get("/api/verifyToken", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Invalid token" });
  }
});

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
