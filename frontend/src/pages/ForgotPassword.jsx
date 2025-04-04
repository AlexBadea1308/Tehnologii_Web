import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Container,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import logo from '../../public/images/logo.png';
import { useAuthStore } from '../store/authStore'; // Import the auth store

const ForgotPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { token, logout } = useAuthStore(); // Use token and logout from auth store

  const gradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";
  const bgColor = useColorModeValue('white', 'gray.800');

  // Check authentication on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');

    if (!storedUserData || !token) {
      toast({
        title: "Authentication required",
        description: "Please login to change your password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    try {
      setUserData(JSON.parse(storedUserData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast({
        title: "Session error",
        description: "Invalid user data. Please login again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    }
  }, [navigate, toast, token]); // Added token as dependency

  const handleSavePassword = async () => {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!token) throw new Error("Authentication token not found. Please log in again.");
      if (!userData?._id) throw new Error("User ID not found");

      // Configure axios request with token from useAuthStore
      const response = await axios.put(
        `/api/users/${userData._id}/update-password`,
        { password: newPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Password Updated",
          description: "Your password has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/account');
      } else {
        throw new Error(response.data.message || "Failed to update password");
      }
    } catch (error) {
      console.error('Error updating password:', error);

      // Handle specific HTTP status codes
      if (error.response?.status === 401) {
        toast({
          title: "Session expired",
          description: "Please login again to continue.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        logout(); // Clear auth state using logout from useAuthStore
        navigate('/login');
        return;
      }

      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "An error occurred while updating the password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="100%" p={0} h="100vh">
      <Box position="absolute" top={4} left={4} sx={{ outline: 'none', userSelect: 'none' }}>
        <img src={logo} alt="Logo" width="120px" />
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
              <Heading as="h1" size="xl" textAlign="center">Reset Password</Heading>
            </Center>

            <VStack spacing={4} align="flex-start">
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  size="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="lg"
                />
              </FormControl>

              <Button
                onClick={handleSavePassword}
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
                onClick={() => navigate('/account')}
                size="lg"
                w="full"
                mt={4}
                variant="outline"
              >
                Back to Account
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
            <p>Set a new password to access your account.</p>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default ForgotPasswordPage;