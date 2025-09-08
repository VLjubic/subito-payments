import React, { useEffect, useState } from "react";

function Login({ setLogedIn }) {
  const [form, setForm] = useState({
    password: "",
  });

  useEffect(() => {}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password === "123123") {
      setLogedIn(true);
    } else {
      alert("Wrong password");
      setForm({ password: "" });
    }
  };

  return (
    <div>
      <form className="payment-form" onSubmit={handleSubmit}>
        <label>
          Password:
          <input
            type="text"
            name="password"
            value={form.password}
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

export default Login;
