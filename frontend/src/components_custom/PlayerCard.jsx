import React from 'react';
import { Box, Image, Text, HStack, SimpleGrid } from '@chakra-ui/react';

const PlayerCard = ({ player }) => {
  const cardBg = '../../public/images/playercard.png';

  return (
    <Box
      w="200px"
      h="350px"
      bgImage={cardBg}
      bgSize="cover"
      bgPosition="center"
      borderRadius="20px"
      overflow="hidden"
      boxShadow="xl"
      transition="transform 0.3s ease"
      _hover={{ transform: 'scale(1.05)' }}
      position="relative"
    >
      {/* Imaginea jucatorului */}
      <Image
        src={player.profileImage || 'https://via.placeholder.com/200x200'}
        alt={`${player.name || 'Player'} ${player.surname || ''}`}
        w="100%"
        h="200px"
        objectFit="cover"
        borderBottom="2px solid rgba(255, 255, 255, 0.5)"
      />

      {/* Pozitie si overlay */}
      <Box
        position="absolute"
        top="160px"
        left="10px"
        color="white"
        px={2}
        py={1}
        borderRadius="md"
        fontWeight="bold"
        fontSize="lg"
        textTransform="uppercase"
      >
        {player.position || 'N/A'}
        <Text
          fontSize="sm"
          fontWeight="bold"
          color="white"
          fontFamily="'Montserrat', sans-serif"
          textShadow="0 0 5px black"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {player.name || 'Unknown'} {player.surname || ''}
        </Text>
      </Box>

      {/* Statistici - Layout compact pe doua coloane cu text negru */}
      <SimpleGrid columns={2} spacing={0} p={7} mt={0}>
        {/* Prima coloana */}
        <Box>
          <HStack justifyContent="space-between" px={5} py={0}>
            <Text fontSize="sm" fontWeight="bold" color="black">M</Text>
            <Text fontSize="sm" fontWeight="bold" color="black">{player.matchesPlayed ?? 0}</Text>
          </HStack>
          <HStack justifyContent="space-between" px={5} py={0}>
            <Text fontSize="sm" fontWeight="bold" color="black">G</Text>
            <Text fontSize="sm" fontWeight="bold" color="black">{player.goals ?? 0}</Text>
          </HStack>
          <HStack justifyContent="space-between" px={5} py={0}>
            <Text fontSize="sm" fontWeight="bold" color="black">A</Text>
            <Text fontSize="sm" fontWeight="bold" color="black">{player.assists ?? 0}</Text>
          </HStack>
        </Box>
        
        {/* A doua coloana */}
        <Box>
          <HStack justifyContent="space-between" px={5} py={0}>
            <Text fontSize="sm" fontWeight="bold" color="black">YC</Text>
            <Text fontSize="sm" fontWeight="bold" color="black">{player.yellowCards ?? 0}</Text>
          </HStack>
          <HStack justifyContent="space-between" px={5} py={0}>
            <Text fontSize="sm" fontWeight="bold" color="black">RC</Text>
            <Text fontSize="sm" fontWeight="bold" color="black">{player.redCards ?? 0}</Text>
          </HStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default PlayerCard;