import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  Spinner,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import NavigationBarPlayer from '../components_custom/NavigatorBarPlayer';
import { useTrainingPlanStore } from '../store/trainingPlanStore.js';
import { useMatchStore } from '../store/matchStore.js';
import { useAuthStore } from '../store/authStore';
import TrainingPlanDisplay from './TrainingPlanDisplay';
import MatchCardView from '../components_custom/MatchCardView';

const PlayerViewTrainingPlan = () => {
  const { trainingPlans, loading: planLoading, error: planError, fetchTrainingPlans } = useTrainingPlanStore();
  const { matches, loading: matchLoading, error: matchError, fetchMatches } = useMatchStore();
  const { isAuthenticated, token } = useAuthStore();
  const toast = useToast();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const matchesPerPageLarge = 2;
  const matchesPerPageSmall = 1;
  const isLargeScreen = window.innerWidth >= 768;
  const matchesPerPage = isLargeScreen ? matchesPerPageLarge : matchesPerPageSmall;

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTrainingPlans();
      fetchMatches();
    }
  }, [fetchTrainingPlans, fetchMatches, isAuthenticated, token]);

  // Filter matches that have associated training plans
  const matchesWithPlans = matches.filter((match) => {
    const hasPlan = trainingPlans.some((plan) => {
      // Handle matchId as an object or string
      const planMatchId = typeof plan.matchId === 'object' ? plan.matchId._id : plan.matchId;
      return planMatchId === match._id;
    });
    return hasPlan;
  });

  const filteredMatches = matchesWithPlans.filter((match) =>
    match.teams.some((team) => team.toLowerCase().includes(filterText.toLowerCase()))
  );

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  const viewPlan = (matchId) => {
    const plan = trainingPlans.find((p) => {
      const planMatchId = typeof p.matchId === 'object' ? p.matchId._id : p.matchId;
      return planMatchId === matchId;
    });
    setSelectedPlan(plan);
  };

  // Debug logs
  console.log('All matches:', matches);
  console.log('All training plans:', trainingPlans);
  console.log('Matches with plans:', matchesWithPlans);
  console.log('Filtered matches:', filteredMatches);
  console.log('Current matches:', currentMatches);

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
      <NavigationBarPlayer />
      <Box p={8} maxW="1200px" mx="auto" sx={{ outline: 'none', userSelect: 'none' }}>
        <Heading mb={4}>Your Training Plans</Heading>
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
                  setSelectedPlan(null);
                }}
              />
            </FormControl>
            {filteredMatches.length === 0 ? (
              <Text>No matches with training plans found.</Text>
            ) : (
              <>
                <VStack spacing={6} align="stretch">
                  {currentMatches.map((match) => (
                    <MatchCardView 
                      key={match._id} 
                      match={match}
                      onOpenForm={() => viewPlan(match._id)}
                    />
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

          {selectedPlan && (
          <Box flex="2" p={6} maxW="600px" mx="auto">
            <TrainingPlanDisplay plan={selectedPlan} />
            <Button
              variant="outline"
              mt={4}
              onClick={() => setSelectedPlan(null)}
            >
              Close
            </Button>
          </Box>
        )}
        </Flex>
      </Box>
    </>
  );
};

export default PlayerViewTrainingPlan;