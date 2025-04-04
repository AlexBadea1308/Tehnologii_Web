import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import { 
  Box, Button, Heading, HStack, IconButton, Image, Input, Modal, 
  ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, 
  ModalOverlay, Text, useColorModeValue, useDisclosure, useToast, VStack,
  Badge, Textarea, Flex, Divider, Select, NumberInput, NumberInputField, 
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from "@chakra-ui/react";
import { useProductStore } from "../store/productStore.js";
import { useCartStore } from "../store/cartStore.js"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, isAdmin = false }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [quantity, setQuantity] = useState(1);
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const { deleteProduct, updateProduct } = useProductStore();
  const { addToCart, cart } = useCartStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  
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
  
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      // Calculam produsele existente in cos pentru acest _id
      const productsInCart = cart.filter(
        (item) => item.productType === 'product' && item._id === product._id
      ).reduce((sum, item) => sum + item.quantity, 0);

      const remainingForLimit = 10 - productsInCart;
      const remainingStock = product.stock - productsInCart;

      if (quantity > remainingForLimit) {
        throw new Error(`Only ${remainingForLimit} more items allowed (max 10)`);
      }
      if (quantity > remainingStock) {
        throw new Error(`Only ${remainingStock} items available`);
      }

      await addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        productType: 'product',
        image: product.image
      });

      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name}(s) added to your cart`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setQuantity(1); // Resetam cantitatea
    } catch (error) {
      toast({
        title: "Cannot add to cart",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
          
          <NumberInput 
            min={1} 
            max={Math.min(10, product.stock)} // Limita UI
            value={quantity}
            onChange={(valueString) => setQuantity(parseInt(valueString) || 1)}
            size="sm"
            isDisabled={isOutOfStock}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" fontSize="xl" color="red.500">
              ${product.price}
            </Text>
            <HStack spacing={2}>
              {!isOutOfStock && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="red"
                  size="sm"
                  variant="solid"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              )}
              {isAdmin && (
                <>
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
                </>
              )}
            </HStack>
          </Flex>
        </VStack>
      </Box>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box w="100%">
                <Text mb={1}>Name</Text>
                <Input
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                  }
                />
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Description</Text>
                <Textarea
                  value={updatedProduct.description}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, description: e.target.value })
                  }
                />
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Price</Text>
                <Input
                  type="number"
                  value={updatedProduct.price}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, price: Number(e.target.value) })
                  }
                />
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Category</Text>
                <Select
                  value={updatedProduct.category}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, category: e.target.value })
                  }
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Image URL</Text>
                <Input
                  value={updatedProduct.image}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, image: e.target.value })
                  }
                />
              </Box>
              
              <Box w="100%">
                <Text mb={1}>Stock</Text>
                <Input
                  type="number"
                  value={updatedProduct.stock}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, stock: Number(e.target.value) })
                  }
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() =>
                handleUpdateProduct(product._id, updatedProduct)
              }
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

export default ProductCard;