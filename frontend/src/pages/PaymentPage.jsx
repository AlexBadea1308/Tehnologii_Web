import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  useToast, 
  Heading, 
  Divider, 
  Text,
  Select,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import NavigationBar from '../components_custom/NavigatorBarFun';

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { cart, getCartTotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();

  const totalPrice = getCartTotal();

  useEffect(() => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to payment",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate('/shop');
    }
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to complete your purchase",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    }
  }, [cart, user, toast, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
  
    if (paymentMethod === 'creditCard' && /^0+$/.test(cardNumber)) {
      toast({
        title: 'Invalid Card Number',
        description: 'Card number cannot be all zeros.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log('Cart before processing:', cart);
  
      for (const item of cart) {
        if (item.productType === 'product') {
          const response = await fetch(`/api/products/${item._id}`);
          const productData = await response.json();
          console.log('Product stock check:', item._id, productData);
          if (!productData.success || productData.data.stock < item.quantity) {
            throw new Error(`Insufficient stock for product: ${item.name || item._id}`);
          }
        } else if (item.productType === 'ticket') {
          const response = await fetch(`/api/tickets/${item.matchId}/${item.seatCategory}`);
          const ticketData = await response.json();
          console.log('Ticket stock check:', item.matchId, item.seatCategory, ticketData);
          
          if (!ticketData.success || !ticketData.data) {
            throw new Error(`Ticket unavailable: ${ticketData.message || 'Unknown error'}`);
          }
          if (ticketData.data.availableTickets < item.quantity) {
            throw new Error(`Insufficient tickets for category: ${item.seatCategory} (only ${ticketData.data.availableTickets} available)`);
          }
        }
      }
  
      const orderDetails = {
        paymentMethod,
        shippingMethod,
        shippingAddress: { street: address, city, postalCode, country, phone: phoneNumber },
        totalPrice: totalPrice,
        userId: user._id,
        items: cart.map(item => ({
          productId: item._id,
          productType: item.productType || 'product',
          quantity: item.quantity,
          price: item.price,
        })),
      };
  
      console.log('Order details:', orderDetails);
  
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderDetails),
      });
  
      const orderData = await orderResponse.json();
      console.log('Order response:', orderData);
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }
  
      const productUpdates = cart
        .filter(item => item.productType === 'product')
        .map(item => ({
          productId: item._id,
          quantity: item.quantity,
        }));
  
      const ticketUpdates = cart
        .filter(item => item.productType === 'ticket')
        .map(item => ({
          ticketId: item._id,
          quantity: item.quantity,
        }));
  
      console.log('Product updates:', productUpdates);
      console.log('Ticket updates:', ticketUpdates);
  
      if (productUpdates.length > 0) {
        const stockResponse = await fetch('/api/products/stock', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ updates: productUpdates }),
        });
        const stockData = await stockResponse.json();
        console.log('Product stock response:', stockData);
        if (!stockData.success) {
          throw new Error(stockData.message || 'Failed to update product stock');
        }
      }
  
      if (ticketUpdates.length > 0) {
        const ticketStockResponse = await fetch('/api/tickets/stock', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ updates: ticketUpdates }),
        });
        const ticketStockData = await ticketStockResponse.json();
        console.log('Ticket stock response:', ticketStockData);
        if (!ticketStockData.success) {
          throw new Error(ticketStockData.message || 'Failed to update ticket stock');
        }
      }
  
      toast({
        title: 'Order Placed Successfully',
        description: 'Your order has been placed and stock updated!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      clearCart();
      navigate('/');
  
    } catch (error) {
      console.error('Payment error:', error.message);
      toast({
        title: 'Order Error',
        description: error.message || 'An error occurred while placing your order. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavigationBar />
      <Box maxW="md" mx="auto" p={6} borderWidth={1} borderRadius="md" mt={8} mb={8} sx={{ outline: 'none', userSelect: 'none' }}>
        <Heading as="h2" size="lg" mb={4}>Complete Your Order</Heading>
        
        <Divider my={4} />
        
        <form onSubmit={handlePaymentSubmit}>
          <VStack spacing={4} align="stretch">
            <Heading as="h3" size="md">Payment Method</Heading>
            <FormControl isRequired>
              <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                <Stack direction="column">
                  <Radio value="creditCard">Credit Card</Radio>
                  <Radio value="cash">Pay on delivery</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            
            {paymentMethod === 'creditCard' && (
              <>
                <FormControl isRequired>
                  <FormLabel>Card Number</FormLabel>
                  <Input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Cardholder Name</FormLabel>
                  <Input
                    type="text"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    placeholder="Cardholder Name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Expiry Date</FormLabel>
                  <Input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>CVV</FormLabel>
                  <Input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="CVV"
                  />
                </FormControl>
              </>
            )}

            <Divider my={2} />
            
            <Heading as="h3" size="md">Shipping Method</Heading>
            <FormControl isRequired>
              <Select 
                value={shippingMethod} 
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                <option value="standard">Standard (3-5 business days)</option>
                <option value="express">Express (1-2 business days)</option>
              </Select>
            </FormControl>
            
            <Divider my={2} />
            <Heading as="h3" size="md">Shipping Information</Heading>
            
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street Address"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Postal Code</FormLabel>
              <Input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal Code"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Country</FormLabel>
              <Input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              w="full"
              mt={4}
              size="lg"
            >
              Place Order (${totalPrice.toFixed(2)})
            </Button>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default PaymentPage;