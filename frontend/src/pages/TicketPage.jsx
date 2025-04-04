import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, GridItem, Box, Heading, Text, Flex, Input, InputGroup,
  InputLeftElement, Button, Stack, Checkbox, CheckboxGroup,
  Radio, RadioGroup, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, 
  RangeSliderThumb, Badge, useColorModeValue, Collapse, useDisclosure, 
  HStack, SimpleGrid, Spinner, Alert, AlertIcon, Select, Divider
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useTicketStore } from '../store/ticketStore';
import TicketCard from '../components_custom/TicketCard';
import NavigationBar from '../components_custom/NavigatorBarFun';

const TicketsPage = () => {
  const { fetchTickets, tickets, loading, error } = useTicketStore(); 
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [competitionFilter, setCompetitionFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateAsc');
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 4;
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const maxPrice = tickets.length > 0 
    ? Math.max(...tickets.map(t => t.price || 0))
    : 1000;

  useEffect(() => {
    let filtered = [...tickets];

    // Filtrare dupa termeni de cautare
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.matchId?.teams?.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.matchId?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.matchId?.competition?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrare dupa data
    const now = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter(ticket => new Date(ticket.matchId?.eventDate) > now);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(ticket => new Date(ticket.matchId?.eventDate) < now);
    }

    // Filtrare dupa competitie
    if (competitionFilter) {
      filtered = filtered.filter(ticket => ticket.matchId?.competition === competitionFilter);
    }

    // Filtrare dupa interval de pret
    filtered = filtered.filter(ticket => {
      const price = ticket.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filtrare dupa disponibilitate
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(ticket => ticket.availableTickets > 0);
    } else if (availabilityFilter === 'soldOut') {
      filtered = filtered.filter(ticket => ticket.availableTickets === 0);
    }

    // Sortare
    switch (sortBy) {
      case 'dateAsc':
        filtered.sort((a, b) => new Date(a.matchId?.eventDate) - new Date(b.matchId?.eventDate));
        break;
      case 'dateDesc':
        filtered.sort((a, b) => new Date(b.matchId?.eventDate) - new Date(a.matchId?.eventDate));
        break;
      case 'priceLowToHigh':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceHighToLow':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, dateFilter, competitionFilter, priceRange, availabilityFilter, sortBy]);

  const competitions = [...new Set(tickets.map(ticket => ticket.matchId?.competition || 'Unknown'))];
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTickets]);

  if (error) {
    return (
      <Container maxW="container.lg" centerContent>
        <Alert status="error" mt={10}>
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <NavigationBar />
      <Container maxW="1500px" py={8} bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);">
        {/* Filters Section */}
        <Box 
          mb={6} 
          p={4} 
          bg={bgColor} 
          borderRadius="md" 
          boxShadow="sm"
          borderWidth="1px" 
          borderColor={borderColor}
          sx={{ outline: 'none', userSelect: 'none' }}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Heading as="h3" size="md">
              Event Filters
            </Heading>
            <Button 
              variant="ghost" 
              onClick={onFilterToggle}
              rightIcon={isFilterOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Flex>

          <Collapse in={isFilterOpen} animateOpacity>
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} flexWrap="wrap" gap={4}>
              <Box minW={{ base: '100%', md: '240px' }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Search Events</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search by teams, location, or competition..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="md"
                  />
                </InputGroup>
              </Box>

              <Box minW={{ base: '100%', md: '200px' }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Sort By</Text>
                <Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  size="md"
                >
                  <option value="dateAsc">Date: Earliest</option>
                  <option value="dateDesc">Date: Latest</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                </Select>
              </Box>

              <Box minW={{ base: '100%', md: '240px' }} flex="1" sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Price Range</Text>
                <Flex justify="space-between" mb={2}>
                  <Text>${priceRange[0]}</Text>
                  <Text>${priceRange[1]}</Text>
                </Flex>
                <RangeSlider
                  aria-label={['min', 'max']}
                  min={0}
                  max={maxPrice}
                  defaultValue={[0, maxPrice]}
                  onChange={(val) => setPriceRange(val)}
                  colorScheme="red"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={6} />
                  <RangeSliderThumb index={1} boxSize={6} />
                </RangeSlider>
              </Box>
            </Stack>

            <Divider my={4} />

            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <GridItem sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Date</Text>
                <RadioGroup 
                  onChange={setDateFilter} 
                  value={dateFilter}
                  colorScheme="red"
                >
                  <Stack spacing={2}>
                    <Radio value="all">All</Radio>
                    <Radio value="upcoming">Upcoming</Radio>
                    <Radio value="past">Past</Radio>
                  </Stack>
                </RadioGroup>
              </GridItem>

              <GridItem sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Competition</Text>
                <Select 
                  value={competitionFilter}
                  onChange={(e) => setCompetitionFilter(e.target.value)}
                  size="md"
                  placeholder="Select Competition"
                >
                  {competitions.map(competition => (
                    <option key={competition} value={competition}>
                      {competition}
                    </option>
                  ))}
                </Select>
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Availability</Text>
                <CheckboxGroup 
                  colorScheme="red" 
                  value={availabilityFilter === 'all' ? [] : [availabilityFilter]}
                  onChange={(values) => setAvailabilityFilter(values[0] || 'all')}
                >
                  <Stack spacing={2} direction="row">
                    <Checkbox value="all">All</Checkbox>
                    <Checkbox value="available">Available</Checkbox>
                    <Checkbox value="soldOut">Sold Out</Checkbox>
                  </Stack>
                </CheckboxGroup>
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }} textAlign="right" sx={{ outline: 'none', userSelect: 'none' }}>
                <Button 
                  colorScheme="red" 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('all');
                    setCompetitionFilter('');
                    setPriceRange([0, maxPrice]);
                    setAvailabilityFilter('all');
                    setSortBy('dateAsc');
                  }}
                  mt={2}
                  size="md"
                >
                  Clear Filters
                </Button>
              </GridItem>
            </Grid>
          </Collapse>
        </Box>

        {(searchTerm || dateFilter !== 'all' || competitionFilter || priceRange[0] !== 0 || priceRange[1] !== maxPrice || availabilityFilter !== 'all' || sortBy !== 'dateAsc') && (
          <Flex wrap="wrap" gap={2} mb={4} alignItems="center" sx={{ outline: 'none', userSelect: 'none' }}>
            <Text fontWeight="medium">Active Filters:</Text>
            {searchTerm && <Badge colorScheme="blue" variant="solid" px={2} py={1} fontSize="sm">Search: {searchTerm}</Badge>}
            {dateFilter !== 'all' && <Badge colorScheme="purple" variant="solid" px={2} py={1} fontSize="sm">{dateFilter === 'upcoming' ? 'Upcoming' : 'Past'}</Badge>}
            {competitionFilter && <Badge colorScheme="green" variant="solid" px={2} py={1} fontSize="sm">{competitionFilter}</Badge>}
            {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && <Badge colorScheme="orange" variant="solid" px={2} py={1} fontSize="sm">Price: ${priceRange[0]} - ${priceRange[1]}</Badge>}
            {availabilityFilter !== 'all' && <Badge colorScheme="red" variant="solid" px={2} py={1} fontSize="sm">{availabilityFilter === 'available' ? 'Available' : 'Sold Out'}</Badge>}
            {sortBy !== 'dateAsc' && <Badge colorScheme="yellow" variant="solid" px={2} py={1} fontSize="sm">Sorted: {sortBy.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')}</Badge>}
          </Flex>
        )}

        <Box>
          <Flex justify="space-between" align="center" mb={4} sx={{ outline: 'none', userSelect: 'none' }}>
            <Text color="gray.100">Showing {currentTickets.length} of {filteredTickets.length} events</Text>
          </Flex>

          {currentTickets.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} mb={8}>
              {currentTickets.map((ticket) => (
                <Box key={ticket._id} maxW={{ base: '100%', md: '300px' }}>
                  <TicketCard ticket={ticket} />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius={12} boxShadow="md" sx={{ outline: 'none', userSelect: 'none' }}>
              <Text fontSize="xl" color="gray.600">No events found matching your filters</Text>
              <Button 
                colorScheme="red" 
                mt={4} 
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('all');
                  setCompetitionFilter('');
                  setPriceRange([0, maxPrice]);
                  setAvailabilityFilter('all');
                  setSortBy('dateAsc');
                }}
                size="md"
              >
                Clear Filters
              </Button>
            </Box>
          )}

          <HStack spacing={4} mt={6} justify="center">
            <Button 
              isDisabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </Button>
            <Text sx={{ outline: 'none', userSelect: 'none' }}>Page {currentPage} of {totalPages}</Text>
            <Button 
              isDisabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </HStack>
        </Box>
      </Container>
    </>
  );
};

export default TicketsPage;