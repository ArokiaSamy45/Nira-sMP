import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetProducts} from '../../apicalls/products'
import { SetLoader} from '../../redux/loadersSlice'
import { Input, message } from 'antd'
import  Divider  from '../../components/Divider'
import { useNavigate } from 'react-router-dom'
import Filters from "./Filters";

function Home() {
  const [showFilters, setShowFilters] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const [filters, setFilters] = React.useState({
    status: "approved",
    category: [],
    age: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [filters]);

  const gridColumns = showFilters ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "lg:grid-cols-4 grid-cols-1";
  const handleSearch = () => {
    // Filter the products based on the entered search term
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  const resetSearch = () => {
    setSearchTerm('');
    getData();
  };
  return (
    <div className="flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-5 items-center">
          {!showFilters && (
            <i
              className="ri-equalizer-fill text-xl cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            ></i>
          )}
         <input
            type="text"
            placeholder="Search Products here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded border-solid px-2 py-1 h-14 w-full"
          />
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded"
            onClick={handleSearch}
          >
            Search
          </button>
          {searchTerm && (
            <button
              className="px-2 py-1 bg-gray-500 text-white rounded"
              onClick={resetSearch}
            >
              Reset
            </button>
          )}
        </div>
        <div className={`grid gap-5 ${gridColumns}`}>
          {products?.map((product) => (
            <div
              className="border border-gray-300 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img src={product.images[0]} className="w-full h-52 p-5 object-cover" alt="" />
              <div className="px-2 flex flex-col">
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-sm">
                  {product.age} {product.age === 1 ? "year" : "years"} old
                </p>
                <Divider />
                <span className="text-xl font-semibold text-green-700">₹ {product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;






