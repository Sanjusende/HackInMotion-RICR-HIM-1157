import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyFarm, saveFarmProfile as saveFarmApi } from '../services/farmService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const FarmContext = createContext(null);

export const FarmProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFarm = async () => {
    if (!isAuthenticated) {
      setFarm(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getMyFarm();
      if (res.success) {
        setFarm(res.data);
      }
    } catch (err) {
      // 404 means farm profile is not set up yet
      setFarm(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarm();
  }, [isAuthenticated]);

  const saveFarm = async (farmData) => {
    try {
      setLoading(true);
      const res = await saveFarmApi(farmData);
      if (res.success) {
        setFarm(res.data);
        toast.success('Farm profile saved successfully!');
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to save farm profile';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmContext.Provider value={{ farm, loading, saveFarm, fetchFarm, isProfileComplete: Boolean(farm) }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
