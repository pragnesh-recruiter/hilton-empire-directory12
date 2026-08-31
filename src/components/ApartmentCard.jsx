import React from "react";
import { Phone, MessageCircle, Users, MapPin, Bike, Car, Home } from "lucide-react";

export default function ApartmentCard({item}) {
  const isTenant = item.type === "tenant";
  const primaryName = isTenant ? item.tenantName : item.ownerName;
  const secondaryName = isTenant ? item.ownerName : "";

  const phone = (item.contact || "").toString();
  const digits = phone.replace(/[^0-9+]/g, "");
  const whatsappHref = phone ? `https://wa.me/91${digits.replace(/^\+/, "")}` : "#";
  const telHref = phone ? `tel:${digits}` : "#";

  const vehicles = (item.vehicleNo || "")
    .split(",")
    .map(v => v.trim())
    .filter(v => v.length > 0);

  return (
    <div className="bg-black rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-5 border-l-4 border-yellow-600">
      {/* Header: flat number + type badge */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Home className="text-yellow-600" size={24} />
          <h3 className="text-2xl font-bold text-yellow-400">{item.flatNo}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isTenant ? "bg-orange-900/40 text-orange-300" : "bg-yellow-900/40 text-yellow-300"
        }`}>
          {isTenant ? "ભાડુઆત" : "માલિક"}
        </span>
      </div>

      {/* Names */}
      <div className="mb-3">
        <p className="text-lg font-semibold text-yellow-400">{primaryName || "—"}</p>
        {secondaryName && (
          <p className="text-sm text-yellow-600/80">માલિક: {secondaryName}</p>
        )}
      </div>

      {/* Call / WhatsApp buttons */}
      {phone && (
        <div className="flex gap-2 mb-4">
          <a
            href={telHref}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Phone size={18} />
            <span className="font-semibold">કૉલ કરો</span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <MessageCircle size={18} />
            <span className="font-semibold">WhatsApp</span>
          </a>
        </div>
      )}

      {/* Details: members, native place, vehicles - each with icon */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-yellow-400">
          <Users size={16} className="text-yellow-600" />
          <span>સભ્યો: {item.members || 0}</span>
        </div>

        {item.nativePlace && (
          <div className="flex items-center gap-2 text-yellow-400">
            <MapPin size={16} className="text-yellow-600" />
            <span>{item.nativePlace}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-yellow-400">
          <Bike size={16} className="text-yellow-600" />
          <span>{item.twoWheelNos ? item.twoWheelNos : "—"}</span>
        </div>

        <div className="flex items-center gap-2 text-yellow-400">
          <Car size={16} className="text-yellow-600" />
          <span>{item.fourWheelNos ? item.fourWheelNos : "—"}</span>
        </div>
      </div>
    </div>
  );
}
