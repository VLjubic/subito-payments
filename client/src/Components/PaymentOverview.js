import React, { useEffect, useState } from "react";

function PaymentOverview({ dates, title }) {
  const [selectedMonth, setSelectedMonth] = useState({});
  return (
    <div>
      <h2>{title}</h2>
      {Object.keys(dates).map((year) => {
        const months = Object.keys(dates[year]);
        // default: first month in array
        const activeMonth = selectedMonth[year] ?? months[0];

        return (
          <div key={year} className="year-section">
            <h3 className="year-header">{year}</h3>

            {/* Months bar */}
            <div className="months-row">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() =>
                    setSelectedMonth((prev) => ({
                      ...prev,
                      [year]: month,
                    }))
                  }
                  className={`month-link ${
                    activeMonth === month ? "active" : ""
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>

            {/* Only the selected month’s table */}
            <div
              key={activeMonth}
              id={`${year}-${activeMonth}`}
              className="month-section"
            >
              <h4 className="month-title">
                {year}-{activeMonth}
              </h4>
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Entity</th>
                    <th>Amount</th>
                    <th>Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dates[year][activeMonth].map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.entity}</td>
                      <td>{p.amount ?? "-"}</td>
                      <td>
                        {p.paidDate
                          ? new Date(p.paidDate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PaymentOverview;
