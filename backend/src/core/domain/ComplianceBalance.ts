export class ComplianceBalance {
  constructor(
    public readonly shipId: string,
    public readonly year: number,
    public readonly cbGco2eq: number
  ) {}
}

