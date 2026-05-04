import { User } from '../lib/User';
import { jsonDb } from '../lib/JsonDb';

export class UserRepository {
  constructor() {}

  async findById(id: string): Promise<User | null> {
    const userData = jsonDb.findById('users', id);
    return userData ? this.mapToDomain(userData) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = jsonDb.getCollection('users');
    const userData = users.find(u => u.email === email);
    return userData ? this.mapToDomain(userData) : null;
  }

  async findAll(): Promise<User[]> {
    const users = jsonDb.getCollection('users');
    return users.map(user => this.mapToDomain(user));
  }

  async create(data: {
    name: string;
    email: string;
    balance?: number;
  }): Promise<User> {
    const newUserData = jsonDb.insert('users', {
      name: data.name,
      email: data.email,
      balance: data.balance || 100000,
      createdAt: new Date().toISOString()
    });

    return this.mapToDomain(newUserData);
  }

  async updateBalance(id: string, newBalance: number, saveImmediately: boolean = true): Promise<User | null> {
    const updatedData = jsonDb.update('users', id, { balance: newBalance }, saveImmediately);
    return updatedData ? this.mapToDomain(updatedData) : null;
  }

  async updateName(id: string, name: string, saveImmediately: boolean = true): Promise<User | null> {
    const updatedData = jsonDb.update('users', id, { name }, saveImmediately);
    return updatedData ? this.mapToDomain(updatedData) : null;
  }

  async save(): Promise<void> {
    jsonDb.save();
  }

  async delete(id: string): Promise<boolean> {
    return jsonDb.delete('users', id);
  }

  private mapToDomain(userData: any): User {
    return new User(
      userData.id,
      userData.name,
      userData.email,
      userData.balance,
      new Date(userData.createdAt)
    );
  }
}
