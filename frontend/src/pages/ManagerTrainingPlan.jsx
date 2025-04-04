import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  Spinner,
  Text,
  useToast,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import NavigationBarManager from '../components_custom/NavigatorBarManager';
import { useTrainingPlanStore } from '../store/trainingPlanStore.js';
import { useMatchStore } from '../store/matchStore.js';
import { useAuthStore } from '../store/authStore';
import MatchCard from '../components_custom/MatchCard';
import axios from 'axios';

const ManagerTrainingPlan = () => {
  const { trainingPlans, loading: planLoading, error: planError, fetchTrainingPlans } = useTrainingPlanStore();
  const { matches, loading: matchLoading, error: matchError, fetchMatches } = useMatchStore();
  const { isAuthenticated, token, user } = useAuthStore();
  const toast = useToast();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [formData, setFormData] = useState({
    matchId: '',
    title: '',
    description: '',
    date: '',
    duration: '',
    exercises: [{ name: '', description: '', duration: '' }],
    createdBy: user?.id || 'default_manager_id',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const matchesPerPageLarge = 2;
  const matchesPerPageSmall = 1;
  const isLargeScreen = window.innerWidth >= 768;
  const matchesPerPage = isLargeScreen ? matchesPerPageLarge : matchesPerPageSmall;

  const filteredMatches = matches.filter((match) =>
    match.teams.some((team) => team.toLowerCase().includes(filterText.toLowerCase()))
  );

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTrainingPlans();
      fetchMatches();
    }
  }, [fetchTrainingPlans, fetchMatches, isAuthenticated, token]);

  const openForm = (matchId, plan = null) => {
    setSelectedMatchId(matchId);
    setSelectedPlan(plan);
    if (plan) {
      setFormData({
        matchId: plan.matchId?._id || plan.matchId || '',
        title: plan.title || '',
        description: plan.description || '',
        date: plan.date ? new Date(plan.date).toISOString().split('T')[0] : '',
        duration: plan.duration || '',
        exercises: plan.exercises && plan.exercises.length > 0 
          ? plan.exercises 
          : [{ name: '', description: '', duration: '' }],
        createdBy: user?.id || plan.createdBy || 'default_manager_id',
      });
    } else {
      setFormData({
        matchId: matchId || '',
        title: '',
        description: '',
        date: '',
        duration: '',
        exercises: [{ name: '', description: '', duration: '' }],
        createdBy: user?.id || 'default_manager_id',
      });
    }
    setIsFormVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = value;
    setFormData({ ...formData, exercises: newExercises });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', description: '', duration: '' }],
    });
  };

  const removeExercise = (index) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: newExercises });
  };

  const validateTrainingDate = (trainingDate, matchId) => {
    if (!trainingDate || isNaN(new Date(trainingDate).getTime())) {
      return { isValid: false, message: 'Training date is invalid.' };
    }

    const match = matches.find(m => m._id === matchId);
    if (!match) {
      return { isValid: false, message: 'Match not found.' };
    }

    if (!match.eventDate || isNaN(new Date(match.eventDate).getTime())) {
      return { isValid: false, message: 'Match date is invalid.' };
    }

    const matchDate = new Date(match.eventDate).toISOString().split('T')[0];
    const trainingDateObj = new Date(trainingDate);

    if (matchDate === trainingDate) {
      return { isValid: false, message: 'Training cannot be scheduled on the match day!' };
    }

    if (trainingDateObj > new Date(matchDate)) {
      return { isValid: false, message: 'Training cannot be scheduled after the match date!' };
    }

    return { isValid: true, message: '' };
  };

  const savePlan = async () => {
    const matchIdToValidate = selectedMatchId || formData.matchId;
    const { isValid, message } = validateTrainingDate(formData.date, matchIdToValidate);

    if (!isValid) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const payload = { ...formData, matchId: selectedMatchId || formData.matchId };
      let response;
      if (selectedPlan) {
        response = await axios.put(`/api/training-plans/${selectedPlan._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post('/api/training-plans', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      toast({
        title: selectedPlan ? 'Plan updated successfully' : 'Plan created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchTrainingPlans();
      setIsFormVisible(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save plan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deletePlan = async () => {
    if (!selectedPlan) {
      toast({
        title: 'Error',
        description: 'No plan selected for deletion.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.delete(`/api/training-plans/${selectedPlan._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: 'Plan deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchTrainingPlans();
      setIsFormVisible(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete plan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Box p={8} textAlign="center" sx={{ outline: 'none', userSelect: 'none' }}>
        <Text color="red.500">You must be authenticated to access this page.</Text>
        <Button as={RouterLink} to="/login" colorScheme="teal" mt={4}>
          Go to Login
        </Button>
      </Box>
    );
  }


  if (planError || matchError) {
    return (
      <Box p={8} textAlign="center" sx={{ outline: 'none', userSelect: 'none' }}>
        <Text color="red.500">{planError || matchError}</Text>
      </Box>
    );
  }

  return (
    <>
      <NavigationBarManager />
      <Box p={8} maxW="1200px" mx="auto" sx={{ outline: 'none', userSelect: 'none' }}>
        <Heading mb={4}>Available Matches</Heading>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          <Box flex="1" maxW={{ md: '400px' }}>
            <FormControl mb={4}>
              <FormLabel>Search by Team Name</FormLabel>
              <Input
                placeholder="Enter team name..."
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </FormControl>
            {filteredMatches.length === 0 ? (
              <Text>No matches found.</Text>
            ) : (
              <>
                <VStack spacing={6} align="stretch">
                  {currentMatches.map((match) => (
                    <MatchCard key={match._id} match={match} onOpenForm={openForm} />
                  ))}
                </VStack>
                <HStack justify="center" mt={6}>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    isDisabled={currentPage === 1}
                    colorScheme="teal"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Text>
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    isDisabled={currentPage === totalPages}
                    colorScheme="teal"
                    size="sm"
                  >
                    Next
                  </Button>
                </HStack>
              </>
            )}
          </Box>

          {isFormVisible && (
            <Box flex="2" p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Heading size="md" mb={4}>
                {selectedPlan ? 'Edit Training Plan' : 'Create Training Plan'}
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input name="title" value={formData.title} onChange={handleChange} required />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea name="description" value={formData.description} onChange={handleChange} required />
                </FormControl>

                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </FormControl>

                <FormControl>
                  <FormLabel>Total Duration (minutes)</FormLabel>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </FormControl>

                <Heading size="sm" mt={4}>Exercises</Heading>
                {formData.exercises.map((exercise, index) => (
                  <HStack key={index} spacing={4} align="start">
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Input
                        value={exercise.description}
                        onChange={(e) => handleExerciseChange(index, 'description', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Duration (min)</FormLabel>
                      <Input
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                      />
                    </FormControl>
                    <IconButton
                      aria-label="Delete exercise"
                      icon={<DeleteIcon />}
                      onClick={() => removeExercise(index)}
                      colorScheme="red"
                    />
                  </HStack>
                ))}
                <Button leftIcon={<AddIcon />} onClick={addExercise} colorScheme="teal">
                  Add Exercise
                </Button>

                <HStack mt={6} spacing={4}>
                  <Button colorScheme="blue" onClick={savePlan}>
                    {selectedPlan ? 'Update' : 'Save'}
                  </Button>
                  {selectedPlan && (
                    <Button colorScheme="red" onClick={deletePlan}>
                      Delete
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setIsFormVisible(false)}>
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </Box>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default ManagerTrainingPlan;