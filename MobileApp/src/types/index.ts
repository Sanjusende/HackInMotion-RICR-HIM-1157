export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  language: string;
}

export interface Farm {
  _id: string;
  owner: string;
  currentCrop?: string;
  growthStage?: string;
  soilType?: string;
  season?: string;
  landSize?: {
    value: number;
    unit: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    display: string;
  };
}

export interface WeatherCondition {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  weatherCondition: string;
}

export interface MandiRate {
  crop: string;
  price: number;
  date: string;
}

export interface DashboardSummary {
  todaysAction?: {
    irrigationStatus: string;
    reasoning?: {
      actionableAdvice: string;
      waterSavedLiters?: number;
      pumpingCostSaving?: number;
      confidence?: number;
    };
  };
  weatherAlert?: {
    active: boolean;
    title: string;
    message: string;
  };
  cropHealth?: {
    status: string;
    lastDiagnosticResult?: string;
  };
  market?: {
    currentPrice: number;
    changePercent: number;
    trend: string;
  };
}
