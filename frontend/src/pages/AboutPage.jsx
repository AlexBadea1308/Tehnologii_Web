import React from 'react';
import { Box, Flex, Heading, Text, Container, Image, useBreakpointValue, SimpleGrid } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import trophy1 from '../../public/images/trophy1.png';
import table1 from '../../public/images/table1.png';
import trophy2 from '../../public/images/trophy2.png';
import trophy3 from '../../public/images/trophy3.jpg';
import trophy4 from '../../public/images/trophy4.png';
import NavigationBar from '../components_custom/NavigatorBarFun';

const AboutPage = () => {
  const gradient = "linear-gradient(135deg, #e62b33 0%, #8b3ea8 25%, #1e78bf 50%, #00a38e 75%, #f4a124 100%)";
  const bgColor = useBreakpointValue({ base: 'white', md: 'gray.800' });

  return (
    <>
    <NavigationBar />
    <Container maxW="100%" p={0} minH="100vh" bg={bgColor}  bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);"  sx={{ outline: 'none', userSelect: 'none' }}>
      <Flex direction="column" alignItems="center" pt={8} pb={8}>
        <Box w="full" maxW="1500px" mb={8}>
          <Heading as="h2" size="xl" mb={4} color="white" textAlign="center">
            Our Trophies & Achievements
          </Heading>
          <Carousel
            infiniteLoop
            autoPlay
            interval={5000}
            showArrows={true}
            showThumbs={false}
            showStatus={false}
            emulateTouch
          >
            <Box>
              <Image src={trophy1} alt="Image 1" maxW="600px" maxH="400px" objectFit="contain" />
            </Box>
            <Box>
              <Image src={table1} alt="Image 2" maxW="600px" maxH="400px" objectFit="contain" />
            </Box>
            <Box>
              <Image src={trophy2} alt="Image 3" maxW="600px" maxH="400px" objectFit="contain" />
            </Box>
            <Box>
              <Image src={trophy3} alt="Image 3" maxW="600px" maxH="400px" objectFit="contain" />
            </Box>
            <Box>
              <Image src={trophy4} alt="Image 5" maxW="600px" maxH="400px" objectFit="contain" />
            </Box>
          </Carousel>
        </Box>

        {/* Team Information Section */}
        <Box w="full" maxW="1200px" p={6} bg={useBreakpointValue({ base: 'white', md: 'gray.700' })} borderRadius="lg">
          <Heading as="h2" size="xl" mb={4} color="white">
            About the Team
          </Heading>
          <Text fontSize="lg" color="whiteAlpha.800" mb={4}>
            Our football team has been a powerhouse for years, and we take pride in our hard work and dedication. From winning national titles to representing our city on the global stage, our team is united by passion, perseverance, and a love for the game.
          </Text>
          <Text fontSize="md" color="whiteAlpha.600">
            Golazo FC is a football club with a golden history, a symbol of passion and determination, recognized internationally for one of the greatest achievements in European football. Founded with the ambition to dominate both domestic and continental competitions, Golazo FC earned its place in football history through a memorable triumph in the 1986 European Champions Cup.

            On a magical May evening at the Ramón Sánchez Pizjuán Stadium in Seville, Golazo FC rewrote football destiny by facing the mighty FC Barcelona in a dramatic final. After 120 minutes of heroic resistance against the opponent's attacks, the match was decided by a penalty shootout. Golazo FC's legendary goalkeeper made history with his extraordinary saves, stopping no fewer than four penalties and securing the prestigious trophy for the club.

            This victory turned Golazo FC into a respected force in European football, making it the first team from the region to lift the prestigious trophy. Determination, discipline, and fighting spirit defined the team, inspiring generations of players and fans.

            Today, Golazo FC continues to be a symbol of excellence in football, honoring its legacy through impressive performances in national and international competitions. The club remains true to its core values: hard work, respect for tradition, and the relentless pursuit of new heights of success.
          </Text>
        </Box>

        {/* Team Achievements Section */}
        <Box w="full" maxW="1200px" p={6} bg={useBreakpointValue({ base: 'white', md: 'gray.800' })} borderRadius="lg" mt={8}>
          <Heading as="h2" size="xl" mb={4} color="white">
            Team Achievements
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <Box p={4} bg="gray.700" borderRadius="md" textAlign="center">
              <Heading size="md" color="white">Domestic League Titles</Heading>
              <Text color="whiteAlpha.700">10 Championships</Text>
            </Box>
            <Box p={4} bg="gray.700" borderRadius="md" textAlign="center">
              <Heading size="md" color="white">National Cups</Heading>
              <Text color="whiteAlpha.700">8 Cups</Text>
            </Box>
            <Box p={4} bg="gray.700" borderRadius="md" textAlign="center">
              <Heading size="md" color="white">European Titles</Heading>
              <Text color="whiteAlpha.700">1 Champions League</Text>
            </Box>
            <Box p={4} bg="gray.700" borderRadius="md" textAlign="center">
              <Heading size="md" color="white">Super Cups</Heading>
              <Text color="whiteAlpha.700">4 National Super Cups</Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Flex>
    </Container>
    </>
  );
};

export default AboutPage;