import React, { useState } from 'react';
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
  useColorModeValue,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../../public/images/logo.png';
import axios from 'axios';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validare nume
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validare prenume
    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    }
    
    // Validare username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Validare parola
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Validare confirmare parola
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Realizam cererea catre backend folosind endpoint-ul "/api/create"
      const response = await axios.post('/api/register', {
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        email: formData.email,
        password: formData.password
        // role nu este trimis, va fi setat automat la "fan" pe server
      });
      
      // Verificam raspunsul
      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Account created successfully!',
          description: "You can now login with your credentials.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Redirectare catre pagina de login
        navigate('/login');
      }
    } catch (error) {
      // Gestionam erorile
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      
      // Verificam daca este o eroare de tip duplicate key (email sau username deja existente)
      if (error.response?.status === 400 && error.response?.data?.code === 11000) {
        if (error.response.data.keyPattern?.email) {
          setErrors(prev => ({ ...prev, email: 'This email is already in use' }));
        }
        if (error.response.data.keyPattern?.username) {
          setErrors(prev => ({ ...prev, username: 'This username is already taken' }));
        }
      } else {
        toast({
          title: 'Registration failed',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  
  // Gradient inspirat din culorile logo-ului Golazo
  const rightSideGradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";

  return (
    <Container maxW="100%" p={0} h="100vh">
      <Flex h="full" direction={{ base: 'column', md: 'row' }}>
        {/* Partea stanga - Formular inregistrare */}
        <Box 
          w={{ base: '100%', md: '60%' }} 
          p={8} 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          bg={bgColor}
          overflowY="auto"
          sx={{ outline: 'none', userSelect: 'none' }}
        >
          <Box w="full" maxW="450px" sx={{ outline: 'none', userSelect: 'none' }}>
            {/* Logo centrat */}
            <Center mb={4}>
              <Image 
                src={logo} 
                alt="Golazo Logo" 
                maxH="140px"
              />
            </Center>
            
            {/* Titlu centrat */}
            <Center mb={6}>
              <Heading as="h1" size="xl" textAlign="center">Create Your Account</Heading>
            </Center>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {/* Nume */}
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                
                {/* Prenume */}
                <FormControl isRequired isInvalid={!!errors.surname}>
                  <FormLabel htmlFor="surname">Surname</FormLabel>
                  <Input
                    id="surname"
                    type="text"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Your surname"
                  />
                  <FormErrorMessage>{errors.surname}</FormErrorMessage>
                </FormControl>
                
                {/* Username */}
                <FormControl isRequired isInvalid={!!errors.username}>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                
                {/* Email */}
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                
                {/* Parola */}
                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        variant="ghost"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={handleTogglePassword}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                
                {/* Confirmare Parola */}
                <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        variant="ghost"
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={handleToggleConfirmPassword}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
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
                  Sign Up
                </Button>
              </VStack>
            </form>
          </Box>
        </Box>
        
        {/* Partea dreapta - Banner login */}
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
          {/* Buton inchidere */}
          <IconButton
            aria-label="Close"
            icon={<Text fontSize="xl">×</Text>}
            position="absolute"
            top={4}
            right={4}
            variant="ghost"
            color="white"
            _hover={{ bg: 'rgba(255,255,255,0.2)' }}
          />
          
          <VStack spacing={6} align="center" maxW="300px">
            <Heading as="h2" size="xl">Already have an account?</Heading>
            <Text textAlign="center">
              Login to access all your favorite features and content!
            </Text>
            <Button
              as={RouterLink}
              to="/"
              variant="outline"
              colorScheme="whiteAlpha"
              size="lg"
              w="full"
              color="white"
              borderColor="white"
              _hover={{ bg: 'rgba(255,255,255,0.2)' }}
            >
              Sign In
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default RegisterPage;