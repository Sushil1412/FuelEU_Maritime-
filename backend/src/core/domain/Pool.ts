export class PoolMember {
  constructor(
    public readonly shipId: string,
    public readonly cbBefore: number,
    public readonly cbAfter: number
  ) {}
}

export class Pool {
  constructor(
    public readonly id: number,
    public readonly year: number,
    public readonly members: PoolMember[]
  ) {}
}

