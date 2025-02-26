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
// addRxPlugin(wrappedKeyCompressionStorage);
// addRxPlugin(wrappedKeyEncryptionCryptoJsStorage);
addRxPlugin(RxDBDevModePlugin);
disableWarnings();
const dbName = "businessesdb";
let dbInstance = null; // Track the database instance

const businessSchema = {
  keyCompression: true,
  version: 0,
  title: "business schema",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
    },
  },
  required: ["id", "name"],
};

const articleSchema = {
  keyCompression: true,
  version: 0,
  title: "article schema",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
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
  required: ["id", "name", "qty", "selling_price", "business_id"],
};

const createDatabase = async () => {
  // Check if the database instance already exists
  if (dbInstance) {
    return dbInstance; // Return the existing instance
  }

  // Create a new database instance
  dbInstance = await createRxDatabase({
    name: dbName,
    storage: wrappedValidateAjvStorage({
      storage: wrappedKeyCompressionStorage({
        storage: wrappedKeyEncryptionCryptoJsStorage({
          storage: getRxStorageMemory(),
        }),
      }),
    }),
    ignoreDuplicate: true,
  });

  await dbInstance.addCollections({
    businesses: {
      schema: businessSchema,
    },
    articles: {
      schema: articleSchema,
    },
  });

  return dbInstance;
};

export { createDatabase, replicateRxCollection };
