import React from "react";

function AddPaymentForm({ entities, handleSubmit, handleChange, form }) {
  return (
    <div>
      {!entities && <div>Loading entities</div>}{" "}
      {entities && (
        <>
          <h2>Add Payment</h2>
          <form className="payment-form" onSubmit={handleSubmit}>
            <label>
              Entity ID:
              <select
                name="entity"
                value={form.entity}
                onChange={handleChange}
                required
              >
                <option value="">-- Select an entity --</option>
                {entities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>
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
        </>
      )}
    </div>
  );
}
export default AddPaymentForm;
