import React, { useEffect, useState } from 'react';
import App from '../../App';
import { useSelector ,useDispatch} from 'react-redux';
import { Link ,useNavigate} from 'react-router-dom';
import CartModal from './CartModal';
import defaultImage from '../../asset/1.png';
import {  myCartList, } from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/orderSlice';


const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [productArray, setProductArray] = useState([]);
  const [productForPDF, setProductForPDF] = useState([]);

  const { cartList: products } = useSelector((state) => state.cart);

  const total = productArray.reduce((total, item) => (total += item.price), 0);

  useEffect(() => {
    if (!open) setProductForPDF([...productArray]);
  }, [open, products]);

  useEffect(() => {
    dispatch(myCartList());
  }, [dispatch]);

  useEffect(() => {
    if (products?.length > 0) {
      let remove_id = products.map((obj) => obj.product);
      setProductArray(remove_id);
    }
  }, [products]);

  // const removeItemFromCart = (id) => dispatch(removeFromCart(id));

  const onCheckOut = () => {
    dispatch(createOrder({ products: [...productArray], total }));
    setOpen((prev) => !prev);
  };

  return (
    <App>
      <CartModal
        open={open}
        setOpen={setOpen}
        products={productForPDF}
        total={productForPDF.reduce((total, item) => (total += item.price), 0)}
      />
      <div className="mt-8 flex justify-center">
        <div className="flow-root w-11/12 md:w-2/5">
          {productArray && productArray?.length > 0 ? (
            <>
              <ul className="-my-6 divide-y divide-gray-200">
                {productArray.map((product) => (
                  <li key={product.id} className="flex py-6">
                    <div className="h-24 w-48 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        // src={product.images.length > 0 ? product.images[0] : product.images}
                        // alt={product.images.length > 0 ? product.images[0] : product.images}
                        src={defaultImage}
                        alt={defaultImage}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={product.href}>{product.name}</a>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p>&#8377; {product.price}</p>
                        <div className="flex">
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            // onClick={() => removeItemFromCart(product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 w-full mt-5">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>&#8377; {total}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <p
                    onClick={onCheckOut}
                    className="flex items-center justify-center rounded-md border border-transparent bg-purple-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-purple-600 cursor-pointer"
                  >
                    Checkout
                  </p>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500 mb-10">
                  <p>
                    or&nbsp;
                    <Link to="/" className="font-medium text-purple-700 hover:text-purple-600">
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
              <div className="mt-6 mb-6">
                <p
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="flex items-center justify-center rounded-md border border-transparent bg-green-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-600 cursor-pointer"
                >
                  Check Your Orders
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">Cart is empty !!</div>
            </>
          )}
        </div>
      </div>
    </App>
  );
};

export default Cart;
