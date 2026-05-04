import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface DbSchema {
  users: any[];
  stocks: any[];
  portfolios: any[];
  holdings: any[];
  transactions: any[];
  priceHistory: any[];
}

export class JsonDb {
  private static instance: JsonDb;
  private data: DbSchema | null = null;

  private constructor() {}

  public static getInstance(): JsonDb {
    if (!JsonDb.instance) {
      JsonDb.instance = new JsonDb();
    }
    return JsonDb.instance;
  }

  private readDb(): DbSchema {
    if (this.data) return this.data;
    
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      this.data = JSON.parse(content);
      return this.data!;
    } catch (error) {
      console.error('Error reading DB file:', error);
      return {
        users: [],
        stocks: [],
        portfolios: [],
        holdings: [],
        transactions: [],
        priceHistory: []
      };
    }
  }

  private writeDb(data: DbSchema): void {
    try {
      this.data = data;
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to DB file:', error);
    }
  }

  public getCollection(collectionName: keyof DbSchema): any[] {
    const db = this.readDb();
    return db[collectionName];
  }

  public updateCollection(collectionName: keyof DbSchema, items: any[], saveImmediately: boolean = true): void {
    const db = this.readDb();
    db[collectionName] = items;
    if (saveImmediately) {
      this.writeDb(db);
    }
  }

  public save(): void {
    if (this.data) {
      this.writeDb(this.data);
    }
  }

  public findById(collectionName: keyof DbSchema, id: string): any {
    const collection = this.getCollection(collectionName);
    return collection.find(item => item.id === id);
  }

  public insert(collectionName: keyof DbSchema, item: any, saveImmediately: boolean = true): any {
    const collection = this.getCollection(collectionName);
    const newItem = { ...item, id: item.id || `${collectionName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    collection.push(newItem);
    this.updateCollection(collectionName, collection, saveImmediately);
    return newItem;
  }

  public update(collectionName: keyof DbSchema, id: string, updates: any, saveImmediately: boolean = true): any {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex(item => item.id === id);
    if (index !== -1) {
      collection[index] = { ...collection[index], ...updates };
      this.updateCollection(collectionName, collection, saveImmediately);
      return collection[index];
    }
    return null;
  }

  public delete(collectionName: keyof DbSchema, id: string): boolean {
    const collection = this.getCollection(collectionName);
    const initialLength = collection.length;
    const filtered = collection.filter(item => item.id !== id);
    if (filtered.length !== initialLength) {
      this.updateCollection(collectionName, filtered);
      return true;
    }
    return false;
  }
}

export const jsonDb = JsonDb.getInstance();
