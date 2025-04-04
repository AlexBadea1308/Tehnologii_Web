import React, { useState } from 'react';
import { 
  Box, Text, Button, Image, Stack, Badge, NumberInput, 
  NumberInputField, NumberInputStepper, NumberIncrementStepper, 
  NumberDecrementStepper, useToast, Heading, Divider, Flex, 
  useColorModeValue
} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import { useCartStore } from '../store/cartStore';

const TicketCard = ({ ticket, isAdmin = false }) => {
  const { addToCart, cart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  const textColor = useColorModeValue("gray.600", "white");
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const match = ticket.matchId || {};
  const isOutOfStock = ticket.availableTickets === 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      // Calculam biletele existente in cos pentru a seta limita UI
      const ticketsInCartForCategory = cart.filter(
        (item) => item.productType === 'ticket' && 
                  item.matchId === match._id && 
                  item.seatCategory === ticket.seatCategory
      ).reduce((sum, item) => sum + item.quantity, 0);

      const remainingForCategory = ticket.availableTickets - ticketsInCartForCategory;

      if (quantity > remainingForCategory) {
        throw new Error(`Only ${remainingForCategory} ${ticket.seatCategory} tickets available`);
      }

      await addToCart({
        _id: ticket._id || Date.now().toString(),
        matchId: match._id,
        name: `${match.teams?.join(' vs ') || 'Match'} - ${ticket.seatCategory} Ticket`,
        price: ticket.price,
        quantity: quantity,
        productType: 'ticket',
        seatCategory: ticket.seatCategory
      });

      toast({
        title: "Added to Cart",
        description: `${quantity} ${ticket.seatCategory} ticket(s) added`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setQuantity(1);
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

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      bg={bg}
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
          color={textColor}
        >
          Sold Out
        </Badge>
      )}

      <Box position="relative" height="200px" overflow="hidden"  sx={{ outline: 'none', userSelect: 'none' }}>
        <Image
          src={match.image || '/default-ticket-image.png'}
          alt={match.teams?.join(' vs ') || 'Match'}
          w="100%"
          h="100%"
          objectFit="cover"
          opacity={isOutOfStock ? 0.7 : 1}
          fallbackSrc="/default-ticket-image.png"
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
            <Text fontWeight="bold" fontSize="xl" color="red.500" sx={{ outline: 'none', userSelect: 'none' }}>
              Sold Out
            </Text>
          </Box>
        )}
      </Box>

      <Box p={4} sx={{ outline: 'none', userSelect: 'none' }}>
        <Box mb={2} sx={{ outline: 'none', userSelect: 'none' }}>
          <Heading as="h3" size="md" noOfLines={1} color={textColor}>
            {match.teams?.join(' vs ') || 'Unknown Match'}
          </Heading>
          <Badge colorScheme="purple" mt={1} color={textColor}>
            {match.competition || 'Unknown Competition'}
          </Badge>
        </Box>

        <Text color={textColor} fontSize="sm" noOfLines={2} mb={1}>
          Date: {new Date(match.eventDate).toLocaleDateString() || 'Unknown Date'}
        </Text>
        <Text color={textColor} fontSize="sm" noOfLines={1} mb={3}>
          Location: {match.location || 'Unknown Location'}
        </Text>

        <Divider mb={3} />

        <Stack spacing={2}>
          <Text color={textColor} fontWeight="bold">
            Seat Category: {ticket.seatCategory}
          </Text>
          
          <Text color={textColor}>
            Available Tickets: {ticket.availableTickets}
          </Text>

          <NumberInput 
            min={1} 
            max={Math.min(5, ticket.availableTickets)} // Limita UI
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
            <Text fontWeight="bold" fontSize="xl" color={textColor}>
              ${ticket.price}
            </Text>
            
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
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};

export default TicketCard;