const express = require("express");
const router = express.Router();
const db = require("../models");

const allowed = {
  employers: db.Employer,
  job_types: db.JobType,
  locations: db.Location,
  subtasks: db.Subtask,
  tasks: db.Task,
  calendarStatusCategories: db.CalendarStatusCategory,
};

router.get("/:entity", async (req, res) => {
  const Model = allowed[req.params.entity];
  if (!Model) return res.status(400).json({ error: "Unknown entity" });
  try {
    const items = await Model.findAll({ order: [["id", "DESC"]] });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/:entity", async (req, res) => {
  const Model = allowed[req.params.entity];
  if (!Model) return res.status(400).json({ error: "Unknown entity" });
  try {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.put("/:entity/:id", async (req, res) => {
  const Model = allowed[req.params.entity];
  if (!Model) return res.status(400).json({ error: "Unknown entity" });
  try {
    const [updated] = await Model.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.delete("/:entity/:id", async (req, res) => {
  const Model = allowed[req.params.entity];
  if (!Model) return res.status(400).json({ error: "Unknown entity" });
  try {
    await Model.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
