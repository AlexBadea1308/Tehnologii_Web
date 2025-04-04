import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import NavigationBarPlayer from '../components_custom/NavigatorBarPlayer';
import ContractCard from '../components_custom/ContractCard';
import { useContractStore } from '../store/contractStore';
import { useAuthStore } from '../store/authStore';
import { usePlayerStatsStore } from '../store/playerStatsStore';

const PlayerViewContract = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { contracts, loading: contractLoading, error: contractError, fetchContracts } = useContractStore();
  const { playerStats, loading: statsLoading, error: statsError, getStatsByPlayerId } = usePlayerStatsStore();
  const toast = useToast();
  const navigate = useNavigate();

  // Starea pentru formData
  const [formData, setFormData] = useState({
    playerId: user?._id || '',
    startDate: '',
    endDate: '',
    releaseClause: 'No Release Clause',
    contractLength: '1',
    salaryPerWeek: '0',
    bonusPerGoal: '0',
    squadRole: 'Do Not Specify',
  });

// Gasim contractul jucatorului curent
const playerContract = contracts.find(
    (contract) => contract.playerId && contract.playerId._id && 
    contract.playerId._id.toString() === user?._id?.toString()
  );
  
  const playerStat = playerStats || {};

  // Actualizam formData cand contractul este gasit
  useEffect(() => {
    if (playerContract) {
      setFormData({
        playerId: playerContract.playerId._id.toString(),
        startDate: playerContract.startDate ? new Date(playerContract.startDate).toISOString().split('T')[0] : '',
        endDate: playerContract.endDate ? new Date(playerContract.endDate).toISOString().split('T')[0] : '',
        releaseClause: playerContract.releaseClause || 'No Release Clause',
        contractLength: playerContract.contractLength ? playerContract.contractLength.toString() : '1',
        salaryPerWeek: playerContract.salaryPerWeek ? playerContract.salaryPerWeek.toString() : '0',
        bonusPerGoal: playerContract.bonusPerGoal ? playerContract.bonusPerGoal.toString() : '0',
        squadRole: playerContract.squadRole || 'Do Not Specify',
      });
    }
  }, [playerContract]);


    useEffect(() => {
    if (!isAuthenticated || user?.role !== 'player') {
      navigate('/login');
    } else {
      fetchContracts();
      console.log(user._id.toString());
      if (user?._id.toString())
        {
        getStatsByPlayerId(user._id.toString());
        }
    }
  }, [isAuthenticated, user, navigate, fetchContracts, getStatsByPlayerId]);

  // Gestionam erorile
  useEffect(() => {
    if (contractError || statsError) {
      toast({
        title: 'Error',
        description: contractError || statsError,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [contractError, statsError, toast]);

  if (!isAuthenticated) {
    return (
      <Box p={8} textAlign="center" sx={{ outline: 'none', userSelect: 'none' }}>
        <Text color="red.500">You must be authenticated to access this page.</Text>
        <RouterLink to="/login">
          <Text color="teal.500" mt={4} as="u">Go to Login</Text>
        </RouterLink>
      </Box>
    );
  }

  return (
    <>
      <NavigationBarPlayer />
      <Box p={8} maxW="1200px" mx="auto" sx={{ outline: 'none', userSelect: 'none' }}>
        <Heading mb={6}>Your Contract</Heading>
        <Flex justifyContent="center" direction="column" align="center">
          {playerContract ? (
            <ContractCard
              player={{
                _id: user._id,
                name: user.name || 'Unknown',
                surname: user.surname || '',
                position: playerStat?.position || user.position || 'N/A',
                profileImage: playerStat.profileImage || 'https://via.placeholder.com/200x200',
                matchesPlayed: playerStat?.matchesPlayed || 0,
                goals: playerStat?.goals || 0,
                assists: playerStat?.assists || 0,
                yellowCards: playerStat?.yellowCards || 0,
                redCards: playerStat?.redCards || 0,
              }}
              contract={playerContract}
              formData={formData}
              setFormData={() => {}}
            />
          ) : (
            <Box textAlign="center">
              <Text fontSize="lg" color="gray.500" mb={4}>
                No contract found.
              </Text>
              <Text fontSize="sm" color="gray.400">
                Please contact your manager if you believe this is an error.
              </Text>
            </Box>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default PlayerViewContract;