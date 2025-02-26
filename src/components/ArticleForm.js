import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ArticleForm = ({ db, businesses }) => {
  const [article, setArticle] = useState({
    id: "",
    name: "",
    qty: 0,
    selling_price: 0,
    business_id: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.articles.insert({
      id: uuidv4(),
      name: article?.name,
      qty: article?.qty,
      selling_price: article?.selling_price,
      business_id: article?.business_id,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Add Article</h2>
      <div className="mb-4">
        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
          ID
        </label>
        <input
          type="text"
          id="id"
          value={article.id}
          onChange={(e) => setArticle({ ...article, id: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={article.name}
          onChange={(e) => setArticle({ ...article, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="qty"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <input
          type="number"
          id="qty"
          value={article.qty}
          onChange={(e) =>
            setArticle({ ...article, qty: Number(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="selling_price"
          className="block text-sm font-medium text-gray-700"
        >
          Selling Price
        </label>
        <input
          type="number"
          id="selling_price"
          value={article.selling_price}
          onChange={(e) =>
            setArticle({ ...article, selling_price: Number(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="business_id"
          className="block text-sm font-medium text-gray-700"
        >
          Business ID
        </label>
        <input
          type="text"
          id="business_id"
          value={article.business_id}
          onChange={(e) =>
            setArticle({ ...article, business_id: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  );
};

export default ArticleForm;
