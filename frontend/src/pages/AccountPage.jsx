import React, { useState, useEffect } from 'react';
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
  Avatar
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../../public/images/logo.png';

const AccountPage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  const gradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (!userData) {
    return <Center h="100vh">Loading...</Center>;
  }

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
          <Box w="full" maxW="400px" sx={{ outline: 'none', userSelect: 'none' }}>
            <Center mb={6}>
              <Heading as="h1" size="xl" textAlign="center">My Account</Heading>
            </Center>
            
            <VStack spacing={4} align="flex-start">
              <Center w="full" mb={6}>
                <Avatar size="2xl" name={userData.username || "User"} src={userData.profileImage || ""} />
              </Center>
              
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={userData.name || ""} isReadOnly size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Surname</FormLabel>
                <Input value={userData.surname || ""} isReadOnly size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input value={userData.username || ""} isReadOnly size="lg" />
              </FormControl>
              
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={userData.email || ""} isReadOnly size="lg" />
              </FormControl>
              
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input value="********" isReadOnly size="lg" />
              </FormControl>
              
              <Button
                as={RouterLink}
                to="/edit-profile"
                size="lg"
                w="full"
                mt={4}
                bgGradient="linear-gradient(90deg, #1e78bf, #00a38e)"
                color="white"
                _hover={{ bgGradient: "linear-gradient(90deg, #1a6eb3, #008f7c)" }}
              >
                Edit Profile
              </Button>
              
              <Button size="lg" w="full" variant="outline" onClick={handleLogout}>
                Logout
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
              {`${userData.username || "User"}, thank you for being part of our community. Manage your profile and preferences here.`}
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
              Return to Homepage
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default AccountPage;