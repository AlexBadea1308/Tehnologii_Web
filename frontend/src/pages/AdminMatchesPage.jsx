import React, { useEffect, useState } from 'react';
import {
  Container,
  SimpleGrid,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  HStack,
  useColorModeValue,
  Collapse,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Select,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useAuthStore } from '../store/authStore';
import { useMatchStore } from '../store/matchStore';
import { useTrainingPlanStore } from '../store/trainingPlanStore';
import NavigationBarAdmin from '../components_custom/NavigatorBarAdmin';
import MatchCardEdit from '../components_custom/MatchCardEdit';

const AdminMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 4;
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });
  const { fetchMatches, createMatch, updateMatch, deleteMatch } = useMatchStore();
  const { fetchTrainingPlans } = useTrainingPlanStore();
  const token = useAuthStore(state => state.token);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (token) {
      fetchMatches().catch(() => {
        toast({
          title: 'Fetch Failed',
          description: 'Could not fetch matches.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });

      fetchTrainingPlans().then((result) => {
        if (!result.success) {
          toast({
            title: 'Fetch Failed',
            description: 'Could not fetch training plans.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      });
    } else {
      toast({
        title: 'Authentication Error',
        description: 'No token found. Please log in.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [token, fetchMatches, fetchTrainingPlans, toast]);

  useEffect(() => {
    const unsubscribeMatches = useMatchStore.subscribe((state) => {
      setMatches(state.matches || []);
      setFilteredMatches(state.matches || []);
    });
    return () => unsubscribeMatches();
  }, []);

  useEffect(() => {
    const unsubscribeTrainingPlans = useTrainingPlanStore.subscribe((state) => {
      setTrainingPlans(state.trainingPlans || []);
    });
    return () => unsubscribeTrainingPlans();
  }, []);

  useEffect(() => {
    let filtered = [...matches];
    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.teams.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.competition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'dateAsc':
        filtered.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        break;
      case 'dateDesc':
        filtered.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        break;
      default:
        break;
    }
    setFilteredMatches(filtered);
  }, [matches, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);
  const currentMatches = filteredMatches.slice(
    (currentPage - 1) * matchesPerPage,
    currentPage * matchesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredMatches]);

  const hasDateConflict = (eventDate, currentMatchId = null) => {
    const selectedDate = new Date(eventDate).toDateString();
    const matchConflict = matches.some((match) => {
      const matchDate = new Date(match.eventDate).toDateString();
      return matchDate === selectedDate && match._id !== currentMatchId;
    });
    const trainingConflict = trainingPlans.some((plan) => {
      const planDate = new Date(plan.date).toDateString();
      return planDate === selectedDate;
    });
    return { hasMatchConflict: matchConflict, hasTrainingConflict: trainingConflict };
  };

  const handleUpdateMatch = async (id, matchData) => {
    const { hasMatchConflict, hasTrainingConflict } = hasDateConflict(matchData.eventDate, id);
    if (hasMatchConflict) {
      toast({
        title: 'Date Conflict',
        description: 'The selected date overlaps with an existing match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false, message: 'Conflict with another match' };
    }
    if (hasTrainingConflict) {
      toast({
        title: 'Date Conflict',
        description: 'The selected date overlaps with an existing training plan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false, message: 'Conflict with a training plan' };
    }
    try {
      await updateMatch(id, matchData);
      return { success: true, message: 'Match updated successfully' };
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Could not update the match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false, message: error.message || 'Error updating match' };
    }
  };

  const handleDeleteMatch = async (id) => {
    try {
      await deleteMatch(id);
      return { success: true, message: 'Match deleted successfully' };
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Could not delete the match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false, message: error.message || 'Error deleting match' };
    }
  };

  const handleCreateMatch = async (matchData) => {
    const { hasMatchConflict, hasTrainingConflict } = hasDateConflict(matchData.eventDate);
    if (hasMatchConflict) {
      toast({
        title: 'Date Conflict',
        description: 'A match is already scheduled on this date.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false, message: 'Conflict with another match' };
    }
    if (hasTrainingConflict) {
      toast({
        title: 'Date Conflict',
        description: 'A training plan is already scheduled on this date.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false, message: 'Conflict with a training plan' };
    }
    try {
      await createMatch(matchData);
      return { success: true, message: 'Match created successfully' };
    } catch (error) {
      toast({
        title: 'Create Failed',
        description: error.message || 'Could not create the match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return { success: false, message: error.message || 'Error creating match' };
    }
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    eventDate: '',
    teams: '',
    location: '',
    competition: '',
    description: '',
    image: '',
  });

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmit = async () => {
    const newMatchData = {
      eventDate: new Date(createFormData.eventDate),
      teams: createFormData.teams.split(',').map(team => team.trim()),
      location: createFormData.location,
      competition: createFormData.competition,
      description: createFormData.description,
      image: createFormData.image,
    };
    const result = await handleCreateMatch(newMatchData);
    if (result.success) {
      toast({
        title: 'Match Created',
        description: 'New match has been successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsCreateOpen(false);
      setCreateFormData({
        eventDate: '',
        teams: '',
        location: '',
        competition: '',
        description: '',
        image: '',
      });
    }
  };

  return (
    <>
      <NavigationBarAdmin />
      <Container maxW="1500px" py={8} bgGradient="linear-gradient(0deg, rgba(147,51,234,1) 0%, rgba(79,70,229,0.3253676470588235) 100%)" >
        <Box mb={6} p={4} bg={bgColor} borderRadius="md" boxShadow="sm" borderWidth="1px" borderColor={borderColor} sx={{ outline: 'none', userSelect: 'none' }}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading as="h3" size="md">
              Filters & Sorting
            </Heading>
            <Flex>
              <Button
                colorScheme="teal"
                size="sm"
                mr={2}
                onClick={() => setIsCreateOpen(true)}
              >
                Create Match
              </Button>
              <Button
                variant="ghost"
                onClick={onFilterToggle}
                rightIcon={isFilterOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              >
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Flex>
          </Flex>

          <Collapse in={isFilterOpen} animateOpacity>
            <Flex direction={{ base: "column", md: "row" }} wrap="wrap" mt={4} gap={4}>
              <Box minW={{ base: "100%", md: "280px" }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Search</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search matches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Box>
              <Box minW={{ base: "100%", md: "180px" }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Sort By</Text>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="dateAsc">Date: Ascending</option>
                  <option value="dateDesc">Date: Descending</option>
                </Select>
              </Box>
            </Flex>
            <Box mt={4} sx={{ outline: 'none', userSelect: 'none' }}>
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('default');
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Collapse>
        </Box>

        {(searchTerm || sortBy !== 'default') && (
          <Flex wrap="wrap" gap={2} mb={4}>
            <Text fontWeight="medium">Active Filters:</Text>
            {searchTerm && (
              <Badge colorScheme="blue" variant="solid" px={2} py={1}>
                Search: {searchTerm}
              </Badge>
            )}
            {sortBy !== 'default' && (
              <Badge colorScheme="orange" variant="solid" px={2} py={1}>
                Sorted: {sortBy.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')}
              </Badge>
            )}
          </Flex>
        )}

        <Box>
          <Flex justify="space-between" align="center" mb={4} sx={{ outline: 'none', userSelect: 'none' }}>
            <Text color="gray.100">
              Showing {currentMatches.length} of {filteredMatches.length} matches
            </Text>
          </Flex>

          {currentMatches.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} mb={8}>
              {currentMatches.map((match) => (
                <Box key={match._id} maxW={{ base: '100%', md: '300px' }}>
                  <MatchCardEdit
                    match={match}
                    onUpdate={handleUpdateMatch}
                    onDelete={handleDeleteMatch}
                  />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius={12} boxShadow="md" sx={{ outline: 'none', userSelect: 'none' }}>
              <Text fontSize="xl" color="gray.600">
                No matches found matching your filters
              </Text>
              <Button
                colorScheme="purple"
                mt={4}
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('default');
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

        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader  sx={{ outline: 'none', userSelect: 'none' }}>Create New Match</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}  sx={{ outline: 'none', userSelect: 'none' }}>
                <FormControl>
                  <FormLabel>Event Date</FormLabel>
                  <Input
                    name="eventDate"
                    type="date"
                    value={createFormData.eventDate}
                    onChange={handleCreateInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Teams (comma-separated)</FormLabel>
                  <Input
                    name="teams"
                    value={createFormData.teams}
                    onChange={handleCreateInputChange}
                    placeholder="e.g., TeamA, TeamB"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={createFormData.location}
                    onChange={handleCreateInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Competition</FormLabel>
                  <Input
                    name="competition"
                    value={createFormData.competition}
                    onChange={handleCreateInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    value={createFormData.description}
                    onChange={handleCreateInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Image</FormLabel>
                  <Flex>
                    <Input
                      type="text"
                      name="image"
                      value={createFormData.image || ''}
                      onChange={handleCreateInputChange}
                      placeholder="Current image (or upload new)"
                      isDisabled
                    />
                    <Button
                      ml={2}
                      colorScheme="teal"
                      onClick={() => document.getElementById('image-upload-create').click()}
                    >
                      Upload Image
                    </Button>
                    <Input
                      id="image-upload-create"
                      type="file"
                      accept="image/*"
                      onChange={handleCreateImageUpload}
                      display="none"
                    />
                  </Flex>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleCreateSubmit}>
                Create
              </Button>
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default AdminMatchesPage;