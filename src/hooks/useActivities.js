import { useState } from 'react';
import { activityService } from '../api/activityService';
import { useAuth } from '../context/AuthContext';
import useFetch from './useFetch';

const useActivities = () => {
  const { userId } = useAuth();
  const [filters, setFilters] = useState({});

  const fetchActivitiesWithFilters = async () => {
    return activityService.getUpcomingActivities(userId, filters);
  };

  const { data: activities, loading, error, refetch } =
    useFetch(fetchActivitiesWithFilters, [filters]);

  const handleApplyFilters = (newFilters) => {
    // ΚΡΑΤΑΜΕ μόνο όσα έχουν “κανονική” τιμή (όχι '', null, undefined)
    const cleaned = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => {
        if (value == null) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return true;
      })
    );

    // ΔΕΝ χρειάζεται merge με τα παλιά – αυτά είναι τα τωρινά φίλτρα
    setFilters(cleaned);
  };

  return {
    activities,
    loading,
    error,
    currentFilters: filters,
    handleApplyFilters,
    refetch,
  };
};

export default useActivities;
