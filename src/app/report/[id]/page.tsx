"use client";
import React, { useEffect } from "react";
import Dashboard from "@/components/Report";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

// Sample logs
// const sampleLogs = [
//   {
//     "@timestamp": "2025-10-14T06:20:32.662Z",
//     "event.dataset": "openvpn",
//     "user.name": "raj",
//     "source.ip": "14.192.32.101",
//     "destination.system": "server1",
//     "event.outcome": "SUCCESS",
//     "event.severity": "HIGH",
//     "event.type": "file_access",
//     "device.id": "endpoint1",
//     "device.os": "Ubuntu 22.04",
//     "geo.city": "Bangalore",
//     "geo.country": "India",
//   },
//   // add more logs here
// ];

// -------------------- Component to load logs into context --------------------
const DashboardLoader = () => {
  const { log,setLogs, severityData, eventTypeData, eventsOverTimeData, geoData, serverData, endpointData, correlationData } = useDashboard();

  useEffect(() => {
        console.log(log);
        console.log(severityData);
        
  }, [log,severityData]);

  return (
    <Dashboard
      severityData={severityData}
      eventTypeData={eventTypeData}
      eventsOverTimeData={eventsOverTimeData}
      geoData={geoData}
      serverData={serverData}
      endpointData={endpointData}
      correlationData={correlationData}
    />
  );
};

// -------------------- Page --------------------
export default function ReportPage() {
  return (
    <DashboardProvider>
      <DashboardLoader />
    </DashboardProvider>
  );
}
