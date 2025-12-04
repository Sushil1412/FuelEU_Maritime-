export type Route = {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
};

export type RouteFilters = {
  vesselType?: string;
  fuelType?: string;
  year?: number;
};

export type RouteComparison = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  baselineGhgIntensity: number;
  comparisonGhgIntensity: number;
  percentDiff: number;
  compliant: boolean;
};

export type ComplianceBalance = {
  shipId: string;
  year: number;
  cbGco2eq: number;
};

export type BankEntry = {
  id: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
};

export type BankingActionResult = {
  cbBefore: number;
  applied: number;
  cbAfter: number;
};

export type PoolMember = {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
};

export type Pool = {
  id: number;
  year: number;
  members: PoolMember[];
};

