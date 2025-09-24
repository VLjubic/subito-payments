import React, { useEffect, useState } from "react";
import AddPaymentForm from "../Components/AddPaymentForm";
import PaymentOverview from "../Components/PaymentOverview";

function Company() {
  const [form, setForm] = useState({
    entity: "",
    amount: "",
    paidDate: "",
  });

  const [entities, setEntities] = useState(null);
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    fetch("/api/payments/overview/gov")
      .then((res) => res.json())
      .then((data) => {
        setGrouped(data);
      });
  }, []);

  useEffect(() => {
    const getEntities = async (e) => {
      const res = await fetch("/api/entities/gov", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setEntities(data);
      } else {
        alert("Error getting entities");
      }
    };

    getEntities();
  }, []);

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
      setForm({ entity: "", amount: "", paidDate: "" });
    } else {
      alert("Error adding payment");
    }
  };

  return (
    <div className="overviewContainer">
      <PaymentOverview dates={grouped} title={"Davanja za obrt"} />
      <AddPaymentForm
        entities={entities}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        form={form}
      />
    </div>
  );
}

export default Company;
