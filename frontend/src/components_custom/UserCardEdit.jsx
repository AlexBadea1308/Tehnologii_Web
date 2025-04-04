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
  Select,
  Avatar,
  Button,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const UserCardEdit = ({ user, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    role: user.role || 'fan',
  });
  const toast = useToast();

  const textColor = useColorModeValue('gray.600', 'white');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleUpdate = async () => {
    try {
      await onUpdate(user._id, formData);
      toast({
        title: 'User Updated',
        description: `Role for ${user.username} has been updated to ${formData.role}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Could not update the user.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await onDelete(user._id);
        toast({
          title: 'User Deleted',
          description: `${user.username} has been deleted.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Delete Failed',
          description: error.message || 'Could not delete the user.',
          status: 'error',
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
        <Box p={4} sx={{ outline: 'none', userSelect: 'none' }}>
          <Flex align="center" mb={2}>
            <Avatar
              size="md"
              name={user.username || ''}
              mr={3}
              bg="purple.500"
              color="white"
            />
            <Box>
              <Heading as="h3" size="md" noOfLines={1} color={textColor}>
                {user.username || 'Unknown User'}
              </Heading>
              <Badge colorScheme="purple" mt={1} color={textColor}>
                {user.role}
              </Badge>
            </Box>
          </Flex>

          <Text color={textColor} fontSize="sm" noOfLines={1} mb={1}>
            Name: {user.name} {user.surname}
          </Text>
          <Text color={textColor} fontSize="sm" noOfLines={1} mb={3}>
            Email: {user.email}
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

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User: {user.username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="fan">Fan</option>
                  <option value="player">Player</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </Select>
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

export default UserCardEdit;