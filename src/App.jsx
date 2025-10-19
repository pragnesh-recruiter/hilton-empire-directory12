import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import DashboardStats from "./components/DashboardStats";
import SearchBar from "./components/SearchBar";
import ApartmentCard from "./components/ApartmentCard";
import EmergencyContacts from "./components/EmergencyContacts";

const CSV_URL = import.meta.env.VITE_CSV_URL || "";

export default function App(){
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(()=>{
    if (!CSV_URL) {
      console.warn("VITE_CSV_URL not set");
      return;
    }
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: results => {
        setData(results.data.map(row => normalizeRow(row)));
      },
      error: err => console.error("CSV parse error", err)
    });
  }, []);

  const normalizeRow = (r) => {
    return {
      flatNo: (r["Flat No"] || r["Flat"] || r.flatNo || r.flat || r["FlatNo"] || "").toString().trim(),
      type: (r["Type"] || r.type || "").toString().trim(),
      ownerName: (r["Owner Name"] || r["મલિક"] || r.owner || r.ownerName || "").toString().trim(),
      tenantName: (r["Tenant Name"] || r["ભાડુઆત"] || r.tenant || r.tenantName || "").toString().trim(),
      contact: (r["Contact"] || r["Phone"] || r.contact || r.phone || "").toString().trim(),
      members: Number(r["Members"] || r["Total Members"] || r.members || r["Total મેમ્બર"] || 0) || 0,
      twoWheeler: Number(r["Two Wheeler"] || r.twowheeler || r["TwoWheeler"] || 0) || 0,
      fourWheeler: Number(r["Four Wheeler"] || r.fourwheeler || r["FourWheeler"] || 0) || 0,
      nativePlace: (r["Native Place"] || r.native || r["જનમ સ્થાન"] || "").toString().trim(),
      vehicleNo: (r["Vehicle No"] || r.vehicle || r.Vehicle || "").toString().trim(),
      raw: r
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(d => {
      return (d.flatNo && d.flatNo.toLowerCase().includes(q))
        || (d.ownerName && d.ownerName.toLowerCase().includes(q))
        || (d.tenantName && d.tenantName.toLowerCase().includes(q))
        || (d.vehicleNo && d.vehicleNo.toLowerCase().includes(q))
        || (d.nativePlace && d.nativePlace.toLowerCase().includes(q));
    });
  }, [data, query]);

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center gap-4 mb-6">
        <img src="/logo.png" alt="logo" className="w-16 h-16 object-contain"/>
        <div>
          <h1 className="text-2xl font-semibold">Hilton Empire Directory</h1>
          <p className="text-sm text-gray-300">Hilton Empire B Wing — Residency Directory</p>
        </div>
      </header>

      <DashboardStats data={data} />

      <div className="my-6">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by flat, name, vehicle or native place..." />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => <ApartmentCard key={item.flatNo + (item.contact || Math.random())} item={item} />)}
      </div>

      <div className="mt-8">
        <EmergencyContacts />
      </div>
    </div>
  );
}
