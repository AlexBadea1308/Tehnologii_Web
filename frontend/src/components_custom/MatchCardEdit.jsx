import React, { useState } from 'react';
import {
  Box,
  Text,
  IconButton,
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
  Button,
  Image,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const MatchCardEdit = ({ match, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventDate: match.eventDate || '',
    teams: match.teams?.join(', ') || '',
    location: match.location || '',
    competition: match.competition || '',
    description: match.description || '',
    image: match.image || '',
  });
  const toast = useToast();

  const textColor = useColorModeValue('gray.600', 'white');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleUpdate = async () => {
    try {
      const updatedMatchData = {
        eventDate: new Date(formData.eventDate),
        teams: formData.teams.split(',').map(team => team.trim()),
        location: formData.location,
        competition: formData.competition,
        description: formData.description,
        image: formData.image,
      };
      const result = await onUpdate(match._id, updatedMatchData);
      if (result.success) {
        toast({
          title: 'Match Updated',
          description: `${updatedMatchData.teams.join(' vs ')} has been updated.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsOpen(false);
      } else if (result.message.includes('Conflict')) {
        setFormData((prev) => ({
          ...prev,
          eventDate: match.eventDate || '',
        }));
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Could not update the match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setFormData((prev) => ({
        ...prev,
        eventDate: match.eventDate || '',
      }));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      const result = await onDelete(match._id);
      if (result.success) {
        toast({
          title: 'Match Deleted',
          description: `${match.teams?.join(' vs ')} has been deleted.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
        _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}
        position="relative"
        maxW={{ base: '100%', md: '300px' }}
        sx={{ outline: 'none', userSelect: 'none' }}
      >
        <Box position="relative" height="200px" overflow="hidden">
          <Image
            src={match.image || '/default-match-image.png'}
            alt={match.teams?.join(' vs ') || 'Match'}
            w="100%"
            h="100%"
            objectFit="cover"
            fallbackSrc="/default-match-image.png"
          />
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}  sx={{ outline: 'none', userSelect: 'none' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader  sx={{ outline: 'none', userSelect: 'none' }}>Edit Match: {match.teams?.join(' vs ')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4} sx={{ outline: 'none', userSelect: 'none' }}>
              <FormControl>
                <FormLabel>Event Date</FormLabel>
                <Input
                  name="eventDate"
                  type="date"
                  value={formData.eventDate ? new Date(formData.eventDate).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Teams (comma-separated)</FormLabel>
                <Input
                  name="teams"
                  value={formData.teams}
                  onChange={handleInputChange}
                  placeholder="e.g., TeamA, TeamB"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Competition</FormLabel>
                <Input
                  name="competition"
                  value={formData.competition}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Image</FormLabel>
                <Flex>
                  <Input
                    type="text"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleInputChange}
                    placeholder="Current image (or upload new)"
                    isDisabled
                  />
                  <Button
                    ml={2}
                    colorScheme="teal"
                    onClick={() => document.getElementById(`image-upload-${match._id}`).click()}
                  >
                    Upload Image
                  </Button>
                  <Input
                    id={`image-upload-${match._id}`}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    display="none"
                  />
                </Flex>
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

export default MatchCardEdit;