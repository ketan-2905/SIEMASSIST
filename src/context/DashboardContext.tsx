// "use client";
// import React, { createContext, useContext, useState, ReactNode } from "react";

// // -------------------- Interfaces --------------------
// export interface SeverityData {
//   severity: string;
//   count: number;
// }

// export interface EventTypeData {
//   type: string;
//   count: number;
// }

// export interface EventsOverTimeData {
//   hour: string;
//   count: number;
// }

// export interface GeoData {
//   city: string;
//   country: string;
//   count: number;
// }

// export interface ServerData {
//   server: string;
//   type: string;
//   count: number;
// }

// export interface EndpointData {
//   device: string;
//   os: string;
//   count: number;
// }

// export interface CorrelationData {
//   source: string;
//   user: string;
//   destination?: string;
//   count: number;
// }

// export interface DashboardContextType {
//   severityData: SeverityData[];
//   eventTypeData: EventTypeData[];
//   eventsOverTimeData: EventsOverTimeData[];
//   geoData: GeoData[];
//   serverData: ServerData[];
//   endpointData: EndpointData[];
//   correlationData: CorrelationData[];
//   setLogs: (logs: any[]) => void; // <-- single function to process raw logs
//   log:any[]
// }

// // -------------------- Create Context --------------------
// const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// // -------------------- Provider --------------------
// export const DashboardProvider = ({ children }: { children: ReactNode }) => {
//   const [severityData, setSeverityData] = useState<SeverityData[]>([]);
//   const [eventTypeData, setEventTypeData] = useState<EventTypeData[]>([]);
//   const [eventsOverTimeData, setEventsOverTimeData] = useState<EventsOverTimeData[]>([]);
//   const [geoData, setGeoData] = useState<GeoData[]>([]);
//   const [serverData, setServerData] = useState<ServerData[]>([]);
//   const [endpointData, setEndpointData] = useState<EndpointData[]>([]);
//   const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
//   const [log,setLog] = useState<any[]>([])

//   // -------------------- Function to set logs --------------------
//   const setLogs = (logs: any[]) => {
//     setLog(logs)
//     console.log(logs);
    
//     setSeverityData(["Critical", "High", "Medium", "Low"].map((sev) => ({
//       severity: sev,
//       count: logs.filter((l) => l["event.severity"] === sev).length,
//     })));

//     const list = ["Critical", "High", "Medium", "Low"].map((sev) => ({
//       severity: sev,
//       count: logs.filter((l) => l["event.severity"] === sev).length,
//     }))

//     console.log(list);
    

//     setEventTypeData(
//       Array.from(new Set(logs.map((l) => l["event.type"]))).map((type) => ({
//         type,
//         count: logs.filter((l) => l["event.type"] === type).length,
//       }))
//     );

//     setEventsOverTimeData(
//       Array.from({ length: 24 }).map((_, i) => {
//         const hourStr = i.toString().padStart(2, "0") + ":00";
//         return {
//           hour: hourStr,
//           count: logs.filter((l) => new Date(l["@timestamp"]).getUTCHours() === i).length,
//         };
//       })
//     );

//     setGeoData(
//       Array.from(new Set(logs.map((l) => l["geo.city"] + ", " + l["geo.country"]))).map(
//         (location) => {
//           const [city, country] = location.split(", ");
//           return {
//             city,
//             country,
//             count: logs.filter(
//               (l) => l["geo.city"] === city && l["geo.country"] === country
//             ).length,
//           };
//         }
//       )
//     );

//     setServerData(
//       Array.from(new Set(logs.map((l) => l["destination.system"]))).map((server) => ({
//         server,
//         type: "",
//         count: logs.filter((l) => l["destination.system"] === server).length,
//       }))
//     );

//     setEndpointData(
//       Array.from(new Set(logs.map((l) => l["device.id"]))).map((device) => ({
//         device,
//         os: logs.find((l) => l["device.id"] === device)?.["device.os"] || "",
//         count: logs.filter((l) => l["device.id"] === device).length,
//       }))
//     );

//     setCorrelationData(
//       Array.from(new Set(logs.map((l) => l["source.ip"] + "-" + l["user.name"]))).map(
//         (key) => {
//           const [source, user] = key.split("-");
//           return {
//             source,
//             user,
//             destination: logs.find(
//               (l) => l["source.ip"] === source && l["user.name"] === user
//             )?.["destination.system"],
//             count: logs.filter(
//               (l) => l["source.ip"] === source && l["user.name"] === user
//             ).length,
//           };
//         }
//       )
//     );
//   };

//   return (
//     <DashboardContext.Provider
//       value={{
//         severityData,
//         eventTypeData,
//         eventsOverTimeData,
//         geoData,
//         serverData,
//         endpointData,
//         correlationData,
//         setLogs, 
//         log// <-- expose function
//       }}
//     >
//       {children}
//     </DashboardContext.Provider>
//   );
// };

// // -------------------- Custom Hook --------------------
// export const useDashboard = () => {
//   const context = useContext(DashboardContext);
//   if (!context) throw new Error("useDashboard must be used within DashboardProvider");
//   return context;
// };

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// -------------------- Interfaces --------------------
export interface SeverityData {
  severity: string;
  count: number;
}

export interface EventTypeData {
  type: string;
  count: number;
}

export interface EventsOverTimeData {
  hour: string;
  count: number;
}

export interface GeoData {
  city: string;
  country: string;
  count: number;
}

export interface ServerData {
  server: string;
  type: string;
  count: number;
}

export interface EndpointData {
  device: string;
  os: string;
  count: number;
}

export interface CorrelationData {
  source: string;
  user: string;
  destination?: string;
  count: number;
}

export interface DashboardContextType {
  severityData: SeverityData[];
  eventTypeData: EventTypeData[];
  eventsOverTimeData: EventsOverTimeData[];
  geoData: GeoData[];
  serverData: ServerData[];
  endpointData: EndpointData[];
  correlationData: CorrelationData[];
  setLogs: (logs: any[]) => void;
  log: any[];
}

// -------------------- Create Context --------------------
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// -------------------- Provider --------------------
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [severityData, setSeverityData] = useState<SeverityData[]>([]);
  const [eventTypeData, setEventTypeData] = useState<EventTypeData[]>([]);
  const [eventsOverTimeData, setEventsOverTimeData] = useState<
    EventsOverTimeData[]
  >([]);
  const [geoData, setGeoData] = useState<GeoData[]>([]);
  const [serverData, setServerData] = useState<ServerData[]>([]);
  const [endpointData, setEndpointData] = useState<EndpointData[]>([]);
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [log, setLog] = useState<any[]>([]);

  // -------------------- Function to set logs --------------------
  const setLogs = (logs: any[]) => {
    setLog(logs);
    localStorage.setItem("dashboardLogs", JSON.stringify(logs)); // ✅ Save to localStorage

    setSeverityData(
      ["Critical", "High", "Medium", "Low"].map((sev) => ({
        severity: sev,
        count: logs.filter((l) => l["event.severity"].toLocaleLowerCase() === sev.toLocaleLowerCase()).length,
      }))
    );

    setEventTypeData(
      Array.from(new Set(logs.map((l) => l["event.type"]))).map((type) => ({
        type,
        count: logs.filter((l) => l["event.type"] === type).length,
      }))
    );

    setEventsOverTimeData(
      Array.from({ length: 24 }).map((_, i) => {
        const hourStr = i.toString().padStart(2, "0") + ":00";
        return {
          hour: hourStr,
          count: logs.filter(
            (l) => new Date(l["@timestamp"]).getUTCHours() === i
          ).length,
        };
      })
    );

    setGeoData(
      Array.from(
        new Set(logs.map((l) => l["geo.city"] + ", " + l["geo.country"]))
      ).map((location) => {
        const [city, country] = location.split(", ");
        return {
          city,
          country,
          count: logs.filter(
            (l) => l["geo.city"] === city && l["geo.country"] === country
          ).length,
        };
      })
    );

    setServerData(
      Array.from(new Set(logs.map((l) => l["destination.system"]))).map(
        (server) => ({
          server,
          type: "",
          count: logs.filter((l) => l["destination.system"] === server).length,
        })
      )
    );

    setEndpointData(
      Array.from(new Set(logs.map((l) => l["device.id"]))).map((device) => ({
        device,
        os: logs.find((l) => l["device.id"] === device)?.["device.os"] || "",
        count: logs.filter((l) => l["device.id"] === device).length,
      }))
    );

    setCorrelationData(
      Array.from(new Set(logs.map((l) => l["source.ip"] + "-" + l["user.name"])))
        .map((key) => {
          const [source, user] = key.split("-");
          return {
            source,
            user,
            destination: logs.find(
              (l) => l["source.ip"] === source && l["user.name"] === user
            )?.["destination.system"],
            count: logs.filter(
              (l) => l["source.ip"] === source && l["user.name"] === user
            ).length,
          };
        })
    );
  };

  // -------------------- Retrieve logs from localStorage on mount --------------------
  useEffect(() => {
    const savedLogs = localStorage.getItem("dashboardLogs");
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        setLogs(parsedLogs); // ✅ restore persisted logs
      } catch (err) {
        console.error("Failed to parse saved logs:", err);
      }
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        severityData,
        eventTypeData,
        eventsOverTimeData,
        geoData,
        serverData,
        endpointData,
        correlationData,
        setLogs,
        log,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// -------------------- Custom Hook --------------------
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};

