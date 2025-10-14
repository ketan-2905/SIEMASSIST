"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface VPNData {
  timestamp: string;
  sourceIP: string;
  username: string;
  outcome: "success" | "failure";
  host: string;
  action: string;
}

export interface RawVPNData {
  "@timestamp": string;
  "source.ip": string;
  "user.name": string;
  "event.dataset": string;
  "event.outcome": string;
  "event.action": string;
  "host.name": string;
}

interface ReportDataContextType {
  vpnData: VPNData[];
  setVpnData: (data: RawVPNData[]) => void;
  clearData: () => void;
  isLoading: boolean;
}

const ReportDataContext = createContext<ReportDataContextType | undefined>(undefined);

export const ReportDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vpnData, setVpnData] = useState<VPNData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('vpnReportData');
    if (storedData) {
      try {
        setVpnData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing stored VPN data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Transform and set new data
  const handleSetVpnData = (rawData: RawVPNData[]) => {
    const transformedData: VPNData[] = rawData.map(item => ({
      timestamp: item["@timestamp"].replace(/\.\d{3}Z$/, ''), // Remove milliseconds for consistency
      sourceIP: item["source.ip"],
      username: item["user.name"],
      outcome: item["event.outcome"] as "success" | "failure",
      host: item["host.name"],
      action: item["event.action"]
    }));

    setVpnData(transformedData);
    localStorage.setItem('vpnReportData', JSON.stringify(transformedData));
  };

  const clearData = () => {
    setVpnData([]);
    localStorage.removeItem('vpnReportData');
  };

  return (
    <ReportDataContext.Provider value={{
      vpnData,
      setVpnData: handleSetVpnData,
      clearData,
      isLoading
    }}>
      {children}
    </ReportDataContext.Provider>
  );
};

export const useReportData = () => {
  const context = useContext(ReportDataContext);
  if (context === undefined) {
    throw new Error('useReportData must be used within a ReportDataProvider');
  }
  return context;
};