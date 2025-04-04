import React from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Link,
  Icon,
  Badge,
  Image,
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import NavigationBar from '../components_custom/NavigatorBarFun'; // Presupun ca ai asta deja

const ContactPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'black');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300'); 

  // Coordonate pentru Stadionul Municipal din Topoloveni
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2836.252819431337!2d25.08333331550925!3d44.81666697909858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b2e8f4e6e8c5b7%3A0x8e8e8e8e8e8e8e8e!2sStadion%20Municipal%20Topoloveni%2C%20Topoloveni%2C%20Romania!5e0!3m2!1sen!2sro!4v1677654321897!5m2!1sen!2sro";

  return (
    <>
      <NavigationBar />
      <Container maxW="1450px" py={8} sx={{ outline: 'none', userSelect: 'none' }}>
        <Box
          bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);"
          borderRadius="2xl"
          p={12}
          mb={8}
          boxShadow="2xl"
          transition="all 0.5s"
          _hover={{ boxShadow: '3xl', transform: 'scale(1.02)' }}
          position="relative"
          overflow="hidden"
        >
          <Heading
            as="h1"
            size="2xl"
            mb={6}
            color={accentColor}
            textAlign="center"
            fontWeight="extrabold"
            zIndex="1"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.2)"
          >
            Contact Us
          </Heading>
          <Text
            color={textColor}
            fontSize="lg"
            textAlign="center"
            mb={8}
            zIndex="1"
            fontStyle="italic"
          >
            Get in touch with Golazo FC for any inquiries or support!
          </Text>
        </Box>

        <VStack spacing={8} align="stretch" >
          <Box
            bg={bgColor}
            borderRadius="lg"
            borderWidth="2px"
            borderColor={borderColor}
            p={8}
            boxShadow="lg"
            transition="all 0.3s"
            _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
             bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);"
          >
            <Heading as="h2" size="lg" mb={6} color={accentColor} textAlign="center" >
              Get in Touch
            </Heading>
            <VStack align="start" spacing={6} px={4}>
              <HStack spacing={4} align="center">
                <Icon as={FaPhone} color={accentColor} boxSize={4} />
                <Text color={textColor} fontSize="lg" fontWeight="medium">
                  +40 123 456 789
                </Text>
              </HStack>
              <HStack spacing={4} align="center">
                <Icon as={FaEnvelope} color={accentColor} boxSize={4} />
                <Text color={textColor} fontSize="lg" fontWeight="medium">
                  contact@golazofc.com
                </Text>
              </HStack>
              <HStack spacing={4} align="center">
                <Icon as={FaMapMarkerAlt} color={accentColor} boxSize={4} />
                <Text color={textColor} fontSize="lg" fontWeight="medium">
                  Str. Principala 123, Topoloveni, Arges, Romania
                </Text>
              </HStack>
            </VStack>
          </Box>
          
          <Box
            bg={bgColor}
            borderRadius="lg"
            borderWidth="2px"
            borderColor={borderColor}
            p={6}
            boxShadow="lg"
            transition="all 0.3s"
            _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
             bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);"
          >
            <Heading as="h2" size="lg" mb={4} color={accentColor} textAlign="center">
              Our Location - Stadionul Topoloveni
            </Heading>
            <Box
              as="iframe"
              src={mapSrc}
              width="100%"
              height="400px"
              border="0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </VStack>

        <Box
          as="footer"
          bg="black"
          py={4}
          mt={8}
          borderTopRadius="md"
          width="100%"
          sx={{ outline: 'none', userSelect: 'none' }}
           bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);"
        >
          <HStack justify="center" spacing={4}>
            <Badge
              colorScheme="blue"
              variant="solid"
              px={4}
              py={2}
              borderRadius="md"
              fontSize="sm"
              as={Link}
              href="http://www.anpc.gov.ro"
              isExternal
              _hover={{ textDecoration: 'none', bg: 'blue.600' }}
            >
              ANPC
            </Badge>
            <Badge
              colorScheme="blue"
              variant="solid"
              px={4}
              py={2}
              borderRadius="md"
              fontSize="sm"
              as={Link}
              href="http://ec.europa.eu/odr"
              isExternal
              _hover={{ textDecoration: 'none', bg: 'blue.600' }}
            >
              Solutionarea Online a Litigiilor
            </Badge>
          </HStack>
        </Box>
      </Container>
    </>
  );
};

export default ContactPage;