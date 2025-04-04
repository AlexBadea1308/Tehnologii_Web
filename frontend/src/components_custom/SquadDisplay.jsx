import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Flex,
  Divider,
  Badge,
  Text,
} from '@chakra-ui/react';
import PlayerSquad from './PlayerSquad';
import { formations } from '../store/formationsStore.js';

const SquadDisplay = ({ squad, formationKey = '4-3-3', playerStats = [] }) => {
  const getSquadDisplay = (squad) => {
    if (!squad || !squad.players) {
      const formationPositions = Object.keys(formations[formationKey].positions);
      const squadObj = formationPositions.reduce((acc, pos) => {
        acc[pos] = null;
        return acc;
      }, {});
      ['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].forEach(subPos => {
        acc[subPos] = null;
      });
      return squadObj;
    }

    const formationPositions = Object.keys(formations[formationKey].positions);
    const squadDisplay = formationPositions.reduce((acc, pos) => {
      acc[pos] = null;
      return acc;
    }, {});
    ['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].forEach(subPos => {
      squadDisplay[subPos] = null;
    });

    squad.players.forEach(player => {
      let position = player.position;
      const basePosition = position.replace(/\d+$/, '');

      // Match PlayerStats by _id
      const playerStat = playerStats.find(ps => 
        ps._id.toString() === player.playerId._id.toString()
      );

      const fullPlayer = {
        _id: player.playerId?._id || player.playerId,
        name: playerStat?.playerId?.name || 'Unknown',
        surname: playerStat?.playerId?.surname || '',
        position: player.playerId?.position || player.position || 'Unknown',
        profileImage: player.playerId?.profileImage || null,
      };

      if (position === 'Substitute') {
        const subPosition = ['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].find(pos => !squadDisplay[pos]);
        if (subPosition) {
          squadDisplay[subPosition] = fullPlayer;
        }
      } else if (formationPositions.includes(position) && !squadDisplay[position]) {
        squadDisplay[position] = fullPlayer;
      } else if (player.isStarter) {
        const matchingPosition = formationPositions.find(pos => 
          pos.startsWith(basePosition) && !squadDisplay[pos]
        );
        if (matchingPosition) {
          squadDisplay[matchingPosition] = fullPlayer;
        }
      }
    });

    return squadDisplay;
  };

  const squadDisplay = getSquadDisplay(squad);
  const currentFormation = formations[formationKey];

  return (
    <Box sx={{ outline: 'none', userSelect: 'none' }}>
      <Box
        w="1000px"
        h="625px"
        bg="green.500"
        position="relative"
        border="2px"
        borderColor="white"
        borderRadius="md"
        backgroundImage="linear-gradient(to right, green, darkgreen)"
      >
        <Box position="absolute" top="0" left="50%" w="2px" h="100%" bg="white" />
        <Box position="absolute" top="50%" left="50%" w="80px" h="80px" border="2px solid white" borderRadius="50%" transform="translate(-50%, -50%)" />
        {Object.keys(currentFormation.positions).map(position => (
          <Box
            key={position}
            position="absolute"
            top={currentFormation.positions[position].top}
            left={currentFormation.positions[position].left}
            transform="translate(-50%, -50%)"
          >
            {squadDisplay[position] ? (
              <PlayerSquad player={squadDisplay[position]} />
            ) : (
              <Box
                w="50px"
                h="50px"
                bg="rgba(255,255,255,0.7)"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" fontWeight="bold">{currentFormation.positionNames[position]}</Text>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Box mt={4} w="700px">
        <Heading size="md" mb={2}>Substitutes (5)</Heading>
        <Divider mb={4} />
        <Flex justifyContent="space-between" alignItems="center">
          {['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].map((subPosition, index) => (
            <Box key={subPosition} textAlign="center">
              {squadDisplay[subPosition] ? (
                <VStack>
                  <PlayerSquad player={squadDisplay[subPosition]} />
                  <Badge colorScheme="blue">SUB {index + 1}</Badge>
                </VStack>
              ) : (
                <VStack>
                  <Box
                    w="60px"
                    h="90px"
                    bg="rgba(255,255,255,0.4)"
                    borderRadius="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="md"
                  >
                    <Text fontWeight="bold">-</Text>
                  </Box>
                  <Badge colorScheme="gray">SUB {index + 1}</Badge>
                </VStack>
              )}
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default SquadDisplay;