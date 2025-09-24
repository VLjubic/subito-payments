import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPaymentForm from "../Components/AddPaymentForm";
import PaymentOverview from "../Components/PaymentOverview";

function Genius({}) {
  const [form, setForm] = useState({
    entity: "",
    amount: "",
    paidDate: "",
  });

  const [entities, setEntities] = useState(null);
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const getEntities = async (e) => {
      const res = await fetch("/api/entities/genius", {
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

  useEffect(() => {
    fetch("/api/payments/overview/genius")
      .then((res) => res.json())
      .then((data) => {
        setGrouped(data);
      });
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
    <div className="geniusContainer">
      <PaymentOverview dates={grouped} title={"Genius ulaganja"} />
      <AddPaymentForm
        entities={entities}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        form={form}
      />
    </div>
  );
}

export default Genius;
