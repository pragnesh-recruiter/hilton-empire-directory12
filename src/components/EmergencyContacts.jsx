import React from "react";
export default function EmergencyContacts(){
  const contacts = [
    { role: "President", name: "President Name", phone: "9999999999" },
    { role: "Lift", name: "Lift Technician", phone: "9999999999" },
    { role: "Electrician", name: "Electrician", phone: "9999999999" },
    { role: "Plumber", name: "Plumber", phone: "9999999999" },
    { role: "Nearby Rickshaw", name: "Rickshaw Driver", phone: "9999999999" },
  ];

  return (
    <div className="card p-4 rounded mt-6">
      <h3 className="text-lg font-semibold">Emergency Contacts</h3>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {contacts.map(c => (
          <div key={c.role} className="p-2 border rounded">
            <div className="text-sm font-medium">{c.role}: {c.name}</div>
            <a href={`tel:${c.phone}`} className="text-sm">{c.phone}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
