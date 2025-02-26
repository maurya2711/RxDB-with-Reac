import React, { useEffect, useState } from "react";
import { createDatabase, replicateRxCollection } from "./database/db";
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
      // Sync with MongoDB Atlas
      replicateRxCollection(database.businesses, {
        remote:
          "mongodb+srv://sharadmaurya:PeXj.m6Vpah8xW3@cluster1.mvsq0.mongodb.net/buissness?retryWrites=true&w=majority",
        waitForLeadership: true,
      });
      replicateRxCollection(database.articles, {
        remote:
          "mongodb+srv://sharadmaurya:PeXj.m6Vpah8xW3@cluster1.mvsq0.mongodb.net/buissness?retryWrites=true&w=majority",
        waitForLeadership: true,
      });
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
