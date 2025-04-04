import React, { useState, useEffect } from 'react';
import { 
  Box, Heading, SimpleGrid, useToast, Flex, InputGroup, InputLeftElement, Input, 
  Select, Button, HStack, Text, Collapse, useDisclosure, Stack, RadioGroup, Radio,
  Badge, Divider, Container, useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import NavigationBarManager from '../components_custom/NavigatorBarManager';
import PlayerCard from '../components_custom/PlayerCard';
import { usePlayerStatsStore } from '../store/playerStatsStore';

const ManagerPlayerStats = () => {
  const { fetchPlayerStats, playerStats, loading } = usePlayerStatsStore();
  const [processedPlayerStats, setProcessedPlayerStats] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 10;
  const toast = useToast();
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });
  
  // Color mode values for better visibility
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  // Defining position groups
  const positionGroups = {
    'all': 'All Positions',
    'forward': 'Forwards',
    'midfielder': 'Midfielders',
    'defender': 'Defenders',
    'goalkeeper': 'Goalkeepers'
  };

  // Position classification helper
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

  useEffect(() => {
    const getStats = async () => {
      try {
        await fetchPlayerStats();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load player stats.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    getStats();
  }, [fetchPlayerStats, toast]);

  // Process player stats to add name, surname, and username at the root level
  useEffect(() => {
    if (playerStats.length > 0) {
      const processed = playerStats.map(stat => ({
        ...stat,
        name: stat.playerId.name,
        surname: stat.playerId.surname,
        username: stat.playerId.username,
      }));
      setProcessedPlayerStats(processed);
    }
  }, [playerStats]);

  useEffect(() => {
    if (!processedPlayerStats.length) return;

    let filtered = [...processedPlayerStats];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply position filter
    if (positionFilter !== 'all') {
      filtered = filtered.filter(player => 
        getPositionGroup(player.position) === positionFilter
      );
    }

    // Apply sorting
    switch(sortBy) {
      case 'mostGoals':
        filtered.sort((a, b) => b.goals - a.goals);
        break;
      case 'mostAssists':
        filtered.sort((a, b) => b.assists - a.assists);
        break;
      case 'mostMatches':
        filtered.sort((a, b) => b.matches - a.matches);
        break;
      case 'nameAZ':
        filtered.sort((a, b) => `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`));
        break;
      case 'nameZA':
        filtered.sort((a, b) => `${b.name} ${b.surname}`.localeCompare(`${a.name} ${a.surname}`));
        break;
      default:
        break;
    }

    setFilteredPlayers(filtered);
  }, [processedPlayerStats, searchTerm, positionFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const currentPlayers = filteredPlayers.slice(
    (currentPage - 1) * playersPerPage, 
    currentPage * playersPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, positionFilter, sortBy]);

  return (
    <>
      <NavigationBarManager />
      <Container maxW="1500px" py={8}  sx={{ outline: 'none', userSelect: 'none' }}>
        <Heading as="h1" mb={6} color={textColor}>Player Statistics</Heading>
        
        {/* Filter and Sort Section */}
        <Box mb={6} p={4} bg={bgColor} borderRadius="md" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading as="h3" size="md" color={textColor}>
              Filters & Sorting
            </Heading>
            <Button 
              variant="ghost" 
              onClick={onFilterToggle}
              rightIcon={isFilterOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}>
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Flex>

          <Collapse in={isFilterOpen} animateOpacity>
            <Flex direction={{ base: "column", md: "row" }} wrap="wrap" mt={4} gap={4}>
              {/* Search */}
              <Box minW={{ base: "100%", md: "280px" }}>
                <Text mb={2} fontWeight="medium" color={textColor}>Search Player</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={borderColor}
                  />
                </InputGroup>
              </Box>

              {/* Sort By */}
              <Box minW={{ base: "100%", md: "200px" }}>
                <Text mb={2} fontWeight="medium" color={textColor}>Sort By</Text>
                <Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={borderColor}
                >
                  <option value="default">Default</option>
                  <option value="mostGoals">Most Goals</option>
                  <option value="mostAssists">Most Assists</option>
                  <option value="mostMatches">Most Matches</option>
                  <option value="nameAZ">Name: A to Z</option>
                  <option value="nameZA">Name: Z to A</option>
                </Select>
              </Box>

              {/* Position Filter */}
              <Box minW={{ base: "100%", md: "280px" }} flex="1">
                <Text mb={2} fontWeight="medium" color={textColor}>Position</Text>
                <RadioGroup 
                  onChange={setPositionFilter} 
                  value={positionFilter}
                  colorScheme="blue"
                >
                  <Stack direction={{ base: "column", lg: "row" }} wrap="wrap" spacing={4}>
                    {Object.entries(positionGroups).map(([key, label]) => (
                      <Radio key={key} value={key}>
                        <Text color={textColor}>{label}</Text>
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>
            </Flex>

            <Divider my={4} borderColor={borderColor} />

            {/* Clear Filters */}
            <Box alignSelf="flex-end" ml="auto">
              <Button 
                colorScheme="blue" 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setPositionFilter('all');
                  setSortBy('default');
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Collapse>
        </Box>

        {/* Filter Summary */}
        {(searchTerm || positionFilter !== 'all' || sortBy !== 'default') && (
          <Flex wrap="wrap" gap={2} mb={4}>
            <Text fontWeight="medium" color={textColor}>Active Filters:</Text>
            {searchTerm && (
              <Badge colorScheme="blue" variant="solid" px={2} py={1}>
                Search: {searchTerm}
              </Badge>
            )}
            {positionFilter !== 'all' && (
              <Badge colorScheme="green" variant="solid" px={2} py={1}>
                {positionGroups[positionFilter]}
              </Badge>
            )}
            {sortBy !== 'default' && (
              <Badge colorScheme="orange" variant="solid" px={2} py={1}>
                Sorted: {sortBy === 'mostGoals' ? 'Most Goals' : 
                          sortBy === 'mostAssists' ? 'Most Assists' : 
                          sortBy === 'mostMatches' ? 'Most Matches' :
                          sortBy === 'nameAZ' ? 'Name: A to Z' : 
                          sortBy === 'nameZA' ? 'Name: Z to A' : sortBy}
              </Badge>
            )}
          </Flex>
        )}

        {/* Players Grid */}
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Text color={textColor}>Showing {currentPlayers.length} of {filteredPlayers.length} players</Text>
          </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
              {currentPlayers.map((player) => (
                <PlayerCard key={player._id} player={player} />
              ))}
            </SimpleGrid>

          {/* Pagination Controls */}
          {filteredPlayers.length > playersPerPage && (
            <HStack spacing={4} mt={6} justify="center">
              <Button 
                isDisabled={currentPage === 1} 
                onClick={() => setCurrentPage(currentPage - 1)}
                colorScheme="blue"
                variant="outline"
              >
                Previous
              </Button>
              <Text color={textColor}>Page {currentPage} of {totalPages}</Text>
              <Button 
                isDisabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(currentPage + 1)}
                colorScheme="blue"
                variant="outline"
              >
                Next
              </Button>
            </HStack>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ManagerPlayerStats;