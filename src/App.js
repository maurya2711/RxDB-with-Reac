import React, { useEffect, useState } from "react";
import { createDatabase, replicateRxCollection } from "./database/db";
import { lastOfArray } from "rxdb";
import { Subject } from "rxjs";
// import BusinessForm from "./components/BuisnessForm";
// import ArticleForm from "./components/ArticleForm";
// import BusinessList from "./components/BusinessList";

const App = () => {
  const [db, setDb] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const initDb = async () => {
      const database = await createDatabase();
      setDb(database);
      console.log(
        "Database",
        database,
        database?.collections?.businesses,
        database?.collections?.articles,
        database?.collections
      );

      // Check if the collections exist before replicating
      if (
        database?.collections?.businesses &&
        database?.collections?.articles
      ) {
        // Define the pull stream for real-time replication
        const pullStream$ = new Subject();

        // Replicate businesses collection
        replicateRxCollection({
          collection: database?.collections?.businesses,
          replicationIdentifier: "businesses-replication",
          live: true,
          retryTime: 5000,
          waitForLeadership: true,
          autoStart: true,
          push: {
            handler: async (docs) => {
              console.log("push handler", docs);
            },
            batchSize: 5,
          },
          pull: {
            handler: async (lastCheckpoint, batchSize) => {
              // Mock data for demonstration purposes
              const mockDocuments = [
                { id: "1", name: "Business 1", updatedAt: new Date() },
                { id: "2", name: "Business 2", updatedAt: new Date() },
                // Add more mock documents as needed
              ];

              // Simulate a checkpoint
              const checkpoint = {
                id: lastCheckpoint ? lastCheckpoint.id : "0",
                updatedAt: new Date(),
              };

              return {
                documents: mockDocuments, // Return the mock documents
                checkpoint: checkpoint, // Return the checkpoint
              };
            },
            batchSize: 10,
          },
        });

        // Replicate articles collection similarly
        replicateRxCollection({
          collection: database?.collections?.articles,
          replicationIdentifier: "articles-replication",
          live: true,
          retryTime: 5000,
          waitForLeadership: true,
          autoStart: true,
          push: {
            handler: async (docs) => {
              console.log("push handler", docs);
            },
            batchSize: 5,
          },
          pull: {
            handler: async (lastCheckpoint, batchSize) => {
              // Mock data for demonstration purposes
              const mockDocuments = [
                { id: "1", name: "Article 1", updatedAt: new Date() },
                { id: "2", name: "Article 2", updatedAt: new Date() },
                // Add more mock documents as needed
              ];

              // Simulate a checkpoint
              const checkpoint = {
                id: lastCheckpoint ? lastCheckpoint.id : "0",
                updatedAt: new Date(),
              };

              return {
                documents: mockDocuments, // Return the mock documents
                checkpoint: checkpoint, // Return the checkpoint
              };
            },
            batchSize: 10,
          },
        });
      } else {
        console.error("Collections not found in the database.");
      }
    };
    initDb();
  }, []);

  const createBusiness = async (name) => {
    const id = new Date().toISOString();
    await db.businesses.insert({ id, name });
    fetchBusinesses();
  };

  const createArticle = async (name, qty, selling_price, business_id) => {
    const id = new Date().toISOString();
    await db.articles.insert({ id, name, qty, selling_price, business_id });
    fetchArticles(business_id);
  };

  const fetchBusinesses = async () => {
    const allBusinesses = await db.businesses.find().exec();
    setBusinesses(allBusinesses);
  };

  const fetchArticles = async (business_id) => {
    const allArticles = await db.articles
      .find({ selector: { business_id } })
      .exec();
    setArticles(allArticles);
  };

  console.log("buisness", businesses, "article", articles);

  return db ? (
    <div>
      <h1>Offline-First CRUD App</h1>
      {/* <BusinessForm db={db} />
      <ArticleForm db={db} businesses={businesses} />
      <BusinessList businesses={businesses} /> */}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default App;
