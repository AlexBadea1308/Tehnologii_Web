import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import NavigationBarManager from '../components_custom/NavigatorBarManager';
import PlayerCard from '../components_custom/PlayerCard';
import ContractCard from '../components_custom/ContractCard';
import { usePlayerStatsStore } from '../store/playerStatsStore';
import { useContractStore } from '../store/contractStore';
import { useAuthStore } from '../store/authStore';

const ManagerContract = () => {
  const { playerStats, loading: playerLoading, error: playerError, fetchPlayerStats } = usePlayerStatsStore();
  const { contracts, loading: contractLoading, error: contractError, fetchContracts, getContractByPlayerId, createContract, updateContract, deleteContract: deleteContractFromStore } = useContractStore();
  const { isAuthenticated, token, user } = useAuthStore();
  const toast = useToast();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [formData, setFormData] = useState({
    playerId: '',
    startDate: '',
    endDate: '',
    salary: '',
    releaseClause: '',
    contractLength: '',
    salaryPerWeek: '',
    bonusPerGoal: '',
    squadRole: 'Do Not Specify',
    createdBy: user?.id || 'default_manager_id',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const matchesPerPageLarge = 2;
  const matchesPerPageSmall = 1;
  const isLargeScreen = window.innerWidth >= 768;
  const playersPerPage = isLargeScreen ? matchesPerPageLarge : matchesPerPageSmall;

  useEffect(() => {
    if (playerStats.length > 0) {
      const processed = playerStats.map(stat => ({
        ...stat,
        name: stat.playerId.name || 'Unknown',
        surname: stat.playerId.surname || '',
        position: stat.position || 'N/A',
      }));
      setProcessedPlayerStats(processed);
    }
  }, [playerStats]);

  const [processedPlayerStats, setProcessedPlayerStats] = useState([]);
  const filteredPlayers = processedPlayerStats.filter((playerStat) =>
    `${playerStat.name || ''} ${playerStat.surname || ''}`.toLowerCase().includes(filterText.toLowerCase())
  );

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchPlayerStats();
      fetchContracts();
    }
  }, [isAuthenticated, token, fetchPlayerStats, fetchContracts]);

  const openForm = async (playerStat) => {
    setSelectedPlayer(playerStat);
    const playerId = playerStat.playerId._id.toString();
  
    try {
      const result = await getContractByPlayerId(playerId);
      if (result.success) {
        setSelectedContract(result.data);
        setFormData({
          playerId: playerId,
          startDate: result.data.startDate ? new Date(result.data.startDate).toISOString().split('T')[0] : '',
          endDate: result.data.endDate ? new Date(result.data.endDate).toISOString().split('T')[0] : '',
          releaseClause: result.data.releaseClause || "No Release Clause",
          contractLength: result.data.contractLength || '',
          salaryPerWeek: result.data.salaryPerWeek || '',
          bonusPerGoal: result.data.bonusPerGoal || '',
          squadRole: result.data.squadRole || 'Do Not Specify',
          createdBy: user?.id || result.data.createdBy || 'default_manager_id',
        });
      } else {
        setSelectedContract(null);
        setFormData({
          playerId: playerId,
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          releaseClause: "No Release Clause",
          contractLength: '1',
          salaryPerWeek: '',
          bonusPerGoal: '',
          squadRole: 'Do Not Specify',
          createdBy: user?.id || 'default_manager_id',
        });
      }
    } catch (error) {
      console.error('Error checking contract:', error.message);
      setSelectedContract(null);
      setFormData({
        playerId: playerId,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        releaseClause: "No Release Clause",
        contractLength: '1',
        salaryPerWeek: '',
        bonusPerGoal: '',
        squadRole: 'Do Not Specify',
        createdBy: user?.id || 'default_manager_id',
      });
    }
  
    setIsFormVisible(true);
  };
  
  const openNewContractForm = async (playerStat) => {
    setSelectedPlayer(playerStat);
    const playerId = playerStat.playerId._id.toString();
  
    setSelectedContract(null);
    setFormData({
      playerId: playerId,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      releaseClause: "No Release Clause",
      contractLength: '1',
      salaryPerWeek: '',
      bonusPerGoal: '',
      squadRole: 'Do Not Specify',
      createdBy: user?.id || 'default_manager_id',
    });
  
    setIsFormVisible(true);
  };

  const saveContract = async () => {
    try {
      let result;
      if (selectedContract) {
        result = await updateContract(selectedContract._id, formData);
      } else {
        result = await createContract(formData);
      }
  
      if (result.success) {
        toast({
          title: selectedContract ? 'Contract updated successfully' : 'Contract created successfully',
          status: 'success',
          duration: 3000,
        });
        await fetchContracts();
        setIsFormVisible(false);
      } else {
        throw new Error(result.message || 'Failed to save contract');
      }
    } catch (error) {
      console.error('Error saving contract:', error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save contract.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const deleteContract = async (contractId) => {
    try {
      const result = await deleteContractFromStore(contractId);
      
      if (result.success) {
        toast({
          title: 'Contract deleted successfully',
          status: 'success',
          duration: 3000,
        });
        await fetchContracts();
        setIsFormVisible(false);
      } else {
        throw new Error(result.message || 'Failed to delete contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete contract.',
        status: 'error',
        duration: 3000,
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

  if (playerError || contractError) {
    return (
      <Box p={8} textAlign="center" sx={{ outline: 'none', userSelect: 'none' }}>
        <Text color="red.500">{playerError || contractError}</Text>
      </Box>
    );
  }

  return (
    <>
      <NavigationBarManager />
      <Box p={8} maxW="1200px" mx="auto" sx={{ outline: 'none', userSelect: 'none' }}>
        <Heading mb={4}>Manage Contracts</Heading>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          <Box flex="1" maxW={{ md: '400px' }}>
            <FormControl mb={4}>
              <FormLabel>Search by Player Name</FormLabel>
              <Input
                placeholder="Enter player name..."
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </FormControl>
            {filteredPlayers.length === 0 ? (
              <Text>No players found.</Text>
            ) : (
              <>
                <VStack spacing={6} align="stretch">
                  {currentPlayers.map((playerStat) => {
                    const playerContract = contracts.find(
                      (contract) => contract.playerId && contract.playerId._id && 
                      contract.playerId._id.toString() === playerStat.playerId._id.toString()
                    );
                    return (
                      <Box key={playerStat._id}>
                        <PlayerCard
                          player={{
                            _id: playerStat.playerId._id,
                            name: playerStat.name || 'Unknown',
                            surname: playerStat.surname || '',
                            position: playerStat.position || 'N/A',
                            matchesPlayed: playerStat.matchesPlayed || 0,
                            goals: playerStat.goals || 0,
                            assists: playerStat.assists || 0,
                            yellowCards: playerStat.yellowCards || 0,
                            redCards: playerStat.redCards || 0,
                            profileImage: playerStat.profileImage || 'https://via.placeholder.com/200x200',
                          }}
                        />
                        <HStack mt={2} spacing={2} ml={10}>
                          {playerContract ? (
                            <>
                              <Button
                                colorScheme="blue"
                                size="sm"
                                onClick={() => openForm(playerStat)}
                              >
                                Edit
                              </Button>
                              <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this contract?')) {
                                    deleteContract(playerContract._id);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          ) : (
                            <Button
                              colorScheme="green"
                              size="sm"
                              onClick={() => openNewContractForm(playerStat)}
                            >
                              Create Contract
                            </Button>
                          )}
                        </HStack>
                      </Box>
                    );
                  })}
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
            <Flex justifyContent="center" mt="100px" width="100%">
              <Box>
                <ContractCard
                  player={{
                    _id: selectedPlayer.playerId._id,
                    name: selectedPlayer.name || 'Unknown',
                    surname: selectedPlayer.surname || '',
                    position: selectedPlayer.position || 'N/A',
                    matchesPlayed: selectedPlayer.matchesPlayed || 0,
                    goals: selectedPlayer.goals || 0,
                    assists: selectedPlayer.assists || 0,
                    yellowCards: selectedPlayer.yellowCards || 0,
                    redCards: selectedPlayer.redCards || 0,
                    profileImage: selectedPlayer.profileImage || 'https://via.placeholder.com/200x200',
                  }}
                  contract={selectedContract}
                  onSave={saveContract}
                  onCancel={() => setIsFormVisible(false)}
                  formData={formData}
                  setFormData={setFormData}
                />
              </Box>
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default ManagerContract;