import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setLogedIn }) {
  const [form, setForm] = useState({
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password === "123123") {
      setLogedIn(true);
      navigate("/overview");
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
