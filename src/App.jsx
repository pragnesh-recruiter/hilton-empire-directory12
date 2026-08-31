import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import DashboardStats from "./components/DashboardStats";
import SearchBar from "./components/SearchBar";
import ApartmentCard from "./components/ApartmentCard";
import EmergencyContacts from "./components/EmergencyContacts";

const CSV_URL = import.meta.env.VITE_CSV_URL || "";

// Pulls the first valid 10-digit Indian mobile number out of a messy cell
// (handles cases like "9824804174 7802908006" or numbers split across lines)
function extractFirstPhone(raw) {
  if (!raw) return "";
  const match = raw.toString().match(/\d{10}/);
  return match ? match[0] : raw.toString().trim();
}

// Columns in the sheet, by position (0-indexed):
// 0 FlatNo | 1 OwnerName | 2 OwnerPhone | 3 Type | 4 TenantName | 5 TenantPhone
// 6 Members | 7 NativePlace | 8 TwoWheelerCount | 9 FourWheelerCount
// 10 TwoWheelNo1 | 11 TwoWheelNo2 | 12 TwoWheelNo3 | 13 FourWheelNo1 | 14 FourWheelNo2
function normalizeRow(cols) {
  const flatNo = (cols[0] || "").toString().trim();
  const ownerName = (cols[1] || "").toString().trim();
  const ownerPhone = extractFirstPhone(cols[2]);
  const type = (cols[3] || "").toString().trim();
  const tenantName = (cols[4] || "").toString().trim();
  const tenantPhone = extractFirstPhone(cols[5]);
  const members = Number(cols[6]) || 0;
  const nativePlace = (cols[7] || "").toString().trim();
  const twoWheeler = Number(cols[8]) || 0;
  const fourWheeler = Number(cols[9]) || 0;

  const vehicles = [cols[10], cols[11], cols[12], cols[13], cols[14]]
    .map(v => (v || "").toString().trim())
    .filter(v => v.length > 0);

  const isTenant = type.includes("ભાડુઆત") || tenantName.length > 0;
  const contact = isTenant && tenantPhone ? tenantPhone : ownerPhone;

  return {
    flatNo,
    ownerName,
    tenantName,
    type: isTenant ? "ભાડુઆત" : "માલિક",
    contact,
    members,
    twoWheeler,
    fourWheeler,
    vehicleNo: vehicles.join(", "),
    nativePlace,
  };
}

export default function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("બધા");

  useEffect(() => {
    if (!CSV_URL) {
      console.warn("VITE_CSV_URL not set");
      return;
    }
    Papa.parse(CSV_URL, {
      download: true,
      header: false,
      skipEmptyLines: true,
      complete: results => {
        const rows = results.data;
        // Row 0 = building title, Row 1 = column headers -> skip both
        const dataRows = rows.slice(2);

        const cleaned = dataRows
          .map(normalizeRow)
          // drop empty rows and the totals row at the bottom
          .filter(r => r.flatNo && r.flatNo.startsWith("B-"));

        setData(cleaned);
      },
      error: err => console.error("CSV parse error", err)
    });
  }, []);

  const filtered = useMemo(() => {
    let result = data;

    // Filter by owner/tenant type
    if (filterType !== "બધા") {
      result = result.filter(d => d.type === filterType);
    }

    // Then apply search on top
    const q = query.trim().toLowerCase();
    if (!q) return result;
    return result.filter(d => {
      return (d.flatNo && d.flatNo.toLowerCase().includes(q))
        || (d.ownerName && d.ownerName.toLowerCase().includes(q))
        || (d.tenantName && d.tenantName.toLowerCase().includes(q))
        || (d.vehicleNo && d.vehicleNo.toLowerCase().includes(q))
        || (d.nativePlace && d.nativePlace.toLowerCase().includes(q));
    });
  }, [data, query, filterType]);

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center gap-4 mb-6">
        <img src="/logo.png" alt="logo" className="w-16 h-16 object-contain" />
        <div>
          <h1 className="text-2xl font-semibold">Hilton Empire Directory</h1>
          <p className="text-sm text-gray-300">Hilton Empire B Wing — Residency Directory</p>
        </div>
      </header>

      <DashboardStats data={data} />

      <div className="my-6">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by flat, name, vehicle or native place..." />
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {["બધા", "માલિક", "ભાડુઆત"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-6 py-2 rounded-lg font-semibold border transition-all ${
              filterType === type
                ? "bg-yellow-600 text-black border-yellow-600"
                : "bg-transparent text-yellow-500 border-yellow-600/50 hover:bg-yellow-600/10"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mb-4 text-yellow-400 font-semibold">
        કુલ પરિણામો: {filtered.length}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => <ApartmentCard key={item.flatNo} item={item} />)}
      </div>

      <div className="mt-8">
        <EmergencyContacts />
      </div>
    </div>
  );
}
