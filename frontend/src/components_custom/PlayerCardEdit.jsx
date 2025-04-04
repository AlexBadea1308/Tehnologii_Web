import React, { useState } from 'react';
import {
  Box, Image, Text, HStack, SimpleGrid, IconButton, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel,
  Select, NumberInput, NumberInputField, Input, Button, useToast
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const PlayerCardEdit = ({ player, onUpdate, onDelete }) => {
  const cardBg = '../../public/images/playercard.png';
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    position: player.position || '',
    matchesPlayed: player.matchesPlayed || 0,
    goals: player.goals || 0,
    assists: player.assists || 0,
    yellowCards: player.yellowCards || 0,
    redCards: player.redCards || 0,
    profileImage: player.profileImage || ''
  });

  const positions = ['ST', 'LW', 'RW', 'CM', 'CDM', 'CAM', 'LB', 'RB', 'CB', 'GK', 'LM', 'RM', 'CF'];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload (convert to base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle update submission
  const handleUpdate = async () => {
    const updatedPlayerStatsData = {
      position: formData.position,
      matchesPlayed: formData.matchesPlayed,
      goals: formData.goals,
      assists: formData.assists,
      yellowCards: formData.yellowCards,
      redCards: formData.redCards,
      profileImage: formData.profileImage || ''
    };

    try {
      const result = await onUpdate(player._id, updatedPlayerStatsData);
      if (result && result.success) {
        toast({
          title: 'Player Updated',
          description: `${player.name} ${player.surname}'s stats have been updated.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsOpen(false);
      } else {
        throw new Error(result?.message || 'Update failed');
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Could not update the player stats.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this player’s stats?')) {
      const result = await onDelete(player._id);
      if (result.success) {
        toast({
          title: 'Player Stats Deleted',
          description: `${player.name} ${player.surname}'s stats have been deleted.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Box
        w="200px"
        h="350px"
        bgImage={cardBg}
        bgSize="cover"
        bgPosition="center"
        borderRadius="20px"
        overflow="hidden"
        boxShadow="xl"
        transition="transform 0.3s ease"
        _hover={{ transform: 'scale(1.05)' }}
        position="relative"
      >
        {/* Player Image */}
        <Image
          src={player.profileImage || 'https://via.placeholder.com/200x200'}
          alt={`${player.name || 'Player'} ${player.surname || ''}`}
          w="100%"
          h="200px"
          objectFit="cover"
          borderBottom="2px solid rgba(255, 255, 255, 0.5)"
        />

        {/* Position and Name */}
        <Box
          position="absolute"
          top="160px"
          left="10px"
          color="white"
          px={2}
          py={1}
          borderRadius="md"
          fontWeight="bold"
          fontSize="lg"
          textTransform="uppercase"
        >
          {player.position || 'N/A'}
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="white"
            fontFamily="'Montserrat', sans-serif"
            textShadow="0 0 5px black"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {player.name || 'Unknown'} {player.surname || ''}
          </Text>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={2} spacing={0} p={7} mt={0}>
          <Box>
            <HStack justifyContent="space-between" px={5} py={0}>
              <Text fontSize="sm" fontWeight="bold" color="black">M</Text>
              <Text fontSize="sm" fontWeight="bold" color="black">{player.matchesPlayed ?? 0}</Text>
            </HStack>
            <HStack justifyContent="space-between" px={5} py={0}>
              <Text fontSize="sm" fontWeight="bold" color="black">G</Text>
              <Text fontSize="sm" fontWeight="bold" color="black">{player.goals ?? 0}</Text>
            </HStack>
            <HStack justifyContent="space-between" px={5} py={0}>
              <Text fontSize="sm" fontWeight="bold" color="black">A</Text>
              <Text fontSize="sm" fontWeight="bold" color="black">{player.assists ?? 0}</Text>
            </HStack>
          </Box>
          <Box>
            <HStack justifyContent="space-between" px={5} py={0}>
              <Text fontSize="sm" fontWeight="bold" color="black">YC</Text>
              <Text fontSize="sm" fontWeight="bold" color="black">{player.yellowCards ?? 0}</Text>
            </HStack>
            <HStack justifyContent="space-between" px={5} py={0}>
              <Text fontSize="sm" fontWeight="bold" color="black">RC</Text>
              <Text fontSize="sm" fontWeight="bold" color="black">{player.redCards ?? 0}</Text>
            </HStack>
          </Box>
        </SimpleGrid>

        {/* Edit and Delete Buttons */}
        <HStack position="absolute" top="5px" right="5px" spacing={2}>
          <IconButton
            aria-label="Edit player stats"
            icon={<EditIcon />}
            size="sm"
            colorScheme="blue"
            variant="solid"
            onClick={() => setIsOpen(true)}
          />
          <IconButton
            aria-label="Delete player stats"
            icon={<DeleteIcon />}
            size="sm"
            colorScheme="red"
            variant="solid"
            onClick={handleDelete}
          />
        </HStack>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Player: {player.name} {player.surname}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Position</FormLabel>
              <Select
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Select Position"
              >
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Matches Played</FormLabel>
              <NumberInput
                min={0}
                value={formData.matchesPlayed}
                onChange={(val) => handleInputChange('matchesPlayed', Number(val))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Goals</FormLabel>
              <NumberInput
                min={0}
                value={formData.goals}
                onChange={(val) => handleInputChange('goals', Number(val))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Assists</FormLabel>
              <NumberInput
                min={0}
                value={formData.assists}
                onChange={(val) => handleInputChange('assists', Number(val))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Yellow Cards</FormLabel>
              <NumberInput
                min={0}
                value={formData.yellowCards}
                onChange={(val) => handleInputChange('yellowCards', Number(val))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Red Cards</FormLabel>
              <NumberInput
                min={0}
                value={formData.redCards}
                onChange={(val) => handleInputChange('redCards', Number(val))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Profile Image</FormLabel>
              {formData.profileImage && (
                <Image src={formData.profileImage} alt="Current" maxH="100px" mb={2} />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </FormControl>
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

export default PlayerCardEdit;