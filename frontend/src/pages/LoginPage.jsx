import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  Input, 
  Button, 
  FormControl, 
  FormLabel, 
  InputGroup,
  InputRightElement, 
  IconButton,
  VStack,
  Image,
  Center,
  useColorModeValue
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../../public/images/logo.png';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      const userRole = useAuthStore.getState().user?.role;
      switch (userRole) {
        case 'fan':
          navigate('/');
          break;
        case 'player':
          navigate('/player-home');
          break;
        case 'manager':
          navigate('/manager-home');
          break;
        case 'admin':
          navigate('/admin-home');
          break;
        default:
          navigate('/'); // Fallback pentru roluri necunoscute
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post('/api/login', { username, password }, { withCredentials: true });
      const data = response.data;
  
      if (data.success) {
        login(data.data, data.token);
        localStorage.setItem('userData', JSON.stringify(data.data));
        useCartStore.getState().loadUserCart();
        toast({
          title: 'Login successful',
          description: `Welcome back, ${data.data.username}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Redirectionarea se va face automat prin useEffect
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: error.response?.data?.message || error.message || 'Login failed.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const rightSideGradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";

  return (
    <Container maxW="100%" p={0} h="100vh">
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
          <Box w="full" maxW="450px">
            <Center mb={6}>
              <Image 
                src={logo} 
                alt="Logo" 
                maxH="140px"
                mb={4}
              />
            </Center>
            <Center mb={6}>
              <Heading as="h1" size="xl" textAlign="center">Login to Your Account</Heading>
            </Center>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl isRequired>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    size="lg"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      size="lg"
                    />
                    <InputRightElement h="full">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        variant="ghost"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={handleTogglePassword}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  mt={4}
                  isLoading={isLoading}
                  bgGradient="linear-gradient(90deg, #1e78bf, #00a38e)"
                  color="white"
                  _hover={{ 
                    bgGradient: "linear-gradient(90deg, #1a6eb3, #008f7c)" 
                  }}
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </Box>
        </Box>
        <Box 
          w={{ base: '100%', md: '40%' }} 
          bgGradient={rightSideGradient}
          color="white"
          p={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          sx={{ outline: 'none', userSelect: 'none' }}
        >
          <VStack spacing={6} align="center" maxW="300px">
            <Heading as="h2" size="xl">New Here?</Heading>
            <Text textAlign="center">
              Sign up and discover a great amount of new opportunities!
            </Text>
            <Button
              as={RouterLink}
              to="/register"
              variant="outline"
              colorScheme="whiteAlpha"
              size="lg"
              w="full"
              color="white"
              borderColor="white"
              _hover={{ bg: 'rgba(255,255,255,0.2)' }}
            >
              Sign Up
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default LoginPage;