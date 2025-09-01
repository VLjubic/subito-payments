import React, { useEffect, useState } from "react";

function Overview() {
  const [payments, setPayments] = useState([]);
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    fetch("/api/payments/overview")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        const groupedData = data.reduce((acc, item) => {
          const [year, month] = item.month.split("-");
          if (!acc[year]) acc[year] = {};
          if (!acc[year][month]) acc[year][month] = [];
          acc[year][month].push(item);
          return acc;
        }, {});
        setGrouped(groupedData);
      });
  }, []);

  return (
    <div>
      <h2>Payments Overview</h2>
      {Object.keys(grouped).map((year) => (
        <div key={year} className="year-section">
          <h3 className="year-header">{year}</h3>
          <div className="months-row">
            {Object.keys(grouped[year]).map((month) => (
              <a key={month} href={`#${year}-${month}`} className="month-link">
                {month}
              </a>
            ))}
          </div>
          {Object.keys(grouped[year]).map((month) => (
            <div key={month} id={`${year}-${month}`} className="month-section">
              <h4 className="month-title">
                {year}-{month}
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
                  {grouped[year][month].map((p, idx) => (
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
          ))}
        </div>
      ))}
    </div>
  );
}

export default Overview;
