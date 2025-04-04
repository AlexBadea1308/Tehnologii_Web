import React, { useEffect, useState } from 'react';
import {
  Container, SimpleGrid, Box, Heading, Text, Flex, Button, HStack, Divider,
  useColorModeValue, Collapse, useDisclosure, Input, InputGroup, InputLeftElement,
  Checkbox, CheckboxGroup, Stack, Badge, Select, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast, FormControl,
  FormLabel, NumberInput, NumberInputField, Image
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { usePlayerStatsStore } from '../store/playerStatsStore';
import NavigationBarAdmin from '../components_custom/NavigatorBarAdmin';
import PlayerCardEdit from '../components_custom/PlayerCardEdit';

const AdminPlayerStatsPage = () => {
  const [playerStats, setPlayerStats] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [createForm, setCreateForm] = useState({
    playerId: '', position: '', matchesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, profileImage: ''
  });
  const playersPerPage = 4;
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { fetchPlayerStats, createPlayerStat, deletePlayerStat } = usePlayerStatsStore();
  const token = useAuthStore(state => state.token);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const positionGroups = {
    'all': 'All Positions', 'forward': 'Forwards', 'midfielder': 'Midfielders',
    'defender': 'Defenders', 'goalkeeper': 'Goalkeepers'
  };

  const positions = ['ST', 'LW', 'RW', 'CM', 'CDM', 'CAM', 'LB', 'RB', 'CB', 'GK', 'LM', 'RM', 'CF'];

  const getPositionGroup = (position) => {
    const forwards = ['RW', 'LW', 'CF', 'ST'];
    const midfielders = ['CAM', 'CM', 'CDM', 'LM', 'RM'];
    const defenders = ['CB', 'LB', 'RB'];
    const goalkeepers = ['GK'];
    if (forwards.includes(position)) return 'forward';
    if (midfielders.includes(position)) return 'midfielder';
    if (defenders.includes(position)) return 'defender';
    if (goalkeepers.includes(position)) return 'goalkeeper';
    return 'unknown';
  };

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const statsResult = await fetchPlayerStats();
        if (statsResult.success) {
          const processed = statsResult.data.map(stat => ({
            ...stat, name: stat.playerId.name, surname: stat.playerId.surname, username: stat.playerId.username
          }));
          setPlayerStats(processed);
        }

        const usersResponse = await axios.get('/api/users/all-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usersResponse.data.success) {
          const allPlayers = usersResponse.data.data.filter(user => user.role === 'player');
          const playerIdsWithStats = statsResult.data.map(stat => stat.playerId._id.toString());
          const playersWithoutStats = allPlayers.filter(player => !playerIdsWithStats.includes(player._id));
          setAvailablePlayers(playersWithoutStats);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load data.", status: "error", duration: 3000, isClosable: true });
      }
    };
    if (token) loadData();
  }, [fetchPlayerStats, token, toast]);

  // Filtering and sorting
  useEffect(() => {
    let filtered = [...playerStats];
    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (positionFilter !== 'all') {
      filtered = filtered.filter(player => getPositionGroup(player.position) === positionFilter);
    }
    switch (sortBy) {
      case 'mostGoals': filtered.sort((a, b) => b.goals - a.goals); break;
      case 'mostAssists': filtered.sort((a, b) => b.assists - a.assists); break;
      case 'mostMatches': filtered.sort((a, b) => b.matchesPlayed - a.matchesPlayed); break;
      case 'nameAZ': filtered.sort((a, b) => `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)); break;
      case 'nameZA': filtered.sort((a, b) => `${b.name} ${b.surname}`.localeCompare(`${a.name} ${a.surname}`)); break;
      default: break;
    }
    setFilteredPlayers(filtered);
  }, [playerStats, searchTerm, positionFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const currentPlayers = filteredPlayers.slice((currentPage - 1) * playersPerPage, currentPage * playersPerPage);

  useEffect(() => setCurrentPage(1), [filteredPlayers]);

  // Handle form changes for create
  const handleCreateFormChange = (field, value) => setCreateForm(prev => ({ ...prev, [field]: value }));

  // Handle image upload for create (convert to base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateForm(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Create
  const handleCreate = async () => {
    const newPlayerStatsData = {
      playerId: createForm.playerId,
      position: createForm.position,
      matchesPlayed: createForm.matchesPlayed,
      goals: createForm.goals,
      assists: createForm.assists,
      yellowCards: createForm.yellowCards,
      redCards: createForm.redCards,
      profileImage: createForm.profileImage || ''
    };

    if (!newPlayerStatsData.playerId || !newPlayerStatsData.position) {
      toast({ title: "Error", description: "Player and position are required.", status: "error", duration: 3000, isClosable: true });
      return;
    }

    try {
      const response = await axios.post('/api/player-stats', newPlayerStatsData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const newStat = { ...response.data.data, name: response.data.data.playerId.name, surname: response.data.data.playerId.surname, username: response.data.data.playerId.username };
      setPlayerStats([...playerStats, newStat]);
      setAvailablePlayers(availablePlayers.filter(player => player._id !== newPlayerStatsData.playerId));
      setCreateForm({ playerId: '', position: '', matchesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, profileImage: '' });
      onCreateClose();
      toast({ title: "Success", description: "Player stats created.", status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create player stats.", status: "error", duration: 3000, isClosable: true });
    }
  };

// Handle Update
const handleUpdate = async (id, updatedPlayerStatsData) => {
  try {
    const response = await axios.put(`/api/player-stats/${id}`, updatedPlayerStatsData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    const updatedStat = { ...response.data.data, name: response.data.data.playerId.name, surname: response.data.data.playerId.surname, username: response.data.data.playerId.username };
    setPlayerStats(playerStats.map(stat => stat._id === id ? updatedStat : stat));
    return { success: true, data: updatedStat }; 
  } catch (error) {
    return { success: false, message: error.message || "Failed to update player stats" };
  }
};

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const result = await deletePlayerStat(id);
      if (result.success) {
        const deletedPlayer = playerStats.find(stat => stat._id === id);
        setPlayerStats(playerStats.filter(stat => stat._id !== id));
        setAvailablePlayers([...availablePlayers, { _id: deletedPlayer.playerId._id, username: deletedPlayer.username, name: deletedPlayer.name, surname: deletedPlayer.surname, role: 'player' }]);
        toast({ title: "Success", description: "Player stats deleted.", status: "success", duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete player stats.", status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <>
      <NavigationBarAdmin />
      <Container maxW="1500px" py={8} bgGradient="linear-gradient(0deg, rgba(147,51,234,1) 0%, rgba(79,70,229,0.3253676470588235) 100%)" sx={{ outline: 'none', userSelect: 'none' }}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h1" color="white">Player Statistics</Heading>
          <Button colorScheme="purple" onClick={onCreateOpen}>Create Player Stats</Button>
        </Flex>

        {/* Filter and Sort Section */}
        <Box mb={6} p={4} bg={bgColor} borderRadius="md" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading as="h3" size="md">Filters & Sorting</Heading>
            <Button variant="ghost" onClick={onFilterToggle} rightIcon={isFilterOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}>
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Flex>
          <Collapse in={isFilterOpen} animateOpacity>
            <Flex direction={{ base: "column", md: "row" }} wrap="wrap" mt={4} gap={4}>
              <Box minW={{ base: "100%", md: "280px" }}>
                <Text mb={2} fontWeight="medium">Search Player</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
                  <Input placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </InputGroup>
              </Box>
              <Box minW={{ base: "100%", md: "200px" }}>
                <Text mb={2} fontWeight="medium">Sort By</Text>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Default</option>
                  <option value="mostGoals">Most Goals</option>
                  <option value="mostAssists">Most Assists</option>
                  <option value="mostMatches">Most Matches</option>
                  <option value="nameAZ">Name: A to Z</option>
                  <option value="nameZA">Name: Z to A</option>
                </Select>
              </Box>
              <Box minW={{ base: "100%", md: "280px" }}>
                <Text mb={2} fontWeight="medium">Position</Text>
                <CheckboxGroup value={[positionFilter]} onChange={(values) => setPositionFilter(values[0] || 'all')}>
                  <Stack direction={{ base: "column", md: "row" }} wrap="wrap" spacing={4}>
                    {Object.entries(positionGroups).map(([key, label]) => (
                      <Checkbox key={key} value={key}>{label}</Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </Flex>
            <Divider my={4} />
            <Box alignSelf="flex-end" ml="auto">
              <Button colorScheme="purple" variant="outline" onClick={() => { setSearchTerm(''); setPositionFilter('all'); setSortBy('default'); }}>
                Clear Filters
              </Button>
            </Box>
          </Collapse>
        </Box>

        {/* Filter Summary */}
        {(searchTerm || positionFilter !== 'all' || sortBy !== 'default') && (
          <Flex wrap="wrap" gap={2} mb={4}>
            <Text fontWeight="medium" color="white">Active Filters:</Text>
            {searchTerm && <Badge colorScheme="blue" variant="solid" px={2} py={1}>Search: {searchTerm}</Badge>}
            {positionFilter !== 'all' && <Badge colorScheme="purple" variant="solid" px={2} py={1}>{positionGroups[positionFilter]}</Badge>}
            {sortBy !== 'default' && (
              <Badge colorScheme="orange" variant="solid" px={2} py={1}>
                Sorted: {sortBy === 'mostGoals' ? 'Most Goals' : sortBy === 'mostAssists' ? 'Most Assists' : sortBy === 'mostMatches' ? 'Most Matches' : sortBy === 'nameAZ' ? 'Name: A to Z' : 'Name: Z to A'}
              </Badge>
            )}
          </Flex>
        )}

        {/* Players Grid */}
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Text color="white">Showing {currentPlayers.length} of {filteredPlayers.length} players</Text>
          </Flex>
          {currentPlayers.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} mb={8}>
              {currentPlayers.map((player) => (
                <PlayerCardEdit key={player._id} player={player} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius={12} boxShadow="md">
              <Text fontSize="xl" color="gray.600">No players found matching your filters</Text>
              <Button colorScheme="purple" mt={4} onClick={() => { setSearchTerm(''); setPositionFilter('all'); setSortBy('default'); }}>Clear Filters</Button>
            </Box>
          )}
          <HStack spacing={4} mt={6} justify="center">
            <Button isDisabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
            <Text color="white">Page {currentPage} of {totalPages}</Text>
            <Button isDisabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
          </HStack>
        </Box>

        {/* Create Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Player Stats</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Player</FormLabel>
                <Select placeholder="Select Player" value={createForm.playerId} onChange={(e) => handleCreateFormChange('playerId', e.target.value)}>
                  {availablePlayers.map(player => (
                    <option key={player._id} value={player._id}>{player.name} {player.surname} ({player.username})</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Position</FormLabel>
                <Select placeholder="Select Position" value={createForm.position} onChange={(e) => handleCreateFormChange('position', e.target.value)}>
                  {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Matches Played</FormLabel>
                <NumberInput min={0} value={createForm.matchesPlayed} onChange={(val) => handleCreateFormChange('matchesPlayed', Number(val))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Goals</FormLabel>
                <NumberInput min={0} value={createForm.goals} onChange={(val) => handleCreateFormChange('goals', Number(val))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Assists</FormLabel>
                <NumberInput min={0} value={createForm.assists} onChange={(val) => handleCreateFormChange('assists', Number(val))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Yellow Cards</FormLabel>
                <NumberInput min={0} value={createForm.yellowCards} onChange={(val) => handleCreateFormChange('yellowCards', Number(val))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Red Cards</FormLabel>
                <NumberInput min={0} value={createForm.redCards} onChange={(val) => handleCreateFormChange('redCards', Number(val))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Profile Image</FormLabel>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {createForm.profileImage && <Image src={createForm.profileImage} alt="Preview" maxH="100px" mt={2} />}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="purple" mr={3} onClick={handleCreate}>Create</Button>
              <Button variant="ghost" onClick={onCreateClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default AdminPlayerStatsPage;