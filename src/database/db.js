import { createRxDatabase } from "rxdb";
// import PouchDB from "pouchdb-core";
// import PouchDBAdapterIdb from "pouchdb-adapter-idb";
// import PouchDBAdapterHttp from "pouchdb-adapter-http";
import { replicateRxCollection } from "rxdb/plugins/replication";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { addRxPlugin } from "rxdb/plugins/core";
import { disableWarnings } from "rxdb/plugins/dev-mode";
// import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { wrappedKeyCompressionStorage } from "rxdb/plugins/key-compression";
import { wrappedKeyEncryptionCryptoJsStorage } from "rxdb/plugins/encryption-crypto-js";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
// import businessSchema from "./businessSchema";
// import articleSchema from "./articleSchema";

// addRxPlugin(PouchDBAdapterIdb);
// addRxPlugin(PouchDBAdapterHttp);
// addRxPlugin(wrappedValidateAjvStorage);
// ... existing code ...
addRxPlugin(RxDBDevModePlugin);
disableWarnings();
const dbName = "businessesdb";
let dbInstance = null; // Track the database instance

const businessSchema = {
  title: "business schema",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true,
    },
    name: {
      type: "string",
    },
  },
};

const articleSchema = {
  title: "article schema",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true,
    },
    name: {
      type: "string",
    },
    qty: {
      type: "number",
    },
    selling_price: {
      type: "number",
    },
    business_id: {
      type: "string",
    },
  },
};

const createDatabase = async () => {
  // Check if the database instance already exists
  if (dbInstance) {
    return dbInstance; // Return the existing instance
  }

  // Check if the database already exists in the environment
  try {
    const existingDb = await createRxDatabase({
      name: dbName,
      storage: getRxStorageMemory(),
    });
    if (existingDb) {
      dbInstance = existingDb; // Use the existing instance
      return dbInstance;
    }
  } catch (error) {
    // Ignore the error if the database does not exist
    console.warn("Database does not exist, creating a new one.");
  }

  // Create a new database instance
  const db = await createRxDatabase({
    name: dbName,
    storage: wrappedValidateAjvStorage({
      storage: wrappedKeyCompressionStorage({
        storage: wrappedKeyEncryptionCryptoJsStorage({
          storage: getRxStorageMemory(),
        }),
      }),
    }),
  });

  await db.addCollections({
    businesses: {
      schema: businessSchema,
    },
    articles: {
      schema: articleSchema,
    },
  });

  dbInstance = db; // Store the created instance
  return db;
};

export { createDatabase, replicateRxCollection };
