import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { 
  Box, Heading, HStack, IconButton, Image, Text, useColorModeValue, useDisclosure, useToast, VStack,
  Badge, Flex, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, 
  ModalFooter, Input, Select, Textarea, Button, RadioGroup, Stack, Radio
} from "@chakra-ui/react";
import { useProductStore } from "../store/productStore.js";
import { useState } from "react";

const ProductCardEdit = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'file'
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const { updateProduct, deleteProduct } = useProductStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    if (updatedProduct.price < 0 || updatedProduct.stock < 0) {
      toast({
        title: "Invalid Input",
        description: "Price and stock cannot be negative.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await updateProduct(pid, updatedProduct);
    onClose();
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: "Product updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (field, value) => {
    let newValue = value;

    if (field === 'price' || field === 'stock') {
      newValue = Number(value);
      if (newValue < 0) {
        toast({
          title: "Invalid Input",
          description: `${field === 'price' ? 'Price' : 'Stock'} cannot be negative.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    setUpdatedProduct((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedProduct((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isOutOfStock = product.stock === 0;
  const categoryOptions = ["jersey", "scarf", "mug", "replica", "accessory"];

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      bg={cardBg}
      borderColor={borderColor}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "md",
      }}
      position="relative"
      maxW={{ base: '100%', md: '300px' }}
      sx={{ outline: 'none', userSelect: 'none' }}
    >
      {isOutOfStock && (
        <Badge
          position="absolute"
          top="10px"
          right="10px"
          px={2}
          py={1}
          colorScheme="red"
          borderRadius="md"
          zIndex="1"
        >
          Out of Stock
        </Badge>
      )}
      
      <Box position="relative" height="400px" overflow="hidden">
  <Image
    src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
    alt={product.name}
    w="100%"
    h="100%"
    objectFit="cover"
    opacity={isOutOfStock ? 0.7 : 1}
    fallbackSrc="https://via.placeholder.com/300x200?text=Image+Not+Found"
    onError={(e) => {
      console.error('Image load error for product:', product.name, 'src:', product.image);
      e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
    }}
  />
  {isOutOfStock && (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="blackAlpha.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontWeight="bold" fontSize="xl" color="red.500">
        Stock Epuizat
      </Text>
    </Box>
  )}
</Box>
      
      <Box p={4}>
        <Box mb={2}>
          <Heading as="h3" size="md" noOfLines={1}>
            {product.name}
          </Heading>
          <Badge colorScheme="purple" mt={1}>
            {product.category}
          </Badge>
        </Box>
        
        <Text color={textColor} fontSize="sm" noOfLines={2} mb={3}>
          {product.description}
        </Text>
        
        <Divider mb={3} />
        
        <VStack spacing={2} align="stretch">
          <Text color={textColor}>
            Stock: {product.stock}
          </Text>
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" fontSize="xl" color="red.500">
              ${product.price}
            </Text>
            <HStack spacing={2}>
              <IconButton
                icon={<EditIcon />}
                onClick={onOpen}
                colorScheme="blue"
                size="sm"
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => handleDeleteProduct(product._id)}
                colorScheme="red"
                size="sm"
              />
            </HStack>
          </Flex>
        </VStack>
      </Box>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent sx={{ outline: 'none', userSelect: 'none' }}>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box w="100%">
                <Text mb={1}>Name</Text>
                <Input
                  value={updatedProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Description</Text>
                <Textarea
                  value={updatedProduct.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Price</Text>
                <Input
                  type="number"
                  value={updatedProduct.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Category</Text>
                <Select
                  value={updatedProduct.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Image Source</Text>
                <RadioGroup 
                  onChange={setImageSource} 
                  value={imageSource}
                  colorScheme="blue"
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="url">URL</Radio>
                    <Radio value="file">Upload File</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              
              {imageSource === 'url' ? (
                <Box w="100%">
                  <Text mb={1}>Image URL</Text>
                  <Input
                    value={updatedProduct.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                  />
                </Box>
              ) : (
                <Box w="100%">
                  <Text mb={1}>Upload Image</Text>
                  {updatedProduct.image && imageSource === 'file' && (
                    <Image src={updatedProduct.image} alt="Preview" maxH="100px" mb={2} />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    p={1}
                  />
                </Box>
              )}
              
              <Box w="100%">
                <Text mb={1}>Stock</Text>
                <Input
                  type="number"
                  value={updatedProduct.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCardEdit;