import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Collapse,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import NavigationBarAdmin from '../components_custom/NavigatorBarAdmin';

const AdminStatsPage = () => {
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    quantityThreshold: 'all', // Options: 'all', '>10', '>50', '>100', '>500'
    sortOrder: 'desc', // Options: 'asc', 'desc'
  });
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const itemsPerPage = 5;

  const { token } = useAuthStore(state => state);
  const { fetchProducts } = useProductStore();
  const { fetchAllOrders } = useOrderStore();

  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch all orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await fetchAllOrders();
        if (ordersData) {
          setOrders(ordersData);
        }
      } catch (error) {
        console.error('Error fetching all orders:', error);
      }
    };
    if (token) loadOrders();
  }, [token, fetchAllOrders]);

  // Fetch all products
  useEffect(() => {
    const loadProducts = async () => {
      const result = await fetchProducts();
      if (result.success) setProducts(result.data);
    };
    if (token) loadProducts();
  }, [token, fetchProducts]);

  // Process orders for products
  useEffect(() => {
    const processData = () => {
      const productCount = {};

      // Process products from orders
      for (const order of orders) {
        for (const item of order.items || []) {
          if (item.productType === 'product') {
            const productId = item.productId.toString();
            productCount[productId] = (productCount[productId] || 0) + item.quantity;
          }
        }
      }

      // Map products with images, names, and category
      let topProductsArray = Object.entries(productCount)
        .map(([id, count]) => {
          const product = products.find(p => p._id.toString() === id);
          return {
            id,
            count,
            image: product?.image || 'placeholder.jpg',
            name: product?.name || 'Unknown Product',
            category: product?.category || 'Unknown',
          };
        });

      // Apply filters
      if (filters.category !== 'all') {
        topProductsArray = topProductsArray.filter(product => product.category === filters.category);
      }

      if (filters.quantityThreshold !== 'all') {
        const threshold = parseInt(filters.quantityThreshold.replace('>', ''));
        topProductsArray = topProductsArray.filter(product => product.count > threshold);
      }

      // Sort based on sortOrder
      topProductsArray.sort((a, b) => {
        return filters.sortOrder === 'desc' ? b.count - a.count : a.count - b.count;
      });

      setTopProducts(topProductsArray);

    };

    if (products.length > 0 && orders.length > 0) {
      processData();
    }
  }, [orders, filters, products]);

  // Pagination for products
  const totalProductPages = Math.ceil(topProducts.length / itemsPerPage);
  const currentProducts = topProducts.slice(
    (currentPageProducts - 1) * itemsPerPage,
    currentPageProducts * itemsPerPage
  );

  return (
    <>
      <NavigationBarAdmin />
      <Container maxW="1500px" py={8} bgGradient="linear-gradient(0deg, rgba(147,51,234,1) 0%, rgba(79,70,229,0.3253676470588235) 100%)">
        {/* Filter Section */}
        <Box mb={6} p={4} bg={bgColor} borderRadius="md" boxShadow="sm" borderWidth="1px" borderColor={borderColor} sx={{ outline: 'none', userSelect: 'none' }}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading as="h3" size="md">Filters</Heading>
            <Button
              variant="ghost"
              onClick={onFilterToggle}
              rightIcon={isFilterOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Flex>

          <Collapse in={isFilterOpen} animateOpacity>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
              <Box>
                <Text mb={2}>Category</Text>
                <Select
                  value={filters.category}
                  onChange={e => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  <option value="jersey">Jersey</option>
                  <option value="scarf">Scarf</option>
                  <option value="mug">Mug</option>
                  <option value="replica">Replica</option>
                  <option value="accessory">Accessory</option>
                </Select>
              </Box>
              <Box>
                <Text mb={2}>Quantity Sold Threshold</Text>
                <Select
                  value={filters.quantityThreshold}
                  onChange={e => setFilters({ ...filters, quantityThreshold: e.target.value })}
                >
                  <option value="all">All Quantities</option>
                  <option value=">10">More than 10</option>
                  <option value=">50">More than 50</option>
                  <option value=">100">More than 100</option>
                  <option value=">500">More than 500</option>
                </Select>
              </Box>
              <Box>
                <Text mb={2}>Sort Order</Text>
                <Select
                  value={filters.sortOrder}
                  onChange={e => setFilters({ ...filters, sortOrder: e.target.value })}
                >
                  <option value="desc">Descending (High to Low)</option>
                  <option value="asc">Ascending (Low to High)</option>
                </Select>
              </Box>
            </Flex>
          </Collapse>
        </Box>

        {/* Products Table */}
        <Box mb={8} sx={{ outline: 'none', userSelect: 'none' }}>
          <Heading as="h2" size="lg" mb={4}>Top Selling Products</Heading>
          {topProducts.length > 0 ? (
            <Table variant="simple" bg={bgColor} borderRadius="md" boxShadow="sm">
              <Thead>
                <Tr>
                  <Th>Image</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Quantity Sold</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentProducts.map((product, index) => (
                  <Tr key={index}>
                    <Td>
                      <img src={product.image} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    </Td>
                    <Td>{product.name}</Td>
                    <Td>{product.category}</Td>
                    <Td>{product.count}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No product sales data available matching the filters.</Text>
          )}
          {totalProductPages > 1 && (
            <HStack spacing={4} mt={4} justify="center">
              <Button
                isDisabled={currentPageProducts === 1}
                onClick={() => setCurrentPageProducts(currentPageProducts - 1)}
              >
                Prev
              </Button>
              <Text>Page {currentPageProducts} of {totalProductPages}</Text>
              <Button
                isDisabled={currentPageProducts === totalProductPages}
                onClick={() => setCurrentPageProducts(currentPageProducts + 1)}
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

export default AdminStatsPage;