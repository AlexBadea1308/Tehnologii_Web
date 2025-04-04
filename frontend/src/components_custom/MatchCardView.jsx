import React from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Image,
  Stack,
  Button,
  useToast,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTrainingPlanStore } from '../store/trainingPlanStore.js';

const MatchCard = ({ match, onOpenForm }) => {
  const { trainingPlans } = useTrainingPlanStore();
  const toast = useToast();

  const textColor = useColorModeValue('gray.600', 'white');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const hasTrainingPlan = trainingPlans.some((plan) => {
    const planMatchId = plan.matchId?._id ? String(plan.matchId._id) : String(plan.matchId);
    return planMatchId === String(match._id);
  });
  const associatedPlan = trainingPlans.find((plan) => {
    const planMatchId = plan.matchId?._id ? String(plan.matchId._id) : String(plan.matchId);
    return planMatchId === String(match._id);
  });

  const handleAction = () => {
    onOpenForm(match._id, hasTrainingPlan ? associatedPlan : null);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      bg={bg}
      borderColor={borderColor}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'md',
      }}
      position="relative"
      maxW={{ base: '100%', md: '300px' }}
    >
      <Box position="relative" height="200px" overflow="hidden">
        <Image
          src={match.image || '/default-match-image.png'}
          alt={match.teams?.join(' vs ') || 'Match'}
          w="100%"
          h="100%"
          objectFit="cover"
          fallbackSrc="/default-match-image.png"
        />
      </Box>

      <Box p={4}>
        <Box mb={2}>
          <Heading as="h3" size="md" noOfLines={1} color={textColor}>
            {match.teams?.join(' vs ') || 'Unknown Match'}
          </Heading>
          <Badge colorScheme="purple" mt={1} color={textColor}>
            {match.competition || 'Unknown Competition'}
          </Badge>
        </Box>

        <Text color={textColor} fontSize="sm" noOfLines={2} mb={1}>
          Date: {match.eventDate ? new Date(match.eventDate).toLocaleDateString() : 'Unknown Date'}
        </Text>
        <Text color={textColor} fontSize="sm" noOfLines={1} mb={3}>
          Location: {match.location || 'Unknown Location'}
        </Text>

        <Flex justify="center">
          <Button
            colorScheme={hasTrainingPlan ? 'blue' : 'teal'}
            size="sm"
            onClick={handleAction}
          >
            {hasTrainingPlan ? 'View Plan' : 'No plan'}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default MatchCard;