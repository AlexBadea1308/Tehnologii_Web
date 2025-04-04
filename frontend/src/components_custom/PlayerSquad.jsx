import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

const PlayerSquad = ({ player, onClick }) => {
  const cardBg = '../../public/images/playercard.png';

  return (
    <Box
      w="80px"
      h="120px"
      bgImage={cardBg}
      bgSize="cover"
      bgPosition="center"
      borderRadius="10px"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.3s ease"
      _hover={{ transform: 'scale(1.05)' }}
      position="relative"
      onClick={onClick}
      cursor="pointer"
    >
      {/* Imaginea jucatorului */}
      <Image
        src={player.profileImage || 'https://via.placeholder.com/80x80'}
        alt={`${player.name || player.playerId?.name || 'Player'} ${player.surname || player.playerId?.surname || ''}`}
        w="100%"
        h="70px"
        objectFit="cover"
        borderBottom="1px solid rgba(255, 255, 255, 0.5)"
      />

      {/* Pozitie si nume */}
      <Box
        position="absolute"
        top="50px"
        left="5px"
        color="white"
        px={1}
        py={0}
        borderRadius="md"
        fontWeight="bold"
        fontSize="xs"
        textTransform="uppercase"
      >
        {player.position || 'N/A'}
      </Box>
      
      {/* Numele jucatorului */}
      <Text
        fontSize="xs"
        fontWeight="bold"
        color="black"
        fontFamily="'Montserrat', sans-serif"
        textShadow="0 0 2px white"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        p={2}
        textAlign="center"
      >
        {player.name || player.playerId?.name || 'Unknown'} {player.surname || player.playerId?.surname || ''}
      </Text>
    </Box>
  );
};

export default PlayerSquad;