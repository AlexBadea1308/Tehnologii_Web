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
import { useOrderStore } from '../store/orderStore';
import NavigationBarAdmin from '../components_custom/NavigatorBarAdmin';

const OrderCard = ({ order, onUpdate, onDelete }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const token = useAuthStore(state => state.token);

  const handleStatusChange = async (newStatus) => {
    try {
      await onUpdate(order._id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update order status:', error.message);
    }
  };

  return (
    <Box p={4} bg={bgColor} borderRadius="md" borderWidth="1px" borderColor={borderColor} boxShadow="sm">
      <Text fontWeight="bold">Order #{order._id.slice(-6)}</Text>
      <Text>User: {order.userId?.username || 'Unknown'}</Text>
      <Text>Total: ${order.totalPrice}</Text>
      <Text>Items: {order.items.length}</Text>
      <Text>Status: 
        <Badge 
          colorScheme={order.status === 'completed' ? 'green' : order.status === 'cancelled' ? 'red' : 'yellow'}
          ml={1}
        >
          {order.status}
        </Badge>
      </Text>
      <Text>Date: {new Date(order.orderDate).toLocaleDateString()}</Text>
      
      <Divider my={2} />
      
      <Select 
        mt={2} 
        value={order.status}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </Select>
      
      <Button 
        colorScheme="red" 
        variant="outline" 
        size="sm" 
        mt={2}
        onClick={() => onDelete(order._id)}
      >
        Delete
      </Button>
    </Box>
  );
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const token = useAuthStore(state => state.token);
  const { fetchAllOrders, updateOrder, deleteOrder } = useOrderStore();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchAllOrders();
        if (fetchedOrders && Array.isArray(fetchedOrders)) {
          setOrders(fetchedOrders);
          setFilteredOrders(fetchedOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error.message);
      }
    };

    if (token) {
      loadOrders();
    } else {
      console.error('No token found. Please log in.');
    }
  }, [token, fetchAllOrders]);

  // Filtering and Sorting Logic
  useEffect(() => {
    let filtered = [...orders];

    // Filter by search term (user email or ID)
    if (searchTerm) {
      filtered = filtered.filter(order =>
        (order.userId?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(order => selectedStatuses.includes(order.status));
    }

    // Sort
    switch (sortBy) {
      case 'dateNewest':
        filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        break;
      case 'dateOldest':
        filtered.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
        break;
      case 'totalHigh':
        filtered.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'totalLow':
        filtered.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      default:
        break;
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, selectedStatuses, sortBy]);

  const statuses = ['pending', 'processing', 'completed', 'cancelled'];
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders]);

  const handleUpdateOrder = async (id, updatedData) => {
    try {
      const updatedOrder = await updateOrder(id, updatedData);
      setOrders(orders.map(order => (order._id === id ? updatedOrder : order)));
      setFilteredOrders(filteredOrders.map(order => (order._id === id ? updatedOrder : order)));
    } catch (error) {
      console.error('Error updating order:', error.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order._id !== id));
      setFilteredOrders(filteredOrders.filter(order => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error.message);
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
                    placeholder="Search orders by user email or ID..." 
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
                  <option value="dateNewest">Date: Newest First</option>
                  <option value="dateOldest">Date: Oldest First</option>
                  <option value="totalHigh">Total: High to Low</option>
                  <option value="totalLow">Total: Low to High</option>
                </Select>
              </Box>
            </Flex>

            <Divider my={4} />

            <Flex direction={{ base: "column", md: "row" }} wrap="wrap" gap={6}>
              {/* Statuses */}
              <Box minW={{ base: "100%", md: "200px" }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Text mb={2} fontWeight="medium">Statuses</Text>
                <CheckboxGroup 
                  colorScheme="purple" 
                  value={selectedStatuses}
                  onChange={setSelectedStatuses}
                >
                  <Stack spacing={2}>
                    {statuses.map(status => (
                      <Checkbox key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                    setSelectedStatuses([]);
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
        {(searchTerm || selectedStatuses.length > 0 || sortBy !== 'default') && (
          <Flex wrap="wrap" gap={2} mb={4}>
            <Text fontWeight="medium">Active Filters:</Text>
            {searchTerm && (
              <Badge colorScheme="blue" variant="solid" px={2} py={1}>
                Search: {searchTerm}
              </Badge>
            )}
            {selectedStatuses.map(status => (
              <Badge key={status} colorScheme="purple" variant="solid" px={2} py={1}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            ))}
            {sortBy !== 'default' && (
              <Badge colorScheme="orange" variant="solid" px={2} py={1}>
                Sorted: {sortBy.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')}
              </Badge>
            )}
          </Flex>
        )}

        {/* Orders Grid */}
        <Box>
          <Flex justify="space-between" align="center" mb={4} sx={{ outline: 'none', userSelect: 'none' }}>
            <Text color="gray.100">
              Showing {currentOrders.length} of {filteredOrders.length} orders
            </Text>
          </Flex>

          {currentOrders.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} mb={8}>
              {currentOrders.map((order) => (
                <Box key={order._id} maxW={{ base: '100%', md: '300px' }}>
                  <OrderCard
                    order={order}
                    onUpdate={handleUpdateOrder}
                    onDelete={handleDeleteOrder}
                  />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius={12} boxShadow="md" sx={{ outline: 'none', userSelect: 'none' }}>
              <Text fontSize="xl" color="gray.600">
                No orders found matching your filters
              </Text>
              <Button
                colorScheme="purple"
                mt={4}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatuses([]);
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

export default AdminOrdersPage;