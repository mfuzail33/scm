import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router';
// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT, REGISTER } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project-imports
import Loader from 'components/Loader';
import axios from 'utils/axios.api';
import Dashboard from 'pages/apps/invoice/dashboard';
const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return true;
  }
  const decoded = jwtDecode(serviceToken);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const user = JSON.parse(localStorage.getItem('user'));
          dispatch({
            type: LOGIN,
            payload: { user },
          });
        } else {
          dispatch({
            type: LOGOUT,
          });
        }
      } catch (err) {
        console.log('token error')
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`/user/login`, {
        email,
        password,
      }, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      console.log(response.data);

      const serviceToken = response?.data?.token;
      const profileId = response?.data?.uid;
      const role = response?.data?.role;
      const name = `${response?.data?.firsname || ''} ${response?.data?.lastname || ''}`;
      setSession(serviceToken);
      localStorage.setItem("profileId", profileId);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
      localStorage.setItem('login', true);
      localStorage.setItem('name', name);
      navigate('/health')
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const register = async (email, password, firstname, lastname) => {
    const response = await axios.post('/user/create', {
      firstname,
      lastname,
      role: 'user',
      email,
      password,
    });
    let user = response.data;

    dispatch({
      type: REGISTER,
      payload: {
        user
      }
    });

    const res = await axios.post(`/user/login`, {
      email,
      password,
    }, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    localStorage.setItem("user", JSON.stringify(res.data));
    console.log(res.data);

    const serviceToken = res?.data?.token;
    const profileId = res?.data?.uid;
    const name = `${response?.data?.firsname || ''} ${response?.data?.lastname || ''}`;
    setSession(serviceToken);
    localStorage.setItem("profileId", profileId);
    localStorage.setItem('email', email);
    localStorage.setItem('role', 'user');
    localStorage.setItem('login', true);
    localStorage.setItem('name', name);


    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
      },
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('email');
    localStorage.removeItem('profileId');
    localStorage.removeItem('role');
    localStorage.removeItem('login');
    localStorage.removeItem('name');
    setSession(null);
    navigate(`/login`, {
      state: {
        from: ''
      }
    });
    dispatch({ type: LOGOUT });
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;