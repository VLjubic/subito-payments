const express = require("express");
const router = express.Router();
const { CalendarStatus } = require("../models");

function getMonthBounds(monthStr) {
  const [year, month] = monthStr.split("-").map(Number);
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0);
  const to = `${lastDay.getFullYear()}-${String(
    lastDay.getMonth() + 1
  ).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;
  return { from, to };
}

router.get("/:month", async (req, res) => {
  const { month } = req.params;
  if (!/^\d{4}-\d{2}$/.test(month))
    return res.status(400).json({ error: "Invalid format" });
  const { from, to } = getMonthBounds(month);
  try {
    const statuses = await CalendarStatus.findAll({
      where: { date: { [require("sequelize").Op.between]: [from, to] } },
      order: [["date", "ASC"]],
    });
    res.json({ statuses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/changeDayStatus", async (req, res) => {
  try {
    const { dayID, category_id } = req.body;
    if (!dayID || !category_id)
      return res.status(400).json({ error: "Missing day ID or category ID" });
    const item = await CalendarStatus.update(
      { category_id },
      { where: { id: dayID } }
    );
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
