import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Instance } from '../../axios';
import { Routes } from '../../helpers/routeHelper';
import { addUser } from '../../redux/slices/userSlice';
import LoaderComp from '../components/Loader/Loader';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [viewLogin, setViewLogin] = useState(true);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user?.token) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => setCredentials((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  const onLogin = async () => {
    setIsLoading(true);
    if (viewLogin) {
      const userDetails = await Instance.post(Routes.auth.login, credentials)
        .then((res) => {
          dispatch(addUser(res.data));
          toast.success('Successfully loggedIn!');
          navigate('/');
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          console.log(error);
        })
        .finally(() => setIsLoading(false));
    } else {
      const userDetails = await Instance.post(Routes.auth.signup, credentials)
        .then((res) => {
          setViewLogin(true);
          toast.success(res?.data?.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          console.log(error);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-2xl lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
          {viewLogin ? 'Sign in' : 'Sign Up'}
        </h1>
        <form className="mt-6">
          <div className="mb-2">
            <label for="email" className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label for="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div class="flex flex-row justify-center gap-4">
            <div className="mt-6 mb-6">
              {isLoading ? (
                <div className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                  <LoaderComp size={24} color={'#fff'} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onLogin}
                  disabled={isLoading}
                  className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                >
                  {viewLogin ? 'Login' : 'Register'}
                </button>
              )}
            </div>
            <div className="mt-6 mb-6">
              <button
                type="button"
                onClick={() => setViewLogin((prev) => !prev)}
                disabled={isLoading}
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
              >
                {!viewLogin ? 'Login' : 'Register'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
