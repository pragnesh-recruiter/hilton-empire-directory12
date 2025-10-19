import React from "react";
import { Phone, MessageCircle } from "lucide-react";

export default function ApartmentCard({item}) {
  const isTenant = item.tenantName && item.tenantName.length > 0;
  const primaryName = isTenant ? item.tenantName : item.ownerName;
  const secondaryName = isTenant ? item.ownerName : "";

  const phone = (item.contact || "").toString();
  const digits = phone.replace(/[^0-9+]/g, "");
  const whatsappHref = phone ? `https://wa.me/${digits.replace(/^\+/, "")}` : "#";
  const telHref = phone ? `tel:${digits}` : "#";

  return (
    <div className="card p-4 rounded">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-semibold">{item.flatNo}</div>
          <div className="text-md">{primaryName || "—"}</div>
          {secondaryName && <div className="text-sm opacity-80">માલિક: {secondaryName}</div>}
        </div>
        <div className="text-right">
          <div className="text-sm">સભ્ય: {item.members || 0}</div>
          <div className="text-sm">🛵 {item.twoWheeler || 0} &nbsp; 🚗 {item.fourWheeler || 0}</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <a href={telHref} className="flex items-center gap-2 px-3 py-2 rounded border hover:opacity-90">
          <Phone size={16}/> Call
        </a>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded border hover:opacity-90">
          <MessageCircle size={16}/> WhatsApp
        </a>
        {item.vehicleNo && <div className="ml-auto text-sm">Vehicle: {item.vehicleNo}</div>}
      </div>

      <div className="mt-2 text-xs opacity-80">Native: {item.nativePlace || "—"}</div>
    </div>
  );
}
