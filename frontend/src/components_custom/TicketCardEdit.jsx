import React, { useState } from 'react';
import {
  Box,
  Text,
  IconButton,
  Image,
  Stack,
  Badge,
  useToast,
  Heading,
  Divider,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useTicketStore } from '../store/ticketStore';

const TicketCardEdit = ({ ticket }) => {
  const { updateTicket, deleteTicket } = useTicketStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    matchId: ticket.matchId?._id || ticket.matchId || '',
    seatCategory: ticket.seatCategory || '',
    price: ticket.price || 0,
    availableTickets: ticket.availableTickets || 0,
  });
  const toast = useToast();

  const textColor = useColorModeValue('gray.600', 'white');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const match = ticket.matchId || {};
  const isOutOfStock = ticket.availableTickets === 0;

  const handleUpdate = async () => {
    // Validate price and availableTickets
    if (formData.price < 0 || formData.availableTickets < 0) {
      toast({
        title: 'Invalid Input',
        description: 'Price and available tickets cannot be negative.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await updateTicket(ticket._id, formData);
    if (result.success) {
      toast({
        title: 'Ticket Updated',
        description: `${formData.seatCategory} ticket for ${match.teams?.join(' vs ')} has been updated.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
    } else {
      toast({
        title: 'Update Failed',
        description: result.message || 'Could not update the ticket.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      const result = await deleteTicket(ticket._id);
      if (result.success) {
        toast({
          title: 'Ticket Deleted',
          description: `${ticket.seatCategory} ticket for ${match.teams?.join(' vs ')} has been deleted.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Delete Failed',
          description: result.message || 'Could not delete the ticket.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validate numeric inputs
    if (name === 'price' || name === 'availableTickets') {
      newValue = Number(value);
      if (newValue < 0) {
        toast({
          title: 'Invalid Input',
          description: `${name === 'price' ? 'Price' : 'Available tickets'} cannot be negative.`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return; // Prevent updating state with negative values
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        bg={bg}
        borderColor={borderColor}
        transition="transform 0.3s, box-shadow 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'md',
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

        <Box position="relative" height="200px" overflow="hidden" sx={{ outline: 'none', userSelect: 'none' }}>
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
          <Box mb={2}>
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
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold" fontSize="xl" color={textColor}>
                ${ticket.price}
              </Text>
            </Flex>
            <Flex justify="space-between" mt={2}>
              <IconButton
                icon={<EditIcon />}
                colorScheme="blue"
                size="sm"
                onClick={() => setIsOpen(true)}
              />
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                size="sm"
                onClick={handleDelete}
              />
            </Flex>
          </Stack>
        </Box>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Ticket: {match.teams?.join(' vs ')} - {ticket.seatCategory}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Match ID</FormLabel>
                <Input
                  name="matchId"
                  value={formData.matchId}
                  onChange={handleInputChange}
                  placeholder="Match ID"
                  isDisabled
                />
              </FormControl>
              <FormControl>
                <FormLabel>Seat Category</FormLabel>
                <Select
                  name="seatCategory"
                  value={formData.seatCategory}
                  onChange={handleInputChange}
                >
                  <option value="VIP">VIP</option>
                  <option value="Standard">Standard</option>
                  <option value="General">General</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Available Tickets</FormLabel>
                <Input
                  name="availableTickets"
                  type="number"
                  value={formData.availableTickets}
                  onChange={handleInputChange}
                  placeholder="Available Tickets"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TicketCardEdit;