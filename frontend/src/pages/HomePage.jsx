import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import NavigationBar from '../components_custom/NavigatorBarFun';
import backgroundImage from '../../public/images/background.jpg';

const HomePage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  const eventDate = "Friday, 10th March, 2025, 22:00GMT";
  const gradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";

  return (
    <Box>
      <NavigationBar />
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
            Welcome to Golazo FC. The Home of Football!
          </Heading>
          <Text fontSize="lg" mb={8}>
            {eventDate}
          </Text>
          <Button
          as="a"
          href="/tickets"
          colorScheme="red"
          size="lg"
          rightIcon={<Box as="span" ml={2}>→</Box>}
          >
          Buy Tickets
          </Button>
        </Flex>
      </Box>
      
      {/* About Section */}
      <Box bg={bgColor} py={12} sx={{ outline: 'none', userSelect: 'none' }} >
        <Container maxW="1500px">
          <Heading as="h2" size="xl" mb={6}>
            Info About Our Club
          </Heading>
          <Text>
            This app is designed to help you follow our team's progress, view fixtures, buy tickets, and shop for merchandise.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;