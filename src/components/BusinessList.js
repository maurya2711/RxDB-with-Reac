const BusinessList = ({ businesses }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Business List</h2>
      <ul className="divide-y divide-gray-200">
        {businesses?.map((business) => (
          <li key={business.id} className="py-4">
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-900">
                {business.name}
              </div>
              <div className="text-sm text-gray-500">ID: {business.id}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessList;
