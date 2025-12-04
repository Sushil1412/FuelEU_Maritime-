export class RouteComparison {
  constructor(
    public readonly routeId: string,
    public readonly vesselType: string,
    public readonly fuelType: string,
    public readonly year: number,
    public readonly baselineGhgIntensity: number,
    public readonly comparisonGhgIntensity: number,
    public readonly percentDiff: number,
    public readonly compliant: boolean
  ) {}
}

