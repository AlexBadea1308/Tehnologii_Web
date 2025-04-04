import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Box,
  Heading,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Stack,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Badge,
  useColorModeValue,
  Collapse,
  useDisclosure,
  HStack,
  SimpleGrid,
  Alert,
  AlertIcon,
  Select,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, AddIcon } from '@chakra-ui/icons';
import { useTicketStore } from '../store/ticketStore';
import { useMatchStore } from '../store/matchStore';
import TicketCardEdit from '../components_custom/TicketCardEdit';
import NavigationBarAdmin from '../components_custom/NavigatorBarAdmin';
import { useToast } from '@chakra-ui/react';

const AdminTicketsPage = () => {
  const { fetchTickets, tickets, createTicket, loading, error } = useTicketStore();
  const { fetchMatches, matches } = useMatchStore();
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
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const [newTicket, setNewTicket] = useState({
    matchId: '',
    seatCategory: '',
    price: 0,
    availableTickets: 0,
  });
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchTickets();
    fetchMatches();
  }, [fetchTickets, fetchMatches]);

  const maxPrice = tickets.length > 0
    ? Math.max(...tickets.map((t) => t.price || 0))
    : 1000;

  useEffect(() => {
    let filtered = [...tickets];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.matchId?.teams?.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.matchId?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.matchId?.competition?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    const now = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter((ticket) => new Date(ticket.matchId?.eventDate) > now);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter((ticket) => new Date(ticket.matchId?.eventDate) < now);
    }

    // Filter by competition
    if (competitionFilter) {
      filtered = filtered.filter((ticket) => ticket.matchId?.competition === competitionFilter);
    }

    // Filter by price range
    filtered = filtered.filter((ticket) => {
      const price = ticket.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by availability
    if (availabilityFilter === 'available') {
      filtered = filtered.filter((ticket) => ticket.availableTickets > 0);
    } else if (availabilityFilter === 'soldOut') {
      filtered = filtered.filter((ticket) => ticket.availableTickets === 0);
    }

    // Sort
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

  const competitions = [...new Set(tickets.map((ticket) => ticket.matchId?.competition || 'Unknown'))];
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTickets]);

  const handleCreateTicket = async () => {
    // Check if price or availableTickets are negative
    if (newTicket.price < 0 || newTicket.availableTickets < 0) {
      toast({
        title: 'Invalid Input',
        description: 'Price and available tickets cannot be negative.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check if a ticket with the same matchId and seatCategory already exists
    const duplicateTicket = tickets.find(
      (ticket) => ticket.matchId._id === newTicket.matchId && ticket.seatCategory === newTicket.seatCategory
    );

    if (duplicateTicket) {
      toast({
        title: 'Creation Failed',
        description: 'A ticket for this category already exists for the selected match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Proceed with ticket creation if validations pass
    const result = await createTicket(newTicket);
    if (result.success) {
      toast({
        title: 'Ticket Created',
        description: `New ${newTicket.seatCategory} ticket created.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCreateClose();
      setNewTicket({
        matchId: '',
        seatCategory: '',
        price: 0,
        availableTickets: 0,
      });
    } else {
      toast({
        title: 'Create Failed',
        description: result.message || 'Could not create the ticket.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Convert and validate numeric inputs
    if (name === 'price' || name === 'availableTickets') {
      newValue = Number(value);
      if (newValue < 0) {
        toast({
          title: 'Invalid Input',
          description: `${name === 'price' ? 'Price' : 'Available tickets'} cannot be negative.`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return; // Prevent updating state with negative values
      }
    }

    setNewTicket((prev) => ({ ...prev, [name]: newValue }));
  };

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
      <NavigationBarAdmin />
      <Container maxW="1500px" py={8} bgGradient="linear-gradient(0deg, rgba(147,51,234,1) 0%, rgba(79,70,229,0.3253676470588235) 100%)">
        {/* Create Ticket Button */}
        <Flex justify="flex-end" mb={4}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            onClick={onCreateOpen}
          >
            Create Ticket
          </Button>
        </Flex>

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
              Ticket Filters
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
              {/* Other filter inputs (Search, Sort By, Price Range) */}
            </Stack>

            <Divider my={4} />

            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <GridItem sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">
                  Date
                </Text>
                <RadioGroup onChange={setDateFilter} value={dateFilter} colorScheme="purple">
                  <Stack spacing={2}>
                    <Radio value="all">All</Radio>
                    <Radio value="upcoming">Upcoming</Radio>
                    <Radio value="past">Past</Radio>
                  </Stack>
                </RadioGroup>
              </GridItem>

              <GridItem sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">
                  Competition
                </Text>
                <Select
                  value={competitionFilter}
                  onChange={(e) => setCompetitionFilter(e.target.value)}
                  size="md"
                  placeholder="Select Competition"
                >
                  {competitions.map((competition) => (
                    <option key={competition} value={competition}>
                      {competition}
                    </option>
                  ))}
                </Select>
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">
                  Availability
                </Text>
                <CheckboxGroup
                  colorScheme="purple"
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
                  colorScheme="purple"
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
            {searchTerm && (
              <Badge colorScheme="blue" variant="solid" px={2} py={1} fontSize="sm">
                Search: {searchTerm}
              </Badge>
            )}
            {dateFilter !== 'all' && (
              <Badge colorScheme="purple" variant="solid" px={2} py={1} fontSize="sm">
                {dateFilter === 'upcoming' ? 'Upcoming' : 'Past'}
              </Badge>
            )}
            {competitionFilter && (
              <Badge colorScheme="green" variant="solid" px={2} py={1} fontSize="sm">
                {competitionFilter}
              </Badge>
            )}
            {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
              <Badge colorScheme="orange" variant="solid" px={2} py={1} fontSize="sm">
                Price: ${priceRange[0]} - ${priceRange[1]}
              </Badge>
            )}
            {availabilityFilter !== 'all' && (
              <Badge colorScheme="red" variant="solid" px={2} py={1} fontSize="sm">
                {availabilityFilter === 'available' ? 'Available' : 'Sold Out'}
              </Badge>
            )}
            {sortBy !== 'dateAsc' && (
              <Badge colorScheme="yellow" variant="solid" px={2} py={1} fontSize="sm">
                Sorted: {sortBy.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')}
              </Badge>
            )}
          </Flex>
        )}

        <Box>
          <Flex justify="space-between" align="center" mb={4} sx={{ outline: 'none', userSelect: 'none' }}>
            <Text color="gray.100">
              Showing {currentTickets.length} of {filteredTickets.length} tickets
            </Text>
          </Flex>

          {currentTickets.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} mb={8}>
              {currentTickets.map((ticket) => (
                <Box key={ticket._id} maxW={{ base: '100%', md: '300px' }}>
                  <TicketCardEdit ticket={ticket} />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius={12} boxShadow="md" sx={{ outline: 'none', userSelect: 'none' }}>
              <Text fontSize="xl" color="gray.600">
                No tickets found matching your filters
              </Text>
              <Button
                colorScheme="purple"
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
            <Button isDisabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </Button>
            <Text sx={{ outline: 'none', userSelect: 'none' }}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button isDisabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </HStack>
        </Box>
      </Container>

      {/* Create Ticket Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Match</FormLabel>
                <Select
                  name="matchId"
                  value={newTicket.matchId}
                  onChange={handleInputChange}
                  placeholder="Select Match"
                >
                  {matches.map((match) => (
                    <option key={match._id} value={match._id}>
                      {match.teams.join(' vs ')} - {new Date(match.eventDate).toLocaleDateString()}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Seat Category</FormLabel>
                <Select
                  name="seatCategory"
                  value={newTicket.seatCategory}
                  onChange={handleInputChange}
                  placeholder="Select Seat Category"
                >
                  <option value="VIP">VIP</option>
                  <option value="Standard">Standard</option>
                  <option value="General">General</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input
                  name="price"
                  type="number"
                  value={newTicket.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Available Tickets</FormLabel>
                <Input
                  name="availableTickets"
                  type="number"
                  value={newTicket.availableTickets}
                  onChange={handleInputChange}
                  placeholder="Available Tickets"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={handleCreateTicket}>
              Create
            </Button>
            <Button variant="ghost" onClick={onCreateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminTicketsPage;