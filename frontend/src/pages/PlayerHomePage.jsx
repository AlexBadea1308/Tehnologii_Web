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
import NavigationBarPlayer from '../components_custom/NavigatorBarPlayer';
import backgroundImage from '../../public/images/background.jpg'; // Presupunem ca imaginea e aceeasi
import { useAuthStore } from '../store/authStore';

const PlayerHomePage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const gradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";
  const { user } = useAuthStore();

  // Determinam numele jucatorului sau fallback la "Player"
  const playerName = user ? `${user.name || ''} ${user.surname || ''}`.trim() || user.username : 'Player';

  return (
    <Box>
      <NavigationBarPlayer />

      {/* Sectiunea cu imagine de fundal */}
      <Box
        h="750px"
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
            Welcome to Golazo FC, {playerName}!
          </Heading>
          <Text fontSize="lg" mb={8}>
            Check your squad, view training schedules, and track your performance.
          </Text>
          <Button
            as="a"
            href="/position-fixxtures"
            colorScheme="red"
            size="lg"
            rightIcon={<Box as="span" ml={2}>→</Box>}
          >
            View Squads For Upcoming Matches
          </Button>
        </Flex>
      </Box>

      {/* Sectiunea Info */}
      <Box bg={bgColor} py={12} sx={{ outline: 'none', userSelect: 'none' }}>
        <Container maxW="1500px">
          <Heading as="h2" size="xl" mb={6}>
            Player Tools
          </Heading>
          <Text>
            Access your personal dashboard to see upcoming matches, training plans, 
            and your performance stats. Stay prepared and perform at your best!
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default PlayerHomePage;