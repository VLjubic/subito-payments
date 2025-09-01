import React, { useState } from "react";

function AddPayment() {
  const [form, setForm] = useState({
    entityId: "",
    amount: "",
    paidDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("Payment added successfully!");
      setForm({ entityId: "", amount: "", paidDate: "" });
    } else {
      alert("Error adding payment");
    }
  };

  return (
    <div>
      <h2>Add Payment</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <label>
          Entity ID:
          <input
            type="text"
            name="entityId"
            value={form.entityId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Paid Date:
          <input
            type="date"
            name="paidDate"
            value={form.paidDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPayment;
