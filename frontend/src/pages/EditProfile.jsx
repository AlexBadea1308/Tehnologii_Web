import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Image,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Center,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../../public/images/logo.png';
import { useAuthStore } from '../store/authStore';

const EditProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { token, logout } = useAuthStore(); // Added logout for invalid token handling

  const gradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (!parsedData._id) throw new Error("Invalid user data: Missing ID");
        setUserData(parsedData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const validateForm = () => {
    if (!userData.name || !userData.surname || !userData.username || !userData.email) {
      return "All fields are required";
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      return "Invalid email format";
    }
    return null;
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!token) throw new Error("Authentication token not found. Please log in again.");
      if (!userData?._id) throw new Error("User ID not found");

      const response = await axios.put(`/api/users/${userData._id}`, {
        name: userData.name.trim(),
        surname: userData.surname.trim(),
        username: userData.username.trim(),
        email: userData.email.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        toast({
          title: "Profile Updated",
          description: "Your data has been successfully updated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/account');
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const status = error.response?.status;
      let errorMessage = error.response?.data?.message || error.message || "An error occurred while updating the profile";

      if (status === 400 && errorMessage === "Username already taken") {
        errorMessage = "The username is already taken";
      } else if (status === 400 && errorMessage === "Email already in use") {
        errorMessage = "The email is already in use";
      } else if (status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        logout();
        navigate('/login');
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) return <Center h="100vh">Loading...</Center>;

  return (
    <Container maxW="100%" p={0} h="100vh">
      <Box position="absolute" top={4} left={4} sx={{ outline: 'none', userSelect: 'none' }}>
        <Image src={logo} alt="Logo" maxH="80px" />
      </Box>

      <Flex h="full" direction={{ base: 'column', md: 'row' }}>
        <Box 
          w={{ base: '100%', md: '60%' }} 
          p={8} 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          bg={bgColor}
          sx={{ outline: 'none', userSelect: 'none' }}
        >
          <Box w="full" maxW="400px">
            <Center mb={6}>
              <Heading as="h1" size="xl" textAlign="center">Edit Profile</Heading>
            </Center>
            
            <VStack spacing={4} align="flex-start">
              <Center w="full" mb={6}>
                <Avatar size="2xl" name={userData.username || "User"} src={userData.profileImage || ""} />
              </Center>
              
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input 
                  value={userData.name || ""} 
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
                  size="lg" 
                />
              </FormControl>

              <FormControl>
                <FormLabel>Surname</FormLabel>
                <Input 
                  value={userData.surname || ""} 
                  onChange={(e) => setUserData({ ...userData, surname: e.target.value })} 
                  size="lg" 
                />
              </FormControl>

              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input 
                  value={userData.username || ""} 
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })} 
                  size="lg" 
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input 
                  value={userData.email || ""} 
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })} 
                  size="lg" 
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input value="********" isReadOnly size="lg" />
              </FormControl>
              
              <Button
                onClick={handleSaveChanges}
                size="lg"
                w="full"
                mt={4}
                bgGradient="linear-gradient(90deg, #1e78bf, #00a38e)"
                color="white"
                _hover={{ bgGradient: "linear-gradient(90deg, #1a6eb3, #008f7c)" }}
                isLoading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>

              <Button 
                as={RouterLink} 
                to="/forgot-password" 
                variant="link"
                color="teal.500"
                mt={2}
                size="sm"
              >
                Forgot Password?
              </Button>
            </VStack>
          </Box>
        </Box>
        
        <Box 
          w={{ base: '100%', md: '40%' }} 
          bgGradient={gradient}
          color="white"
          p={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ outline: 'none', userSelect: 'none' }}
        >
          <VStack spacing={6} align="center" maxW="300px">
            <Heading as="h2" size="xl">Welcome Back!</Heading>
            <Text textAlign="center">
              {`${userData.username || "User"}, update your profile information here.`}
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default EditProfilePage;