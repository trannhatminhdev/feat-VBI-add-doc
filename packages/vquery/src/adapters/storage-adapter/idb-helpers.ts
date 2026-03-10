type IDBOperationMode = 'readonly' | 'readwrite'

const wrapIDBRequest = <T>(
  db: IDBDatabase,
  storeName: string,
  mode: IDBOperationMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], mode)
    const store = transaction.objectStore(storeName)
    const request = operation(store)

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idbPut = <T>(db: IDBDatabase, storeName: string, value: T): Promise<any> => {
  return wrapIDBRequest(db, storeName, 'readwrite', (store) => store.put(value))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idbGet = <T>(db: IDBDatabase, storeName: string, key: any): Promise<T | undefined> => {
  return wrapIDBRequest(db, storeName, 'readonly', (store) => store.get(key))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idbDelete = (db: IDBDatabase, storeName: string, key: any): Promise<any> => {
  return wrapIDBRequest(db, storeName, 'readwrite', (store) => store.delete(key))
}

export const idbGetAll = <T>(db: IDBDatabase, storeName: string): Promise<T[]> => {
  return wrapIDBRequest(db, storeName, 'readonly', (store) => store.getAll())
}
