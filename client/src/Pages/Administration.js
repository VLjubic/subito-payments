// client/src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Administration() {
  const [data, setData] = useState({});
  const [form, setForm] = useState({});
  const [selectedEmployer, setSelectedEmployer] = useState("");
  const entities = ["employers", "job_types", "locations", "subtasks"];

  useEffect(() => {
    entities.forEach(async (entity) => {
      try {
        const res = await axios.get(`/api/admin/${entity}`);
        setData((prev) => ({ ...prev, [entity]: res.data }));
      } catch (err) {
        console.error("Load entity error", entity, err);
      }
    });
  }, []);

  const handleChange = (e, entity) => {
    setForm((prev) => ({
      ...prev,
      [entity]: { ...(prev[entity] || {}), [e.target.name]: e.target.value },
    }));
  };

  const handleAdd = async (entity) => {
    try {
      if (entity === "subtasks") {
        const { employer_id, name } = form[entity] || {};
        if (!name) return alert("Provide name");
        await axios.post(`/api/admin/${entity}`, {
          employer_id: employer_id || null,
          name,
        });
      } else if (entity === "tasks") {
        const payload = form[entity] || {};
        await axios.post(`/api/admin/${entity}`, payload);
      } else {
        const { name } = form[entity] || {};
        if (!name) return alert("Provide name");
        await axios.post(`/api/admin/${entity}`, { name });
      }
      const res = await axios.get(`/api/admin/${entity}`);
      setData((prev) => ({ ...prev, [entity]: res.data }));
      setForm((prev) => ({ ...prev, [entity]: {} }));
    } catch (err) {
      console.error("Add error", err);
      alert("Add failed");
    }
  };

  const handleDelete = async (entity, id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`/api/admin/${entity}/${id}`);
    const res = await axios.get(`/api/admin/${entity}`);
    setData((prev) => ({ ...prev, [entity]: res.data }));
  };

  const handleEdit = async (entity, id) => {
    const newName = window.prompt("New name:");
    if (!newName) return;
    await axios.put(`/api/admin/${entity}/${id}`, { name: newName });
    const res = await axios.get(`/api/admin/${entity}`);
    setData((prev) => ({ ...prev, [entity]: res.data }));
  };

  return (
    <div className="admin-root">
      {entities.map((e) => (
        <div key={e} className="adminEntityCard">
          <h3>{e.replace("_", " ")}</h3>

          <div className="addEntityContainer">
            {e === "subtasks" ? (
              <>
                <select
                  name="employer_id"
                  value={form[e]?.employer_id || ""}
                  onChange={(ev) => handleChange(ev, e)}
                >
                  <option value="">Select employer</option>
                  {(data.employers || []).map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
                <input
                  name="name"
                  placeholder="Subtask name"
                  value={form[e]?.name || ""}
                  onChange={(ev) => handleChange(ev, e)}
                />
              </>
            ) : e === "tasks" ? (
              <>
                <input
                  name="date"
                  type="date"
                  value={form[e]?.date || ""}
                  onChange={(ev) => handleChange(ev, e)}
                />
                <input
                  name="minutes"
                  type="number"
                  placeholder="minutes"
                  value={form[e]?.minutes || ""}
                  onChange={(ev) => handleChange(ev, e)}
                />
                <input
                  name="description"
                  placeholder="description"
                  value={form[e]?.description || ""}
                  onChange={(ev) => handleChange(ev, e)}
                />
              </>
            ) : (
              <input
                name="name"
                placeholder="Name"
                value={form[e]?.name || ""}
                onChange={(ev) => handleChange(ev, e)}
              />
            )}
            <button onClick={() => handleAdd(e)}>Add</button>
          </div>

          <ul className="entityListAdmin">
            {(data[e] || []).map((item) => (
              <li key={item.id} className="entityItem">
                <span>{item.name || `${item.id}`}</span>
                <div className="entityAdminButtonsWrapper">
                  <button onClick={() => handleEdit(e, item.id)}>Edit</button>
                  <button onClick={() => handleDelete(e, item.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Administration;
