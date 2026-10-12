import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { api } from '../api';

const AppContext = createContext(null);

const initialState = {
  doctors: [],
  patients: [],
  loading: true,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload };
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadDoctors = useCallback(async () => {
    const data = await api.get('/doctors');
    dispatch({ type: 'SET_DOCTORS', payload: data });
  }, []);

  const loadPatients = useCallback(async () => {
    const data = await api.get('/patients');
    dispatch({ type: 'SET_PATIENTS', payload: data });
  }, []);

  // Load the shared data once when the app starts
  useEffect(() => {
    async function loadAll() {
      try {
        await Promise.all([loadDoctors(), loadPatients()]);
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    loadAll();
  }, [loadDoctors, loadPatients]);

  const value = { ...state, loadDoctors, loadPatients };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext);
}
