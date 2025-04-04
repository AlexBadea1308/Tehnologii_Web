import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import TrainingPlanDisplay from './TrainingPlanDisplay';
import NavigationBarManager from '../components_custom/NavigatorBarManager';

const TrainingPlanDetails = () => {
  const { id } = useParams(); // Preluam ID-ul din URL
  const { token } = useAuthStore();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        console.log('Fetching plan with ID:', id);
        const response = await axios.get(`/api/training-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Plan response:', response.data);
        setPlan(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plan:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load plan');
        setLoading(false);
        toast({
          title: 'Eroare',
          description: 'Nu s-a putut incarca planul.',
          status: 'error',
          duration: 3000,
        });
      }
    };

    if (token) {
      fetchPlan();
    }
  }, [id, token, toast]);

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8} textAlign="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <>
    <NavigationBarManager/>
    <Box p={8} maxW="800px" mx="auto">
      <TrainingPlanDisplay plan={plan} />
    </Box>
    </>  
    );
};

export default TrainingPlanDetails;