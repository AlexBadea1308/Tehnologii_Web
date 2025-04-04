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
import NavigationBarAdmin from '../components_custom/NavigatorBarAdmin';
import backgroundImage from '../../public/images/background.jpg'; 
import { useAuthStore } from '../store/authStore';

const AdminHomePage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const gradient = "linear-gradient(135deg, #6b7280 0%, #4b5563 25%, #374151 50%, #1f2937 75%, #111827 100%)"; // A more muted gradient for admin theme
  const { user } = useAuthStore();

  const adminName = user ? `${user.name || ''} ${user.surname || ''}`.trim() || user.username : 'Admin';

  return (
    <Box>
      <NavigationBarAdmin />

      {/* Section with Background Image */}
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
            Welcome to Golazo FC Admin Panel, {adminName}!
          </Heading>
          <Text fontSize="lg" mb={8}>
            Oversee users, events, products, and pricing with ease.
          </Text>
          <Button
            as="a"
            href="/admin/users"
            colorScheme="purple"
            size="lg"
            rightIcon={<Box as="span" ml={2}>→</Box>}
          >
            Manage Users
          </Button>
        </Flex>
      </Box>

      {/* Admin Tools Section */}
      <Box bg={bgColor} py={12} sx={{ outline: 'none', userSelect: 'none' }}>
        <Container maxW="1500px">
          <Heading as="h2" size="xl" mb={6}>
            Admin Tools
          </Heading>
          <Text>
            This dashboard provides you with tools to manage users, post and edit team events, 
            handle products and accessories, and adjust pricing for tickets and items. Control everything from here!
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminHomePage;