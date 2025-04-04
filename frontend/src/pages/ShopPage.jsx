import React, { useEffect, useState } from 'react';
import { 
  Container, SimpleGrid, Box, Heading, Text, Flex, Select, Input, InputGroup,
  InputLeftElement, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack,
  RangeSliderThumb, Badge, Checkbox, CheckboxGroup, Stack, Button, HStack, 
  Divider, useColorModeValue, Collapse, useDisclosure, Radio, RadioGroup
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useProductStore } from "../store/productStore";
import ProductCard from "../components_custom/productCard";
import NavigationBar from '../components_custom/NavigatorBarFun';

const ShopPage = () => {
  const { fetchProducts, products } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const categories = [...new Set(products.map(product => product.category))];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    if (stockFilter === 'inStock') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter(product => product.stock === 0);
    }

    switch(sortBy) {
      case 'priceLowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'nameAZ':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, priceRange, selectedCategories, stockFilter, sortBy]);

  const maxPrice = Math.max(...products.map(product => product.price), 1000);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage, 
    currentPage * productsPerPage
  );

  return (
    <>  
    <NavigationBar />
    <Container maxW="1500px" py={8} bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);">
      {/* Filter and Sort Section */}
      <Box mb={6} p={4} bg={bgColor} borderRadius="md" boxShadow="sm" borderWidth="1px" borderColor={borderColor} sx={{ outline: 'none', userSelect: 'none' }}>
        <Flex justify="space-between" align="center" mb={2}>
          <Heading as="h3" size="md">
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
            <Box minW={{ base: "100%", md: "280px" }} sx={{ outline: 'none', userSelect: 'none' }}>
              <Text mb={2} fontWeight="medium">Search</Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Search products..." 
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
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="nameAZ">Name: A to Z</option>
                <option value="nameZA">Name: Z to A</option>
              </Select>
            </Box>

            {/* Price Range */}
            <Box minW={{ base: "100%", md: "200px" }} flex="1" sx={{ outline: 'none', userSelect: 'none' }}>
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
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Box>
          </Flex>

          <Divider my={4} />

          <Flex direction={{ base: "column", md: "row" }} wrap="wrap" gap={6}>
            {/* Categories */}
            <Box minW={{ base: "100%", md: "200px" }} sx={{ outline: 'none', userSelect: 'none' }}>
              <Text mb={2} fontWeight="medium">Categories</Text>
              <CheckboxGroup 
                colorScheme="red" 
                value={selectedCategories}
                onChange={setSelectedCategories}
              >
                <Stack spacing={2}>
                  {categories.map(category => (
                    <Checkbox key={category} value={category}>
                      {category}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>

            {/* Stock Filter */}
            <Box minW={{ base: "100%", md: "200px" }} sx={{ outline: 'none', userSelect: 'none' }}>
              <Text mb={2} fontWeight="medium">Availability</Text>
              <RadioGroup 
                onChange={setStockFilter} 
                value={stockFilter}
                colorScheme="red"
              >
                <Stack spacing={2}>
                  <Radio value="all">All Products</Radio>
                  <Radio value="inStock">In Stock</Radio>
                  <Radio value="outOfStock">Out of Stock</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            {/* Clear Filters */}
            <Box alignSelf="flex-end" ml="auto" mt={{ base: 4, md: 0 }} sx={{ outline: 'none', userSelect: 'none' }}>
              <Button 
                colorScheme="red" 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange([0, maxPrice]);
                  setSelectedCategories([]);
                  setStockFilter('all');
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
      {(searchTerm || selectedCategories.length > 0 || stockFilter !== 'all' || sortBy !== 'default') && (
        <Flex wrap="wrap" gap={2} mb={4}>
          <Text fontWeight="medium">Active Filters:</Text>
          {searchTerm && (
            <Badge colorScheme="blue" variant="solid" px={2} py={1}>
              Search: {searchTerm}
            </Badge>
          )}
          {selectedCategories.map(cat => (
            <Badge key={cat} colorScheme="purple" variant="solid" px={2} py={1}>
              {cat}
            </Badge>
          ))}
          {stockFilter !== 'all' && (
            <Badge colorScheme="green" variant="solid" px={2} py={1}>
              {stockFilter === 'inStock' ? 'In Stock' : 'Out of Stock'}
            </Badge>
          )}
          {sortBy !== 'default' && (
            <Badge colorScheme="orange" variant="solid" px={2} py={1}>
              Sorted: {sortBy.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')}
            </Badge>
          )}
        </Flex>
      )}

      {/* Products Grid */}
      <Box sx={{ outline: 'none', userSelect: 'none' }}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text>Showing {currentProducts.length} of {filteredProducts.length} products</Text>
        </Flex>

        {currentProducts.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
            spacing={6}
          >
            {currentProducts.map((product) => (
              <Box 
                key={product._id}
                maxW="300px" 
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                boxShadow="md"
                bg={bgColor}
                sx={{ outline: 'none', userSelect: 'none' }}
              >
                <ProductCard product={product} />
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={10} sx={{ outline: 'none', userSelect: 'none' }}>
            <Text fontSize="xl">No products found matching your filters</Text>
            <Button colorScheme="red" mt={4} onClick={() => {
              setSearchTerm('');
              setPriceRange([0, maxPrice]);
              setSelectedCategories([]);
              setStockFilter('all');
              setSortBy('default');
            }}>
              Clear Filters
            </Button>
          </Box>
        )}

        {/* Pagination Controls */}
        <HStack spacing={4} mt={6} justify="center">
          <Button 
            isDisabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </Button>
          <Text>Page {currentPage} of {totalPages}</Text>
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

export default ShopPage;