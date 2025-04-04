import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Spinner,
  Badge,
  Image,
  Flex,
  Alert,
  AlertIcon,
  Select,
  FormControl,
  FormLabel,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import NavigationBar from '../components_custom/NavigatorBarFun';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import axios from 'axios';

const OrdersHistoryPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { orders, fetchOrders, loading: orderLoading, error: orderError } = useOrderStore();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 2;
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [sortByPrice, setSortByPrice] = useState('');
  const [itemDetails, setItemDetails] = useState({});

  const maxPrice = orders.length > 0 
    ? Math.max(...orders.map(o => o.totalPrice || 0))
    : 1000;

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchOrders(user._id);
    }
  }, [isAuthenticated, user?._id, fetchOrders]);

  useEffect(() => {
    let filtered = [...orders];

    // Filtrare dupa interval de pret
    filtered = filtered.filter(order => {
      const price = order.totalPrice || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filtrare dupa status
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtrare dupa metoda de plata
    if (paymentMethodFilter) {
      filtered = filtered.filter(order => order.paymentMethod === paymentMethodFilter);
    }

    // Sortare dupa pret (optionala, aplicata dupa filtre)
    if (sortByPrice === 'priceAsc') {
      filtered.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
    } else if (sortByPrice === 'priceDesc') {
      filtered.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Resetam la pagina 1 la orice schimbare a filtrelor
  }, [orders, priceRange, statusFilter, paymentMethodFilter, sortByPrice]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      const details = {};
      for (const order of orders) {
        for (const item of order.items) {
          if (!details[item.productId]) {
            try {
              if (item.productType === 'product') {
                const productResponse = await axios.get(`api/products/${item.productId}`);
                details[item.productId] = {
                  name: productResponse.data.data.name,
                  imageUrl: productResponse.data.data.image || 'https://via.placeholder.com/100?text=No+Product+Image',
                };
              } else if (item.productType === 'ticket') {
                const ticketResponse = await axios.get(`api/tickets/${item.productId}`);
                const matchData = ticketResponse.data.data.matchId;
                if (!matchData) throw new Error('Invalid match data in ticket');
                details[item.productId] = {
                  name: `${matchData.teams?.[0] || 'Unknown Team'} vs ${matchData.teams?.[1] || 'Unknown Team'}`,
                  category: ticketResponse.data.data.seatCategory || 'General',
                  imageUrl: matchData.image || 'https://via.placeholder.com/100?text=No+Match+Image',
                };
              }
            } catch (error) {
              console.error(`Error fetching details for item ${item.productId}:`, error.response || error);
              details[item.productId] = {
                name: item.productType === 'product' ? 'Unnamed Product' : 'Unnamed Ticket',
                category: item.productType === 'ticket' ? 'General' : undefined,
                imageUrl: 'https://via.placeholder.com/100?text=Image+Error',
              };
            }
          }
        }
      }
      setItemDetails(details);
    };

    if (orders.length > 0) {
      fetchItemDetails();
    }
  }, [orders]);

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setStatusFilter('');
    setPaymentMethodFilter('');
    setSortByPrice('');
    setCurrentPage(1); // Resetam si pagina la 1 la clear filters
  };

  if (!isAuthenticated) {
    return (
      <Container maxW="container.md" py={8}>
        <Text color="red.500">Please log in to view your order history.</Text>
      </Container>
    );
  }

  if (orderLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color={accentColor} />
      </Flex>
    );
  }

  if (orderError) {
    return (
      <Container maxW="container.lg" centerContent>
        <Alert status="error" mt={10}>
          <AlertIcon />
          {orderError}
        </Alert>
      </Container>
    );
  }

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <>
      <NavigationBar />
      <Container maxW="container.lg" py={8} sx={{ outline: 'none', userSelect: 'none' }}>
        <Box
          bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%)"
          borderRadius="2xl"
          p={12}
          mb={8}
          boxShadow="2xl"
          transition="all 0.5s"
          _hover={{ boxShadow: '3xl', transform: 'scale(1.02)' }}
          position="relative"
          overflow="hidden"
        >
          <Heading as="h1" size="2xl" mb={6} color="white" textAlign="center" fontWeight="extrabold" textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)">
            Order History
          </Heading>
          <Text color="white" fontSize="lg" textAlign="center" mb={8} fontStyle="italic">
            View your past orders with Golazo FC!
          </Text>
        </Box>

        {/* Filtre */}
        <Box mb={6} p={4} bg={bgColor} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading as="h3" size="md">
              Filter Orders
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
            <VStack spacing={4} align="stretch">
              <Box flex="1">
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
                  colorScheme="blue"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={6} />
                  <RangeSliderThumb index={1} boxSize={6} />
                </RangeSlider>
              </Box>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    placeholder="Select Status"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    name="paymentMethod"
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    placeholder="Select Payment Method"
                  >
                    <option value="">All</option>
                    <option value="creditCard">Credit Card</option>
                    <option value="cash">Cash</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Sort by Price</FormLabel>
                  <Select
                    name="sortByPrice"
                    value={sortByPrice}
                    onChange={(e) => setSortByPrice(e.target.value)}
                    placeholder="No Sorting"
                  >
                    <option value="priceAsc">Ascending</option>
                    <option value="priceDesc">Descending</option>
                  </Select>
                </FormControl>
              </HStack>

              <Button colorScheme="blue" variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </VStack>
          </Collapse>
        </Box>

        {filteredOrders.length === 0 ? (
          <Box bg={bgColor} borderRadius="md" borderWidth="1px" borderColor={borderColor} p={6} textAlign="center">
            <Text fontSize="lg" color={textColor}>
              No orders found matching your filters.
            </Text>
            <Button colorScheme="blue" mt={4} onClick={resetFilters}>
              Clear Filters
            </Button>
          </Box>
        ) : (
          <VStack spacing={6} align="stretch">
            {currentOrders.map((order) => (
              <Box
                key={order._id}
                bg="linear-gradient(180deg, #1a2a3a, #2c3e50)"
                borderRadius="lg"
                borderWidth="2px"
                borderColor="rgba(255, 255, 255, 0.1)"
                p={6}
                boxShadow="lg"
                transition="all 0.3s"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
                color="white"
              >
                <HStack justify="space-between" align="center" mb={4}>
                  <Text fontWeight="bold" fontSize="xl">
                    Order #{order._id.slice(-6)}
                  </Text>
                  <Badge
                    colorScheme={
                      order.status === 'completed' ? 'green' :
                      order.status === 'pending' ? 'yellow' :
                      order.status === 'processing' ? 'blue' : 'red'
                    }
                    fontSize="md"
                    px={4}
                    py={2}
                    bg="rgba(255, 255, 255, 0.1)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                  >
                    {order.status}
                  </Badge>
                </HStack>
                <Text fontSize="md" mb={2} opacity={0.8}>
                  Order Date: {new Date(order.orderDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text fontWeight="medium" fontSize="lg" mb={2}>
                  Total: ${order.totalPrice.toFixed(2)}
                </Text>
                <Text fontSize="md" mb={1} opacity={0.8}>
                  Payment Method: {order.paymentMethod}
                </Text>
                <Text fontSize="md" mb={1} opacity={0.8}>
                  Shipping Method: {order.shippingMethod}
                </Text>
                <Text fontSize="md" mb={4} opacity={0.8}>
                  Shipping Address: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </Text>

                <Box mt={4}>
                  <Heading as="h3" size="md" mb={4}>
                    Order Items
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    {order.items.map((item, index) => {
                      const detail = itemDetails[item.productId] || {};
                      return (
                        <HStack
                          key={index}
                          bgGradient="linear-gradient(180deg, rgba(0, 191, 255, 0.8) 0%, rgba(0, 51, 102, 0.8) 100%)"
                          borderRadius="md"
                          p={4}
                          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                          transition="all 0.2s"
                          _hover={{ boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', transform: 'translateY(-2px)' }}
                          color="white"
                          border="1px solid rgba(255, 255, 255, 0.1)"
                        >
                          <Image
                            src={detail.imageUrl || 'https://via.placeholder.com/100?text=Image+Error'}
                            alt={detail.name || (item.productType === 'product' ? 'Product Image' : 'Ticket Image')}
                            width={item.productType === 'product' ? '200px' : '300px'}
                            height={item.productType === 'product' ? '250px' : '180px'}
                            objectFit="cover"
                            borderRadius="md"
                            onError={(e) => {
                              console.error('Image failed to load for item:', item.productId);
                              e.target.src = 'https://via.placeholder.com/100?text=Image+Error';
                            }}
                          />
                          <VStack align="start" spacing={1} flex="1" textShadow="0 1px 1px rgba(0, 0, 0, 0.3)">
                            <Text fontWeight="bold" fontSize="md">
                              {detail.name || (item.productType === 'product' ? 'Unnamed Product' : 'Unnamed Ticket')}
                            </Text>
                            {item.productType === 'ticket' && detail.category && (
                              <Text fontSize="sm">Category: {detail.category}</Text>
                            )}
                            <Text fontSize="sm">Type: {item.productType}</Text>
                            <Text fontSize="md">Quantity: {item.quantity}</Text>
                            <Text fontSize="md">Price: ${item.price.toFixed(2)}</Text>
                          </VStack>
                        </HStack>
                      );
                    })}
                  </VStack>
                </Box>
              </Box>
            ))}
          </VStack>
        )}

        {filteredOrders.length > ordersPerPage && (
          <HStack spacing={4} mt={6} justify="center">
            <Button
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              colorScheme="blue"
              variant="outline"
              borderColor="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            >
              Prev
            </Button>
            <Text>Page {currentPage} of {totalPages}</Text>
            <Button
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              colorScheme="blue"
              variant="outline"
              borderColor="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            >
              Next
            </Button>
          </HStack>
        )}
      </Container>
    </>
  );
};

export default OrdersHistoryPage;