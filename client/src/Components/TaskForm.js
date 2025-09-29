// client/src/components/TaskForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function TaskForm({ prefillDate }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: prefillDate,
    employer_id: "",
    subtask_id: "",
    minutes: "",
    description: "",
    location_id: "",
    job_type_id: "",
    user_id: null,
  });

  const [meta, setMeta] = useState({
    employers: [],
    subtasks: [],
    jobTypes: [],
    locations: [],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/api/tasks/newTaskData");
        setMeta(res.data);
      } catch (err) {
        console.error("Error loading task meta", err);
      }
    };
    fetch();
  }, []);

  // filter subtasks for selected employer
  const filteredSubtasks = form.employer_id
    ? meta.subtasks.filter(
        (s) => String(s.employer_id) === String(form.employer_id)
      )
    : meta.subtasks;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm((prev) => ({
      ...prev,
      minutes: "",
      description: "",
      subtask_id: "",
      employer_id: "",
      job_type_id: "",
      location_id: "",
      date: prefillDate || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tasks", form);
      alert("Task added");
      resetForm();
      navigate("/workCalendar"); // go back to calendar
    } catch (err) {
      console.error("Error adding task", err);
      alert("Failed to add task");
    }
  };

  return (
    <div className="taskFormContainer">
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit} className="taskForm">
        <div className="addTaskFormLeftWrapper">
          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Employer
            <select
              name="employer_id"
              value={form.employer_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Employer</option>
              {meta.employers.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subtask
            <select
              name="subtask_id"
              value={form.subtask_id}
              onChange={handleChange}
            >
              <option value="">Select Subtask</option>
              {filteredSubtasks.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="addTaskFormRightWrapper">
          <label>
            Minutes
            <input
              type="number"
              name="minutes"
              value={form.minutes}
              onChange={handleChange}
              min="1"
              required
            />
          </label>

          <label>
            Job type
            <select
              name="job_type_id"
              value={form.job_type_id}
              onChange={handleChange}
            >
              <option value="">Select Job Type</option>
              {meta.jobTypes.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Location
            <select
              name="location_id"
              value={form.location_id}
              onChange={handleChange}
            >
              <option value="">Select Location</option>
              {meta.locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="addTaskFormButtonsWrapper">
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <div className="formActionButtons">
            <button type="submit">Add Task</button>
            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
