import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Badge,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import NavigationBar from '../components_custom/NavigatorBarFun'; 
import { useMatchStore } from '../store/matchStore'; 

const FixturesPage = () => {
  const { matches, fetchMatches, loading, error } = useMatchStore();
  const [teamFixtures, setTeamFixtures] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  });
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const myTeam = 'Golazo FC';

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    const currentDate = new Date();
    let filteredFixtures = matches
      .filter(match => {
        const matchDate = new Date(match.eventDate);
        return matchDate > currentDate && match.teams.includes(myTeam);
      });

    // Aplica filtrul de data daca utilizatorul a selectat una
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filteredFixtures = filteredFixtures.filter(match => {
        const matchDate = new Date(match.eventDate);
        return matchDate >= filterDate;
      });
    }

    filteredFixtures.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    setTeamFixtures(filteredFixtures);
  }, [matches, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Text color="red.500" fontSize="xl">{error}</Text>
      </Container>
    );
  }

  return (
    <>
      <NavigationBar />
      <Container maxW="1500px" py={8} sx={{ outline: 'none', userSelect: 'none' }}  bgGradient="linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(25,72,129,0.3253676470588235) 100%);">
        <Heading as="h1" size="xl" mb={6} color={textColor}>
          Upcoming Fixtures for {myTeam}
        </Heading>

        {/* Filtru dupa data */}
        <FormControl mb={6} maxW="300px">
          <FormLabel color={textColor}>Filter from Date</FormLabel>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            bg={bgColor}
            borderColor={borderColor}
            color={textColor}
            _hover={{ borderColor: 'blue.500' }}
            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
          />
        </FormControl>

        {teamFixtures.length === 0 ? (
          <Box
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            p={6}
            textAlign="center"
            sx={{ outline: 'none', userSelect: 'none' }}
          >
            <Text fontSize="lg" color={textColor}>
              {selectedDate
                ? `No matches found for ${myTeam} from ${new Date(selectedDate).toLocaleDateString('en-GB')} onwards.`
                : `No upcoming matches found for ${myTeam}.`}
            </Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {teamFixtures.map(match => (
              <Box
                key={match._id}
                bg={bgColor}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                p={4}
                boxShadow="sm"
                transition="all 0.2s"
                _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
                sx={{ outline: 'none', userSelect: 'none' }}
              >
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(match.eventDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      {new Date(match.eventDate).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <HStack spacing={4}>
                      <Text fontWeight="bold" fontSize="md" color={textColor}>
                        {match.teams[0]}
                      </Text>
                      <Text fontSize="md" color={textColor}>
                        vs
                      </Text>
                      <Text fontWeight="bold" fontSize="md" color={textColor}>
                        {match.teams[1]}
                      </Text>
                    </HStack>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Badge colorScheme="blue" variant="solid">
                      {match.competition}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      {match.location}
                    </Text>
                  </VStack>
                </HStack>
                {match.description && (
                  <>
                    <Divider my={2} />
                    <Text fontSize="sm" color="gray.600">
                      {match.description}
                    </Text>
                  </>
                )}
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </>
  );
};

export default FixturesPage;