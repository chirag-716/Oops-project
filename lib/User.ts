export class User {
  private readonly id: string;
  private name: string;
  private email: string;
  private balance: number;
  private readonly createdAt: Date;

  constructor(id: string, name: string, email: string, balance: number = 100000, createdAt?: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.balance = balance;
    this.createdAt = createdAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getBalance(): number {
    return this.balance;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  canAfford(amount: number): boolean {
    return this.balance >= amount;
  }

  debit(amount: number): void {
    if (amount < 0) {
      throw new Error('Debit amount must be positive');
    }
    if (!this.canAfford(amount)) {
      throw new Error('Insufficient balance');
    }
    this.balance -= amount;
  }

  credit(amount: number): void {
    if (amount < 0) {
      throw new Error('Credit amount must be positive');
    }
    this.balance += amount;
  }

  updateName(name: string): void {
    this.name = name;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      balance: this.balance,
      createdAt: this.createdAt
    };
  }
}
