import React from "react";

export default function DashboardStats({data=[]}){
  const totalFlats = data.length;
  const totalMembers = data.reduce((s, r) => s + (Number(r.members) || 0), 0);
  const totalOwners = data.filter(d => {
    const t = (d.type || "").toString().toLowerCase();
    return t.includes("મલિક") || t.includes("owner") || (d.ownerName && !d.tenantName);
  }).length;
  const totalTenants = data.filter(d => {
    const t = (d.type || "").toString().toLowerCase();
    return t.includes("ભાડુઆત") || t.includes("tenant") || Boolean(d.tenantName);
  }).length;
  const total2 = data.reduce((s, r) => s + (Number(r.twoWheeler) || 0), 0);
  const total4 = data.reduce((s, r) => s + (Number(r.fourWheeler) || 0), 0);

  const card = (title, value) => (
    <div className="card p-4 rounded shadow-sm">
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
      {card("Total Apartments", totalFlats)}
      {card("Total સભ્ય", totalMembers)}
      {card("Total મલિક", totalOwners)}
      {card("Total ભાડુઆત", totalTenants)}
      {card("Total Two Wheeler", total2)}
      {card("Total Four Wheeler", total4)}
    </div>
  );
}
