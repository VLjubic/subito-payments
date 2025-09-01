import React, { useEffect, useState } from "react";

export default function Entities() {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    fetch("/api/entities")
      .then((res) => res.json())
      .then(setEntities)
      .catch((err) => console.error("Error fetching entities:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Entities</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {entities.map((e) => (
            <tr key={e.id}>
              <td className="border p-2">{e.id}</td>
              <td className="border p-2">{e.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
