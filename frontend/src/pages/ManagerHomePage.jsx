import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import NavigationBarManager from '../components_custom/NavigatorBarManager'; // Corectat importul
import backgroundImage from '../../public/images/background.jpg';
import { useAuthStore } from '../store/authStore';

const ManagerHomePage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const gradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";
  const { user } = useAuthStore(); 


  const managerName = user ? `${user.name || ''} ${user.surname || ''}`.trim() || user.username : 'Manager';

  return (
    <Box>
      <NavigationBarManager />

      {/* Sectiunea cu imagine de fundal */}
      <Box
        h="650px"
        position="relative"
        backgroundImage={`url(${backgroundImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        sx={{ outline: 'none', userSelect: 'none' }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient={gradient}
          opacity={0.7}
        />
        <Flex
          position="relative"
          direction="column"
          align="center"
          justify="center"
          h="100%"
          color="white"
          textAlign="center"
          px={4}
        >
          <Heading as="h1" size="2xl" mb={6}>
            Welcome to Golazo FC, Mr. {managerName}!
          </Heading>
          <Text fontSize="lg" mb={8}>
            Manage your team, post squads, and plan trainings effectively.
          </Text>
          <Button
            as="a"
            href="/prepare-squads"
            colorScheme="red"
            size="lg"
            rightIcon={<Box as="span" ml={2}>→</Box>}
          >
            Post Squad Now
          </Button>
        </Flex>
      </Box>

      {/* Sectiunea Info */}
      <Box bg={bgColor} py={12} sx={{ outline: 'none', userSelect: 'none' }}>
        <Container maxW="1500px">
          <Heading as="h2" size="xl" mb={6}>
            Manager Tools
          </Heading>
          <Text>
            This dashboard provides you with tools to manage the team, including squad selection, 
            training schedules, and player statistics. Stay on top of everything from here!
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default ManagerHomePage;