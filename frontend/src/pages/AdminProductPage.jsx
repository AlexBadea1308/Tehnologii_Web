import React, { useEffect, useState } from 'react';
import {
  Container, SimpleGrid, Box, Heading, Text, Flex, Button, HStack, 
  Divider, useColorModeValue, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, 
  FormLabel, Input, Select, Textarea, useToast, useDisclosure, Collapse,
  InputGroup, InputLeftElement, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack,
  RangeSliderThumb, Checkbox, CheckboxGroup, Stack, Radio, RadioGroup, Badge, Image
} from "@chakra-ui/react";
import { AddIcon, SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useProductStore } from "../store/productStore";
import ProductCardEdit from "../components_custom/productCardEdit";
import NavigationBarAdmin from '../components_custom/NavigatorBarAdmin';

const AdminProductsPage = () => {
  const { fetchProducts, products, createProduct } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure({ defaultIsOpen: false });
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    stock: 0,
  });
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const maxPrice = Math.max(...products.map(product => product.price), 1000);

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

  const categories = [...new Set(products.map(product => product.category))];
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const handleCreateProduct = async () => {
    if (newProduct.price < 0 || newProduct.stock < 0) {
      toast({
        title: 'Invalid Input',
        description: 'Price and stock cannot be negative.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!newProduct.name || !newProduct.category || newProduct.price === 0 || newProduct.stock === 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    console.log('Product to Create:', newProduct); // Debug log

    const result = await createProduct(newProduct);
    if (result.success) {
      toast({
        title: 'Product Created',
        description: `New ${newProduct.category} product created.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCreateClose();
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        stock: 0,
      });
    } else {
      toast({
        title: 'Create Failed',
        description: result.message || 'Could not create the product.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Create Error:', result); // Debug log
    }
  };

  const handleInputChange = (field, value) => {
    let newValue = value;
    if (field === 'price' || field === 'stock') {
      newValue = Number(value);
      if (newValue < 0) {
        toast({
          title: 'Invalid Input',
          description: `${field === 'price' ? 'Price' : 'Stock'} cannot be negative.`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    setNewProduct((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log('Base64 String:', base64String.substring(0, 50) + '...'); // Debug log
        setNewProduct((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <NavigationBarAdmin />
      <Container maxW="1500px" py={8} bgGradient="linear-gradient(0deg, rgba(147,51,234,1) 0%, rgba(79,70,229,0.3253676470588235) 100%)" sx={{ outline: 'none', userSelect: 'none' }}>
        {/* Create Product Button */}
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="lg" color="white">
            Admin Products
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            onClick={onCreateOpen}
          >
            Create Product
          </Button>
        </Flex>

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
                  colorScheme="purple"
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
                  colorScheme="purple" 
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
                  colorScheme="purple"
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
                  colorScheme="purple"
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
        <Box>
          <Flex justify="space-between" align="center" mb={4} sx={{ outline: 'none', userSelect: 'none' }}>
            <Text color="gray.100">
              Showing {currentProducts.length} of {filteredProducts.length} products
            </Text>
          </Flex>

          {currentProducts.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} mb={8}>
              {currentProducts.map((product) => (
                <Box key={product._id} maxW={{ base: '100%', md: '300px' }}>
                  <ProductCardEdit product={product} />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius={12} boxShadow="md" sx={{ outline: 'none', userSelect: 'none' }}>
              <Text fontSize="xl" color="gray.600">
                No products found matching your filters
              </Text>
              <Button
                colorScheme="purple"
                mt={4}
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange([0, maxPrice]);
                  setSelectedCategories([]);
                  setStockFilter('all');
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

      {/* Create Product Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent sx={{ outline: 'none', userSelect: 'none' }}>
          <ModalHeader>Create New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={newProduct.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Product Name"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={newProduct.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Product Description"
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={newProduct.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Price"
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                value={newProduct.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Select Category"
              >
                <option value="jersey">Jersey</option>
                <option value="scarf">Scarf</option>
                <option value="mug">Mug</option>
                <option value="replica">Replica</option>
                <option value="accessory">Accessory</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Image</FormLabel>
              {newProduct.image && (
                <Image
                  src={newProduct.image}
                  alt="Preview"
                  maxH="100px"
                  mb={2}
                  fallbackSrc="https://via.placeholder.com/100x100?text=Preview+Not+Available"
                  onError={(e) => {
                    console.error('Image preview error:', e);
                    e.target.src = "https://via.placeholder.com/100x100?text=Preview+Not+Available";
                  }}
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                p={1}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Stock</FormLabel>
              <Input
                type="number"
                value={newProduct.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="Stock"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={handleCreateProduct}>
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

export default AdminProductsPage;