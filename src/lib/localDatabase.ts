/**
 * Local Database - Replaces InsForge database with localStorage-based storage.
 */

const DB_PREFIX = 'futurefit_db_';

function getTable(tableName: string): any[] {
  try {
    return JSON.parse(localStorage.getItem(DB_PREFIX + tableName) || '[]');
  } catch {
    return [];
  }
}

function setTable(tableName: string, data: any[]): void {
  localStorage.setItem(DB_PREFIX + tableName, JSON.stringify(data));
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

type Operation = 
  | { type: 'select' }
  | { type: 'insert'; records: any }
  | { type: 'update'; updates: any }
  | { type: 'upsert'; record: any; options?: { onConflict?: string } }
  | { type: 'delete' };

class QueryBuilder {
  private tableName: string;
  private filters: Array<{ column: string; value: any; type: 'eq' | 'in' }> = [];
  private selectColumns: string = '*';
  private limitCount: number | null = null;
  private isSingle: boolean = false;
  private isMaybeSingle: boolean = false;
  private orderByCol: string | null = null;
  private orderAsc: boolean = true;
  private operation: Operation = { type: 'select' };

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*'): QueryBuilder {
    this.selectColumns = columns;
    this.operation = { type: 'select' };
    return this;
  }

  eq(column: string, value: any): QueryBuilder {
    this.filters.push({ column, value, type: 'eq' });
    return this;
  }

  in(column: string, values: any[]): QueryBuilder {
    this.filters.push({ column, value: values, type: 'in' });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): QueryBuilder {
    this.orderByCol = column;
    this.orderAsc = options?.ascending ?? true;
    return this;
  }

  limit(count: number): QueryBuilder {
    this.limitCount = count;
    return this;
  }

  single(): QueryBuilder {
    this.isSingle = true;
    return this;
  }

  maybeSingle(): QueryBuilder {
    this.isMaybeSingle = true;
    return this;
  }

  private resolveSelect(): any[] {
    let data = getTable(this.tableName);
    
    // Apply filters
    for (const filter of this.filters) {
      if (filter.type === 'eq') {
        // Handle dot notation like 'internships.company_id' by looking at the inner object if it exists
        // or just filtering at top level if not a dot
        if (filter.column.includes('.')) {
          const [rel, col] = filter.column.split('.');
          // This is tricky for a local mock. We'll simplify: 
          // If it's a join filter, we filter AFTER the join normally, 
          // but here we might need to filter before or during.
          // For the 'applications' -> 'internships' join, we'll try to match.
          if (this.tableName === 'applications' && rel === 'internships') {
            const internships = getTable('internships');
            data = data.filter(row => {
              const internship = internships.find(i => i.id === row.internship_id);
              return internship && internship[col] === filter.value;
            });
          }
        } else {
          data = data.filter(row => row[filter.column] === filter.value);
        }
      } else if (filter.type === 'in') {
        data = data.filter(row => filter.value.includes(row[filter.column]));
      }
    }

    if (this.orderByCol) {
      const col = this.orderByCol;
      const asc = this.orderAsc;
      data.sort((a, b) => {
        const aVal = a[col];
        const bVal = b[col];
        if (aVal < bVal) return asc ? -1 : 1;
        if (aVal > bVal) return asc ? 1 : -1;
        return 0;
      });
    }

    if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    if (this.selectColumns && this.selectColumns !== '*') {
      data = this.resolveRelations(data);
    }

    return data;
  }

  private resolveRelations(data: any[]): any[] {
    // Basic support for "*, table:column (fields)"
    // and "table!inner (fields)"
    const nestedPattern = /(\w+)(?:!\w+)?(?::(\w+))?\s*\(([^)]+)\)/g;
    let match;
    const relations: Array<{ alias: string; foreignKey: string; table: string; fields: string[] }> = [];

    while ((match = nestedPattern.exec(this.selectColumns)) !== null) {
      const table = match[1];
      const foreignKey = match[2] || (this.tableName === 'applications' ? (table === 'students' ? 'student_id' : 'internship_id') : (table + '_id'));
      relations.push({
        alias: table,
        foreignKey,
        table,
        fields: match[3].split(',').map(f => f.trim().split(':')[0].trim()) // Simplified field parsing
      });
    }

    if (relations.length === 0) return data;

    return data.map(row => {
      const enriched = { ...row };
      for (const rel of relations) {
        const relTable = getTable(rel.table);
        const foreignId = row[rel.foreignKey];
        if (foreignId) {
          const relatedRow = relTable.find(r => r.id === foreignId);
          if (relatedRow) {
            const picked: any = {};
            for (const field of rel.fields) {
              if (field === '*') {
                Object.assign(picked, relatedRow);
              } else {
                picked[field] = relatedRow[field];
              }
            }
            enriched[rel.alias] = picked;
          } else {
            enriched[rel.alias] = null;
          }
        } else {
          enriched[rel.alias] = null;
        }
      }
      return enriched;
    });
  }

  insert(records: any | any[]): QueryBuilder {
    this.operation = { type: 'insert', records };
    return this;
  }

  update(updates: any): QueryBuilder {
    this.operation = { type: 'update', updates };
    return this;
  }

  upsert(record: any, options?: { onConflict?: string }): QueryBuilder {
    this.operation = { type: 'upsert', record, options };
    return this;
  }

  delete(): QueryBuilder {
    this.operation = { type: 'delete' };
    return this;
  }

  private execute() {
    try {
      switch (this.operation.type) {
        case 'select': {
          const results = this.resolveSelect();
          if (this.isSingle) {
            return { data: results[0] || null, error: results.length === 0 ? { message: 'No rows found' } : null };
          }
          if (this.isMaybeSingle) {
            return { data: results[0] || null, error: null };
          }
          return { data: results, error: null };
        }
        case 'insert': {
          const table = getTable(this.tableName);
          const toInsert = Array.isArray(this.operation.records) ? this.operation.records : [this.operation.records];
          const results = toInsert.map(r => ({ ...r, id: r.id || generateId(), created_at: r.created_at || new Date().toISOString() }));
          table.push(...results);
          setTable(this.tableName, table);
          return { data: results, error: null };
        }
        case 'update': {
          const table = getTable(this.tableName);
          let updated = 0;
          for (let i = 0; i < table.length; i++) {
            let match = true;
            for (const f of this.filters) {
              if (table[i][f.column] !== f.value) { match = false; break; }
            }
            if (match) {
              table[i] = { ...table[i], ...this.operation.updates, updated_at: new Date().toISOString() };
              updated++;
            }
          }
          setTable(this.tableName, table);
          return { data: { count: updated }, error: null };
        }
        case 'upsert': {
          const table = getTable(this.tableName);
          const record = this.operation.record;
          const onConflictKey = this.operation.options?.onConflict || 'id';
          
          const index = table.findIndex(r => r[onConflictKey] === record[onConflictKey]);
          if (index !== -1) {
            table[index] = { ...table[index], ...record, updated_at: new Date().toISOString() };
          } else {
            table.push({ ...record, id: record.id || generateId(), created_at: new Date().toISOString() });
          }
          setTable(this.tableName, table);
          return { data: record, error: null };
        }
        case 'delete': {
          let table = getTable(this.tableName);
          const initialLength = table.length;
          table = table.filter(row => {
            let match = true;
            for (const f of this.filters) {
              if (row[f.column] !== f.value) { match = false; break; }
            }
            return !match;
          });
          setTable(this.tableName, table);
          return { data: { count: initialLength - table.length }, error: null };
        }
      }
    } catch (e: any) {
      return { data: null, error: { message: e.message } };
    }
  }

  then(resolve: (v: any) => void) {
    resolve(this.execute());
  }
}

class DatabaseClient {
  from(t: string) { return new QueryBuilder(t); }
}

class StorageClient {
  from(_b: string) { return { upload: async (_p: string, _f: File) => ({ data: { url: 'mock_url' }, error: null }) }; }
}

class FunctionsClient {
  async invoke(_s: string, _o: any) { return { data: { success: true }, error: null }; }
}

export const localDatabase = new DatabaseClient();
export const localStorage_storage = new StorageClient();
export const localFunctions = new FunctionsClient();
