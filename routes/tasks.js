const express = require("express");
const router = express.Router();
const { Task, Employer, Subtask, JobType, Location } = require("../models");
const { Op } = require("sequelize");

router.get("/tasksByDate", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Missing date" });
  try {
    const tasks = await Task.findAll({
      where: { date },
      include: [Employer, Subtask, JobType, Location],
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/newTaskData", async (req, res) => {
  try {
    const [employers, subtasks, jobTypes, locations] = await Promise.all([
      Employer.findAll(),
      Subtask.findAll(),
      JobType.findAll(),
      Location.findAll(),
    ]);
    res.json({ employers, subtasks, jobTypes, locations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
