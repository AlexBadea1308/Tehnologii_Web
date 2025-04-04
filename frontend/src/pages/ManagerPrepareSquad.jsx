import React, { useState, useEffect } from 'react';
import { 
  Box, Flex, Heading, Button, SimpleGrid, Text, Select, HStack, VStack, Badge, 
  Divider, Radio, RadioGroup, useToast, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalBody, ModalFooter 
} from '@chakra-ui/react';
import { useMatchStore } from '../store/matchStore.js';
import { usePlayerStatsStore } from '../store/playerStatsStore.js';
import { useAuthStore } from '../store/authStore';
import { useSquadStore } from '../store/squadStore';
import PlayerSquad from '../components_custom/PlayerSquad';
import NavigationBarManager from '../components_custom/NavigatorBarManager';
import { formations } from '../store/formationsStore.js';

const ManagerPrepareSquad = () => {
  const { fetchMatches, matches, loading: matchLoading, error: matchError } = useMatchStore();
  const { fetchPlayerStats, playerStats, loading: statsLoading, error: statsError } = usePlayerStatsStore();
  const { token } = useAuthStore();
  const { createSquad, getSquadByMatchId, deleteSquad } = useSquadStore();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState("4-3-3");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [existingSquadId, setExistingSquadId] = useState(null);
  const [existingSquad, setExistingSquad] = useState(null);
  
  // Dynamic playersPerPage based on screen size
  const [playersPerPage, setPlayersPerPage] = useState(() => {
    const width = window.innerWidth;
    if (width < 768) return 4; // Phone
    if (width >= 768 && width < 1024) return 8; // Tablet
    return 20; // Desktop
  });

  const toast = useToast();

  // Update playersPerPage on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setPlayersPerPage(4); // Phone
      else if (width >= 768 && width < 1024) setPlayersPerPage(8); // Tablet
      else setPlayersPerPage(20); // Desktop
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initializeSquad = (formationKey) => {
    const formationPositions = Object.keys(formations[formationKey].positions);
    const squadObj = formationPositions.reduce((acc, pos) => {
      acc[pos] = null;
      return acc;
    }, {});
    
    ['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].forEach(subPos => {
      squadObj[subPos] = null;
    });
    
    return squadObj;
  };
  
  const [squad, setSquad] = useState(initializeSquad(selectedFormation));

  useEffect(() => {
    setSquad(initializeSquad(selectedFormation));
  }, [selectedFormation]);

  const isSquadComplete = Object.values(squad).every(player => player !== null);

  const processPlayerStats = (players) => {
    if (!Array.isArray(players)) {
      return [];
    }
    return players.map(player => {
      const userData = player.playerId?.playerId || player.playerId || {};
      return {
        ...player,
        name: userData.name || 'Unknown Name',
        surname: userData.surname || 'Unknown Surname',
        position: player.position || 'Unknown',
        _id: player._id,
        profileImage: player.profileImage || null,
      };
    });
  };

  useEffect(() => {
    fetchMatches();
    fetchPlayerStats().then((data) => {
      if (data) {
        const processedData = processPlayerStats(data);
      }
    });
  }, [fetchMatches, fetchPlayerStats]);

  const addPlayerToPosition = (player, position) => {
    const isPlayerInSquad = Object.values(squad).some(p => p && p._id === player._id);
    if (isPlayerInSquad) return;

    setSquad((prev) => ({
      ...prev,
      [position]: player,
    }));
  };

  const removePlayerFromPosition = (position) => {
    setSquad((prev) => ({
      ...prev,
      [position]: null,
    }));
  };

  const getAvailablePlayers = () => {
    const processedStats = processPlayerStats(playerStats);
    return processedStats.filter(player => 
      !Object.values(squad).some(squadPlayer => squadPlayer && squadPlayer._id === player._id)
    );
  };

  // Functie pentru resetarea starii
  const resetSquadState = () => {
    setSelectedMatch(null);
    setSelectedFormation("4-3-3");
    setSquad(initializeSquad("4-3-3"));
    setExistingSquadId(null);
    setExistingSquad(null);
    setIsSquadModalOpen(false);
    setIsViewModalOpen(false);
    setCurrentPage(1); // Reset page to 1 when resetting state
  };

  const handleMatchSelection = async (e) => {
    const matchIndex = e.target.value;
    if (matchIndex === "") {
      resetSquadState();
      return;
    }

    const match = matches[matchIndex];
    setSelectedMatch(match);

    if (token) {
      const result = await getSquadByMatchId(match._id);
      if (result.success) {
        setExistingSquadId(result.data._id);
        setExistingSquad(result.data);
        setIsSquadModalOpen(true);
      } else {
        setExistingSquadId(null);
        setExistingSquad(null);
      }
    }
  };

  const handleDeleteSquad = async () => {
    if (!existingSquadId) return;

    const result = await deleteSquad(existingSquadId);
    if (result.success) {
      toast({
        title: "Squad Deleted",
        description: "The existing squad has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetSquadState();
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to delete the squad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancelSquad = () => {
    resetSquadState();
  };

  const handleViewSquad = () => {
    setIsSquadModalOpen(false);
    setIsViewModalOpen(true);
  };

  const saveSquad = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save the squad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!selectedMatch || !isSquadComplete) {
      toast({
        title: "Incomplete Squad",
        description: "Please select a match and fill all squad positions.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const squadData = {
      matchId: selectedMatch._id,
      players: Object.entries(squad).map(([position, player]) => ({
        playerId: player._id,
        position: position.startsWith('SUB') ? 'Substitute' : position,
        isStarter: !position.startsWith('SUB'),
      })),
      formation: selectedFormation,
      status: 'draft',
    };

    try {
      const result = await createSquad(squadData);
      if (result.success) {
        toast({
          title: "Squad Saved",
          description: "The squad has been successfully saved.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        resetSquadState();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save the squad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getExistingSquadDisplay = () => {
    if (!existingSquad || !playerStats) {
      return initializeSquad("4-3-3");
    }

    const formationKey = existingSquad.formation || "4-3-3";
    const squadDisplay = initializeSquad(formationKey);
    const formationPositions = Object.keys(formations[formationKey].positions);
    const processedPlayerStats = processPlayerStats(playerStats);

    existingSquad.players.forEach(player => {
      let position = player.position;
      const basePosition = position.replace(/\d+$/, '');

      if (!player.playerId || !player.playerId._id) {
        return;
      }

      const fullPlayerStats = processedPlayerStats.find(p => 
        p._id && p._id.toString() === player.playerId._id.toString()
      );

      if (!fullPlayerStats) {
        return;
      }

      const fullPlayer = {
        ...fullPlayerStats,
        name: fullPlayerStats.name || 'Unknown Name',
        surname: fullPlayerStats.surname || 'Unknown Surname',
        position: fullPlayerStats.position || player.position || 'Unknown',
        profileImage: player.playerId.profileImage || fullPlayerStats.profileImage || null,
      };

      if (formationPositions.includes(position) && !squadDisplay[position]) {
        squadDisplay[position] = fullPlayer;
      } else if (player.isStarter) {
        const matchingPosition = formationPositions.find(pos => 
          pos.startsWith(basePosition) && !squadDisplay[pos]
        );
        if (matchingPosition) {
          squadDisplay[matchingPosition] = fullPlayer;
        }
      } else {
        const subPosition = ['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].find(pos => !squadDisplay[pos]);
        if (subPosition) {
          squadDisplay[subPosition] = fullPlayer;
        }
      }
    });

    return squadDisplay;
  };

  if (matchError) return <div>Error loading matches: {matchError}</div>;
  if (statsError) return <div>Error loading player stats: {statsError}</div>;
  if (!matches.length || !playerStats) return <div>No data available</div>;

  const selectedPlayersCount = Object.values(squad).filter(player => player !== null).length;
  const formationPositions = Object.keys(formations[selectedFormation].positions);
  const currentFormation = formations[selectedFormation];
  const existingSquadDisplay = getExistingSquadDisplay();
  const existingFormation = formations[existingSquad?.formation || "4-3-3"];

  const availablePlayers = getAvailablePlayers();
  const totalPages = Math.ceil(availablePlayers.length / playersPerPage);
  const paginatedPlayers = availablePlayers.slice(
    (currentPage - 1) * playersPerPage,
    currentPage * playersPerPage
  );

  return (
    <>
      <NavigationBarManager />
      <Box p={{ base: 3, md: 5 }} maxW="100vw" overflowX="hidden" sx={{ outline: 'none', userSelect: 'none' }}>
        <Heading mb={{ base: 3, md: 5 }} fontSize={{ base: "xl", md: "2xl" }}>Create Squad for Match</Heading>

        <Select 
          mb={4} 
          onChange={handleMatchSelection} 
          value={selectedMatch ? matches.findIndex(m => m._id === selectedMatch._id) : ""} 
          size={{ base: "sm", md: "md" }}
        >
          <option value="">Select a match</option>
          {matches.map((match, index) => (
            <option key={match._id} value={index}>
              {match.teams[0]} vs {match.teams[1]}
            </option>
          ))}
        </Select>

        <Box mb={4} sx={{ outline: 'none', userSelect: 'none' }}>
          <Heading size={{ base: "sm", md: "md" }} mb={2}>Select Formation</Heading>
          <RadioGroup onChange={setSelectedFormation} value={selectedFormation}>
            <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap">
              {Object.keys(formations).map((key) => (
                <Radio key={key} value={key} size={{ base: "sm", md: "md" }}>
                  {formations[key].name}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        </Box>

        <Flex justifyContent="space-between" mb={4} flexWrap="wrap" gap={2} sx={{ outline: 'none', userSelect: 'none' }}>
          <Badge colorScheme={isSquadComplete ? "green" : "yellow"} p={2} borderRadius="md" fontSize={{ base: "sm", md: "md" }}>
            Squad: {selectedPlayersCount}/16 players selected
          </Badge>
          <Badge colorScheme="purple" p={2} borderRadius="md" fontSize={{ base: "sm", md: "md" }}>
            Formation: {formations[selectedFormation].name}
          </Badge>
          {selectedMatch && (
            <Badge colorScheme="blue" p={2} borderRadius="md" fontSize={{ base: "sm", md: "md" }}>
              Match: {selectedMatch.teams[0]} vs {selectedMatch.teams[1]}
            </Badge>
          )}
        </Flex>

        <Flex direction={{ base: "column", md: "row" }} gap={{ base: 2, md: 1 }} sx={{ outline: 'none', userSelect: 'none' }}>
          <Box flex="1" maxW={{ base: "100%", md: "30%" }}>
            <Heading size={{ base: "sm", md: "md" }} mb={4}>Available Players ({availablePlayers.length})</Heading>
            <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: 1, md: 2 }}>
              {paginatedPlayers.map((player) => (
                <PlayerSquad
                  key={player._id}
                  player={player}
                  onClick={() => {
                    const currentPositions = formationPositions;
                    let position = null;
                    const playerPosition = player.position || 'Unknown';
                    for (const pos of currentPositions) {
                      const compatiblePositions = currentFormation.positionMapping[pos] || [];
                      if (compatiblePositions.includes(playerPosition) && !squad[pos]) {
                        position = pos;
                        break;
                      }
                    }
                    if (position) {
                      addPlayerToPosition(player, position);
                    } else {
                      const emptySubPosition = ['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].find(pos => !squad[pos]);
                      if (emptySubPosition) {
                        addPlayerToPosition(player, emptySubPosition);
                      } else {
                        const emptyPosition = Object.keys(squad).find(pos => !squad[pos]);
                        if (emptyPosition) addPlayerToPosition(player, emptyPosition);
                      }
                    }
                  }}
                />
              ))}
            </SimpleGrid>

            {totalPages > 1 && (
              <HStack mt={4} justifyContent="center" sx={{ outline: 'none', userSelect: 'none' }}>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  isDisabled={currentPage === 1}
                  size={{ base: "sm", md: "md" }}
                >
                  Previous
                </Button>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  Page {currentPage} of {totalPages}
                </Text>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  isDisabled={currentPage === totalPages}
                  size={{ base: "sm", md: "md" }}
                >
                  Next
                </Button>
              </HStack>
            )}
          </Box>

          <Box flex="1" maxW={{ base: "100%", md: "70%" }} sx={{ outline: 'none', userSelect: 'none' }}>
            <Box
              w={{ base: "100%", sm: "500px", md: "1000px" }}
              h={{ base: "300px", sm: "400px", md: "625px" }}
              bg="green.500"
              position="relative"
              border="2px"
              borderColor="white"
              borderRadius="md"
              backgroundImage="linear-gradient(to right, green, darkgreen)"
            >
              <Box position="absolute" top="0" left="50%" w="2px" h="100%" bg="white" sx={{ outline: 'none', userSelect: 'none' }}/>
              <Box 
                position="absolute" 
                top="50%" 
                left="50%" 
                w={{ base: "40px", md: "80px" }} 
                h={{ base: "40px", md: "80px" }} 
                border="2px solid white" 
                borderRadius="50%" 
                transform="translate(-50%, -50%)" 
                sx={{ outline: 'none', userSelect: 'none' }}
              />
              
              {formationPositions.map(position => (
                <Box 
                  key={position} 
                  position="absolute" 
                  top={currentFormation.positions[position].top} 
                  left={currentFormation.positions[position].left} 
                  transform="translate(-50%, -50%)"
                  sx={{ outline: 'none', userSelect: 'none' }}
                >
                  {squad[position] ? (
                    <PlayerSquad player={squad[position]} onClick={() => removePlayerFromPosition(position)} />
                  ) : (
                    <Box
                      w={{ base: "30px", md: "50px" }}
                      h={{ base: "30px", md: "50px" }}
                      bg="rgba(255,255,255,0.7)"
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                      sx={{ outline: 'none', userSelect: 'none' }}
                      onClick={() => {
                        const compatiblePlayers = availablePlayers.filter(p => 
                          (currentFormation.positionMapping[position] || []).includes(p.position || 'Unknown')
                        );
                        if (compatiblePlayers.length > 0) addPlayerToPosition(compatiblePlayers[0], position);
                      }}
                    >
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold">{currentFormation.positionNames[position]}</Text>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <Box mt={4} w={{ base: "100%", sm: "500px", md: "700px" }} sx={{ outline: 'none', userSelect: 'none' }}>
              <Heading size={{ base: "sm", md: "md" }} mb={2}>Substitutes (5)</Heading>
              <Divider mb={4} />
              <Flex 
                justifyContent="space-between" 
                alignItems="center" 
                flexWrap={{ base: "wrap", md: "nowrap" }} 
                gap={{ base: 2, md: 0 }}
              >
                {['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].map((subPosition, index) => (
                  <Box key={subPosition} textAlign="center" minW={{ base: "60px", md: "auto" }}>
                    {squad[subPosition] ? (
                      <VStack>
                        <PlayerSquad player={squad[subPosition]} onClick={() => removePlayerFromPosition(subPosition)} />
                        <Badge colorScheme="blue" fontSize={{ base: "xs", md: "sm" }}>SUB {index + 1}</Badge>
                      </VStack>
                    ) : (
                      <VStack>
                        <Box
                          w={{ base: "40px", md: "60px" }}
                          h={{ base: "60px", md: "90px" }}
                          bg="rgba(255,255,255,0.4)"
                          borderRadius="10px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          cursor="pointer"
                          boxShadow="md"
                          onClick={() => {
                            if (availablePlayers.length > 0) {
                              addPlayerToPosition(availablePlayers[0], subPosition);
                            }
                          }}
                        >
                          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>+</Text>
                        </Box>
                        <Badge colorScheme="gray" fontSize={{ base: "xs", md: "sm" }}>SUB {index + 1}</Badge>
                      </VStack>
                    )}
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>
        </Flex>

        <HStack mt={{ base: 2, md: 1 }} spacing={2} justify={{ base: "center", md: "flex-start" }} sx={{ outline: 'none', userSelect: 'none' }}>
          <Button 
            colorScheme="red" 
            variant="outline" 
            onClick={() => setSquad(initializeSquad(selectedFormation))}
            size={{ base: "sm", md: "md" }}
          >
            Reset Squad
          </Button>
          <Button 
            colorScheme="teal" 
            size={{ base: "sm", md: "md" }} 
            onClick={saveSquad}
            isDisabled={!isSquadComplete || !selectedMatch}
          >
            {isSquadComplete ? 'Save Squad' : `Select ${16 - selectedPlayersCount} More`}
          </Button>
        </HStack>
      </Box>

      {/* Modal pentru squad existent */}
      <Modal isOpen={isSquadModalOpen} onClose={handleCancelSquad} isCentered size={{ base: "xs", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={{ base: "md", md: "lg" }}>Squad Already Prepared</ModalHeader>
          <ModalBody>
            <Text fontSize={{ base: "sm", md: "md" }}>You have already prepared a squad for this match.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={2} onClick={handleDeleteSquad} size={{ base: "sm", md: "md" }}>
              Delete
            </Button>
            <Button colorScheme="blue" mr={2} onClick={handleViewSquad} size={{ base: "sm", md: "md" }}>
              View
            </Button>
            <Button variant="ghost" onClick={handleCancelSquad} size={{ base: "sm", md: "md" }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal pentru vizualizarea squad-ului existent - restaurat la full screen */}
      <Modal isOpen={isViewModalOpen} onClose={() => {
        setIsViewModalOpen(false);
        resetSquadState();
      }} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={{ base: "md", md: "lg" }}>View Existing Squad</ModalHeader>
          <ModalBody>
            <Box flex="1" maxW={{ base: "100%", md: "60%" }} mx="auto" sx={{ outline: 'none', userSelect: 'none' }}>
              <Box
                w={{ base: "1000px", md: "1000px" }}
                h={{ base: "625px", md: "625px" }}
                bg="green.500"
                position="relative"
                border="2px"
                borderColor="white"
                borderRadius="md"
                backgroundImage="linear-gradient(to right, green, darkgreen)"
              >
                <Box position="absolute" top="0" left="50%" w="2px" h="100%" bg="white" sx={{ outline: 'none', userSelect: 'none' }}/>
                <Box 
                  position="absolute" 
                  top="50%" 
                  left="50%" 
                  w={{ base: "80px", md: "80px" }} 
                  h={{ base: "80px", md: "80px" }} 
                  border="2px solid white" 
                  borderRadius="50%" 
                  transform="translate(-50%, -50%)" 
                  sx={{ outline: 'none', userSelect: 'none' }}
                />
                
                {Object.keys(existingFormation.positions).map(position => (
                  <Box 
                    key={position} 
                    position="absolute" 
                    top={existingFormation.positions[position].top} 
                    left={existingFormation.positions[position].left} 
                    transform="translate(-50%, -50%)"
                    sx={{ outline: 'none', userSelect: 'none' }}
                  >
                    {existingSquadDisplay[position] ? (
                      <PlayerSquad player={existingSquadDisplay[position]} />
                    ) : (
                      <Box
                        w={{ base: "50px", md: "50px" }}
                        h={{ base: "50px", md: "50px" }}
                        bg="rgba(255,255,255,0.7)"
                        borderRadius="50%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ outline: 'none', userSelect: 'none' }}
                      >
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold">{existingFormation.positionNames[position]}</Text>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>

              <Box mt={4} w={{ base: "700px", md: "700px" }} sx={{ outline: 'none', userSelect: 'none' }}>
                <Heading size={{ base: "md", md: "md" }} mb={2}>Substitutes (5)</Heading>
                <Divider mb={4} />
                <Flex 
                  justifyContent="space-between" 
                  alignItems="center" 
                  flexWrap={{ base: "wrap", md: "nowrap" }} 
                  gap={{ base: 2, md: 0 }}
                >
                  {['SUB1', 'SUB2', 'SUB3', 'SUB4', 'SUB5'].map((subPosition, index) => (
                    <Box key={subPosition} textAlign="center" minW={{ base: "60px", md: "auto" }}>
                      {existingSquadDisplay[subPosition] ? (
                        <VStack>
                          <PlayerSquad player={existingSquadDisplay[subPosition]} />
                          <Badge colorScheme="blue" fontSize={{ base: "xs", md: "sm" }}>SUB {index + 1}</Badge>
                        </VStack>
                      ) : (
                        <VStack>
                          <Box
                            w={{ base: "60px", md: "60px" }}
                            h={{ base: "90px", md: "90px" }}
                            bg="rgba(255,255,255,0.4)"
                            borderRadius="10px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxShadow="md"
                          >
                            <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>-</Text>
                          </Box>
                          <Badge colorScheme="gray" fontSize={{ base: "xs", md: "sm" }}>SUB {index + 1}</Badge>
                        </VStack>
                      )}
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsViewModalOpen(false);
                resetSquadState();
              }}
              size={{ base: "sm", md: "md" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManagerPrepareSquad;