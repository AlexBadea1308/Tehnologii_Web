import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Divider,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  IconButton,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { DeleteIcon } from '@chakra-ui/icons';
import NavigationBar from '../components_custom/NavigatorBarFun';
import { useCartStore } from "../store/cartStore"; 
import { useTicketStore } from "../store/ticketStore";
import { useAuthStore } from "../store/authStore";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCartStore();
  const { user } = useAuthStore();
  const { tickets, fetchTickets } = useTicketStore();
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const enrichCartItems = () => {
      const enrichedItems = cart.map(item => {
        if (item.productType === 'ticket') {
          const matchTicket = tickets.find(t => 
            t.matchId._id.toString() === item.matchId.toString() && 
            t.seatCategory === item.seatCategory
          );
          if (matchTicket) {
            const match = matchTicket.matchId;
            return {
              ...item,
              name: `${match.teams.join(' vs ')} - ${item.seatCategory} Ticket`,
              image: match.image || '/default-ticket-image.png',
              availableTickets: matchTicket.availableTickets
            };
          }
          return { ...item, image: '/default-ticket-image.png' };
        }
        return { ...item, image: item.image || null };
      });

      setCartItems(enrichedItems);
      setTotalPrice(getCartTotal());
    };

    enrichCartItems();
  }, [cart, tickets, getCartTotal]);

  const handleQuantityChange = async (item, value) => {
    const newQuantity = parseInt(value) || 1;
    // Only enforce per-user limits here
    if (item.productType === 'ticket') {
      const ticketsForMatch = cart
        .filter(i => i.productType === 'ticket' && i.matchId === item.matchId)
        .reduce((sum, i) => sum + i.quantity, 0) - item.quantity + newQuantity;
      if (ticketsForMatch > 5) {
        toast({
          title: "Limit exceeded",
          description: "Maximum 5 tickets per match",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } else if (item.productType === 'product' && newQuantity > 10) {
      toast({
        title: "Limit exceeded",
        description: "Maximum 10 items per product",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await updateQuantity(item._id, item.productType, item.seatCategory || null, newQuantity);
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item._id, item.productType, item.seatCategory || null);
    toast({
      title: "Item removed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
    setTotalPrice(0);
    toast({
      title: "Cart cleared",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to checkout",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check stock availability here
    for (const item of cart) {
      if (item.productType === 'ticket') {
        const response = await fetch(`/api/tickets?matchId=${item.matchId}&seatCategory=${item.seatCategory}`);
        const ticket = await response.json().then(data => data.data[0]);
        if (item.quantity > ticket.availableTickets) {
          toast({
            title: "Insufficient stock",
            description: `Only ${ticket.availableTickets} ${item.seatCategory} tickets available for ${item.name}`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      } else if (item.productType === 'product') {
        const response = await fetch(`/api/products/${item._id}`);
        const product = await response.json().then(data => data.data);
        if (item.quantity > product.stock) {
          toast({
            title: "Insufficient stock",
            description: `Only ${product.stock} items available for ${item.name}`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }
    }

    window.location.href = '/payment';
  };

  return (
    <>
      <NavigationBar />
      <Container maxW="1500px" py={8} sx={{ outline: 'none', userSelect: 'none' }} bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);">
        <Heading as="h1" mb={6} color={textColor}>Shopping Cart</Heading>
        
        {cartItems.length > 0 ? (
          <Grid templateColumns={{ base: "1fr", lg: "1fr 350px" }} gap={6}>
            <GridItem>
              <Box 
                bg={bgColor} 
                borderRadius="lg" 
                borderWidth="1px" 
                borderColor={borderColor}
                overflow="hidden"
                boxShadow="sm"
                mb={6}
                sx={{ outline: 'none', userSelect: 'none' }}
              >
                <Table variant="simple">
                  <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                    <Tr>
                      <Th>Product</Th>
                      <Th>Price</Th>
                      <Th>Quantity</Th>
                      <Th>Total</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {cartItems.map((item) => (
                      <Tr key={`${item._id}-${item.productType}-${item.seatCategory || ''}`}>
                        <Td>
                          <Flex align="center">
                            {item.image && (
                              <Image 
                                src={item.image} 
                                alt={item.name} 
                                boxSize="50px" 
                                objectFit="cover" 
                                mr={3} 
                                borderRadius="md"
                                fallbackSrc="https://via.placeholder.com/50"
                              />
                            )}
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium" color={textColor}>{item.name}</Text>
                              {item.productType && (
                                <Badge colorScheme={item.productType === 'product' ? 'blue' : 'purple'}>
                                  {item.productType}
                                </Badge>
                              )}
                            </VStack>
                          </Flex>
                        </Td>
                        <Td>${item.price.toFixed(2)}</Td>
                        <Td>
                          <NumberInput 
                            min={1} 
                            max={item.productType === 'ticket' ? Math.min(5, item.availableTickets || 99) : item.stock || 99}
                            value={item.quantity}
                            onChange={(valueString) => handleQuantityChange(item, parseInt(valueString) || 1)}
                            size="sm"
                            maxW="100px"
                            bg={useColorModeValue('gray.100', 'gray.700')}
                            color={textColor}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper color={textColor} />
                              <NumberDecrementStepper color={textColor} />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                        <Td fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Td>
                        <Td>
                          <IconButton
                            aria-label="Remove item"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item)}
                            color={textColor}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              
              <HStack spacing={4} mb={6}>
                <Button 
                  variant="solid" 
                  colorScheme="blackAlpha"
                  onClick={() => window.history.back()}
                  size="md"
                  minW="180px"
                  color={textColor}
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="outline" 
                  colorScheme="red"
                  onClick={handleClearCart}
                  size="md"
                  minW="180px"
                  color={textColor}
                >
                  Clear Cart
                </Button>
              </HStack>
            </GridItem>
            
            <GridItem>
              <Box 
                bg={bgColor} 
                borderRadius="lg" 
                borderWidth="1px" 
                borderColor={borderColor}
                p={6}
                boxShadow="sm"
                position="sticky"
                top="20px"
              >
                <Heading as="h3" size="md" mb={4} color={textColor}>Order Summary</Heading>
                <VStack spacing={3} align="stretch">
                  <Flex justify="space-between">
                    <Text color={textColor}>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</Text>
                    <Text color={textColor}>${totalPrice.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color={textColor}>Shipping</Text>
                    <Text color={textColor}>Free</Text>
                  </Flex>
                  <Divider my={2} />
                  <Flex justify="space-between" fontWeight="bold">
                    <Text color={textColor}>Total</Text>
                    <Text color={textColor}>${totalPrice.toFixed(2)}</Text>
                  </Flex>
                  
                  <Button 
                    colorScheme="red" 
                    size="lg" 
                    w="100%" 
                    mt={4}
                    onClick={handleCheckout}
                    color={textColor}
                  >
                    Checkout
                  </Button>
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        ) : (
          <Box 
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Heading as="h2" size="lg" color={textColor}>Your cart is empty</Heading>
              <Text color={textColor}>Looks like you haven't added any items to your cart yet.</Text>
              <Button 
                colorScheme="blackAlpha" 
                size="lg"
                onClick={() => window.location.href = '/shop'}
                color={textColor}
              >
                Continue Shopping
              </Button>
            </VStack>
          </Box>
        )}
      </Container>
    </>
  );
};

export default CartPage;