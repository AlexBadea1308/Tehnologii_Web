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
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import NavigationBarManager from '../components_custom/NavigatorBarPlayer';
import { useMatchStore } from '../store/matchStore.js';
import { useAuthStore } from '../store/authStore';
import { useSquadStore } from '../store/squadStore';
import { usePlayerStatsStore } from '../store/playerStatsStore';
import MatchSquad from '../components_custom/MatchSquad';
import SquadDisplay from '../components_custom/SquadDisplay';

const PlayerFixturesView = () => {
  const { matches, loading: matchLoading, error: matchError, fetchMatches } = useMatchStore();
  const { isAuthenticated, token } = useAuthStore();
  const { getSquadByMatchId } = useSquadStore();
  const { playerStats, loading: statsLoading, error: statsError, fetchPlayerStats } = usePlayerStatsStore(); // Add playerStats store
  const toast = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [squads, setSquads] = useState({});
  const [selectedMatchId, setSelectedMatchId] = useState(null);

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
      fetchMatches();
      fetchPlayerStats();
    }
  }, [fetchMatches, fetchPlayerStats, isAuthenticated, token]);

  const handleViewSquad = async (matchId) => {
    if (selectedMatchId === matchId) {
      setSelectedMatchId(null);
      return;
    }

    if (squads[matchId]) {
      setSelectedMatchId(matchId);
      return;
    }

    try {
      const result = await getSquadByMatchId(matchId);
      console.log('Squad fetch result for', matchId, ':', result);
      if (result.success && result.data) {
        setSquads((prev) => ({
          ...prev,
          [matchId]: result.data,
        }));
        setSelectedMatchId(matchId);
      } else {
        toast({
          title: 'No Squad',
          description: 'No squad has been prepared for this match.',
          status: 'info',
          duration: 3000,
          isClosable: true,
          
        });
      }
    } catch (error) {
      console.error('Error fetching squad:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch squad. Please try again.',
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

  if (matchError || statsError) {
    return (
      <Box p={8} textAlign="center" sx={{ outline: 'none', userSelect: 'none' }}>
        <Text color="red.500">{matchError || statsError}</Text>
      </Box>
    );
  }

  return (
    <>
      <NavigationBarManager />
      <Box p={8} maxW="1200px" mx="auto" sx={{ outline: 'none', userSelect: 'none' }}>
        <Heading mb={4}>Available Matches</Heading>
        <Flex direction="row" gap={8}>
          {/* Left Column: Match List */}
          <Box w="300px" minW="300px">
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
                    <Box key={match._id}>
                      <MatchSquad match={match} />
                      <Button
                        mt={2}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleViewSquad(match._id)}
                      >
                        {selectedMatchId === match._id ? 'Hide Squad' : 'View Squad'}
                      </Button>
                    </Box>
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

          {/* Right Column: Squad Display */}
          <Box flex="1">
            {selectedMatchId && squads[selectedMatchId] ? (
              <SquadDisplay
                squad={squads[selectedMatchId]}
                formationKey={squads[selectedMatchId].formation || '4-3-3'}
                playerStats={playerStats}
              />
            ) : (
              <Text>Select a match to view its squad here.</Text>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default PlayerFixturesView;