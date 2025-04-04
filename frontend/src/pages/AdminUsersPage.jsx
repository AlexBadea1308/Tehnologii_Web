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
  Divider,
  useColorModeValue,
  Collapse,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Checkbox,
  CheckboxGroup,
  Stack,
  Badge,
  Select,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import NavigationBarAdmin from '../components_custom/NavigatorBarAdmin';
import UserCardEdit from '../components_custom/UserCardEdit';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/all-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          console.error('Error fetching users:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      console.error('No token found. Please log in.');
    }
  }, [token]);

  // Filtering and Sorting Logic
  useEffect(() => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by roles
    if (selectedRoles.length > 0) {
      filtered = filtered.filter(user => selectedRoles.includes(user.role));
    }

    // Sort
    switch (sortBy) {
      case 'nameAZ':
        filtered.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case 'nameZA':
        filtered.sort((a, b) => b.username.localeCompare(a.username));
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRoles, sortBy]);

  const roles = ['fan', 'player', 'manager', 'admin'];
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers]);

  // Update User Role
  const handleUpdateUser = async (id, updatedData) => {
    try {
      const response = await axios.put(`/api/users/role/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(users.map(user => (user._id === id ? response.data.data : user)));
        setFilteredUsers(filteredUsers.map(user => (user._id === id ? response.data.data : user)));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to update user');
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`/api/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(users.filter(user => user._id !== id));
        setFilteredUsers(filteredUsers.filter(user => user._id !== id));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to delete user');
    }
  };

  return (
    <>
      <NavigationBarAdmin />
      <Container maxW="1500px" py={8} bgGradient="linear-gradient(0deg, rgba(147,51,234,1) 0%, rgba(79,70,229,0.3253676470588235) 100%)" sx={{ outline: 'none', userSelect: 'none' }}>
        {/* Filter and Sort Section */}
        <Box mb={6} p={4} bg={bgColor} borderRadius="md" boxShadow="sm" borderWidth="1px" borderColor={borderColor} sx={{ outline: 'none', userSelect: 'none' }}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading as="h3" size="md">
              Filters & Sorting
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
            <Flex direction={{ base: "column", md: "row" }} wrap="wrap" mt={4} gap={4}>
              {/* Search */}
              <Box minW={{ base: "100%", md: "280px" }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Search</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Box>

              {/* Sort By */}
              <Box minW={{ base: "100%", md: "180px" }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Sort By</Text>
                <Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="nameAZ">Username: A to Z</option>
                  <option value="nameZA">Username: Z to A</option>
                </Select>
              </Box>
            </Flex>

            <Divider my={4} />

            <Flex direction={{ base: "column", md: "row" }} wrap="wrap" gap={6}>
              {/* Roles */}
              <Box minW={{ base: "100%", md: "200px" }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Roles</Text>
                <CheckboxGroup 
                  colorScheme="purple" 
                  value={selectedRoles}
                  onChange={setSelectedRoles}
                >
                  <Stack spacing={2}>
                    {roles.map(role => (
                      <Checkbox key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>

              {/* Clear Filters */}
              <Box alignSelf="flex-end" ml="auto" mt={{ base: 4, md: 0 }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Button 
                  colorScheme="purple"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRoles([]);
                    setSortBy('default');
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Flex>
          </Collapse>
        </Box>

        {/* Filter Summary */}
        {(searchTerm || selectedRoles.length > 0 || sortBy !== 'default') && (
          <Flex wrap="wrap" gap={2} mb={4}>
            <Text fontWeight="medium">Active Filters:</Text>
            {searchTerm && (
              <Badge colorScheme="blue" variant="solid" px={2} py={1}>
                Search: {searchTerm}
              </Badge>
            )}
            {selectedRoles.map(role => (
              <Badge key={role} colorScheme="purple" variant="solid" px={2} py={1}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
            ))}
            {sortBy !== 'default' && (
              <Badge colorScheme="orange" variant="solid" px={2} py={1}>
                Sorted: {sortBy.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')}
              </Badge>
            )}
          </Flex>
        )}

        {/* Users Grid */}
        <Box>
          <Flex justify="space-between" align="center" mb={4} sx={{ outline: 'none', userSelect: 'none' }}>
            <Text color="gray.100">
              Showing {currentUsers.length} of {filteredUsers.length} users
            </Text>
          </Flex>

          {currentUsers.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} mb={8}>
              {currentUsers.map((user) => (
                <Box key={user._id} maxW={{ base: '100%', md: '300px' }}>
                  <UserCardEdit
                    user={user}
                    onUpdate={handleUpdateUser}
                    onDelete={handleDeleteUser}
                  />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius={12} boxShadow="md" sx={{ outline: 'none', userSelect: 'none' }}>
              <Text fontSize="xl" color="gray.600">
                No users found matching your filters
              </Text>
              <Button
                colorScheme="purple"
                mt={4}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRoles([]);
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
      </Container>
    </>
  );
};

export default AdminUsersPage;