import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Instance } from '../../axios';
import { Routes } from '../../helpers/routeHelper';
import { addToCart, resetMessage } from '../../redux/slices/cartSlice';
import { resetProdMessage } from '../../redux/slices/product';
import { utils, writeFile } from 'xlsx';
import WithPagination from '../components/pagination';
import { toast } from 'react-hot-toast';
import defaultImage from '../../asset/1.png';
import Modal from './Modal';
import LoaderComp from '../components/Loader/Loader';

const Products = (props) => {
  const dispatch = useDispatch();

  const { cartLoaderId, itemAdded } = useSelector((state) => state.cart);
  const { role } = useSelector((state) => state.user);
  const { data } = useSelector((state) => state.product);

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [view, setView] = useState(1);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  const fetchProducts = async (params) => {
    setIsLoading(true);
    return await Instance.get(`${Routes.product.products}?${params}`)
      .then((res) => res.data)
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };
  const productsProps = async () => {
    let productList;
    const urlParams = new URLSearchParams();
    urlParams.set('limit', props.itemsPerPage);
    urlParams.set('skip', props.itemsPerPage * props.page);
    productList = await fetchProducts(urlParams.toString());
    props.setTotalItems(productList.total);
    setAllProducts(productList.docs);
  };

  useEffect(() => {
    (async () => {
      productsProps();
    })();
  }, [props]);

  useEffect(() => {
    if (itemAdded) {
      toast.success(itemAdded);
      setTimeout(() => {
        dispatch(resetMessage());
      }, 1000);
    }
  }, [itemAdded]);

  useEffect(() => {
    if (filterText) {
      setProducts([
        ...allProducts.filter(
          (item) =>
            item.name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.description.toLowerCase().includes(filterText.toLowerCase())
        ),
      ]);
    } else {
      setProducts([...allProducts]);
    }
  }, [allProducts, filterText]);

  const filterProductsByText = (e) => setFilterText(e.target.value);

  const handleAddToCart = async (idx) => dispatch(addToCart({ productId: products[idx]?._id }));

  const modalHandler = async (key, data) => {
    setView(key);
    if (key === 1) {
      setDeleteProduct(data);
    } else if (key === 3) {
      setProductInfo(data);
    } else {
      setDeleteProduct(null);
    }
    setOpenModal(true);
  };

  const refreshPage = async () => {
    setDeleteProduct(null);
    setProductInfo(null);
    if (data !== '') {
      dispatch(resetProdMessage());
      productsProps();
    }
    setOpenModal(false);
  };

  const onExport = () => {
    const ws = utils.json_to_sheet(products);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFile(wb, 'products.xlsx');
  };

  // const modal = useCallback(
  //   () => <Modal open={openModal} id={deleteProduct} view={view} info={productInfo} closeFunc={() => refreshPage()} />,
  //   [openModal, deleteProduct, view, productInfo]
  // );

  return isLoading ? (
    <div className="flex justify-center">
      <div className="w-full px-4 py-2 ">
        <LoaderComp size={35} color={'#711FB9'} />
      </div>
    </div>
  ) : (
    <>
      <div className="flex justify-between items-center my-2">
        <div>
          <input
            type="text"
            name="filterText"
            placeholder="search products"
            onChange={filterProductsByText}
            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
        {role === 1 && (
          <div className="flex items-center gap-1 sm:gap-5">
            <button
              type="button"
              className="bg-purple-700 text-white px-4 py-1 rounded hover:bg-purple-600 h-10"
              onClick={() => modalHandler(2)}
            >
              Add Product
            </button>
            <button
              type="button"
              className="bg-purple-700 text-white px-4 py-1 rounded hover:bg-purple-600 h-10"
              onClick={onExport}
            >
              export
            </button>
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-10">
        {products.map((product, idx) => (
          <div key={product._id} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none hover:opacity-75 lg:h-80">
              <img
                // src={product.images.length > 0 ? product.images[0] : product.images}
                // alt={product.images.length > 0 ? product.images[0] : product.images}
                src={defaultImage}
                alt={defaultImage}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <span aria-hidden="true" className="absolute" />
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">&#8377; {product.price}</p>
                {role !== 1 ? (
                  cartLoaderId === product._id ? (
                    <div className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                      <LoaderComp color="#fff" size={23} />
                    </div>
                  ) : (
                    <button
                      className="cursor-pointer bg-purple-700 text-white mt-2 px-2 py-1 rounded hover:bg-green-700 h-8"
                      onClick={() => handleAddToCart(idx)}
                    >
                      'Add to cart'
                    </button>
                  )
                ) : (
                  <>
                    <button
                      className="cursor-pointer bg-purple-700 text-white mt-2 mr-3 px-2 py-1 rounded hover:bg-red-700 h-8"
                      onClick={() => modalHandler(3, product)}
                    >
                      Update
                    </button>
                    <button
                      className="cursor-pointer bg-purple-700 text-white mt-2 px-2 py-1 rounded hover:bg-red-700 h-8"
                      onClick={() => modalHandler(1, product._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* {modal()} */}
      <Modal open={openModal} id={deleteProduct} view={view} info={productInfo} closeFunc={() => refreshPage()} />
    </>
  );
};

export default WithPagination(Products);
