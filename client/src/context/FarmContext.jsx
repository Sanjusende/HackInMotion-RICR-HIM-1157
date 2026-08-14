import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getMyFarm, saveFarmProfile as saveFarmApi } from '../services/farmService';

import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// ------------------------------------------------------
// Constants
// ------------------------------------------------------

const FarmContext = createContext(null);

// ------------------------------------------------------
// Farm Provider
// ------------------------------------------------------

export const FarmProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------
  // Fetch Current User's Farm
  // ----------------------------------------------------

  const fetchFarm = useCallback(async () => {
    if (!isAuthenticated) {
      setFarm(null);
      setLoading(false);
      return null;
    }

    setLoading(true);

    try {
      const response = await getMyFarm();

      if (response?.success) {
        setFarm(response.data || null);
        return response.data || null;
      }

      setFarm(null);
      return null;
    } catch (error) {
      // A missing farm profile is treated as an empty state.
      // The service/API connection remains unchanged.

      const status = error?.response?.status;

      if (status !== 404) {
        console.error('[FarmContext] Failed to fetch farm profile:', error);
      }

      setFarm(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ----------------------------------------------------
  // Load Farm When Authentication Changes
  // ----------------------------------------------------

  useEffect(() => {
    fetchFarm();
  }, [fetchFarm]);

  // ----------------------------------------------------
  // Save Farm Profile
  // ----------------------------------------------------

  const saveFarm = useCallback(async (farmData) => {
    if (!farmData || typeof farmData !== 'object') {
      const error = new Error('Valid farm data is required.');

      toast.error(error.message);
      throw error;
    }

    setLoading(true);

    try {
      const response = await saveFarmApi(farmData);

      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Failed to save farm profile.');
      }

      const savedFarm = response.data || null;

      setFarm(savedFarm);

      toast.success('Farm profile saved successfully!');

      return savedFarm;
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save farm profile.';

      console.error('[FarmContext] Failed to save farm profile:', error);

      toast.error(message);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------
  // Derived State
  // ----------------------------------------------------

  const isProfileComplete = Boolean(farm);

  // ----------------------------------------------------
  // Context Value
  // ----------------------------------------------------

  const contextValue = useMemo(
    () => ({
      farm,
      loading,
      saveFarm,
      fetchFarm,
      isProfileComplete,
    }),
    [farm, loading, saveFarm, fetchFarm, isProfileComplete]
  );

  // ----------------------------------------------------
  // Provider
  // ----------------------------------------------------

  return <FarmContext.Provider value={contextValue}>{children}</FarmContext.Provider>;
};

// ------------------------------------------------------
// useFarm Hook
// ------------------------------------------------------

export const useFarm = () => {
  const context = useContext(FarmContext);

  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider.');
  }

  return context;
};

export default FarmContext;
