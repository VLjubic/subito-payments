const express = require("express");
const router = express.Router();
const { Employer } = require("../models");

router.get("/", async (req, res) => {
  try {
    const employers = await Employer.findAll({ order: [["name", "ASC"]] });
    res.json(employers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const employer = await Employer.create(req.body);
    res.status(201).json(employer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
