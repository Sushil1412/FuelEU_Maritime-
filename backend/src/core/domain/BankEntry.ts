export class BankEntry {
  constructor(
    public readonly id: number,
    public readonly shipId: string,
    public readonly year: number,
    public readonly amountGco2eq: number
  ) {}
}

