import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Badge,
  Image,
} from '@chakra-ui/react';

const TrainingPlanDisplay = ({ plan }) => {
  // Verifică dacă planul există
  if (!plan) {
    return <Text color="black">No plan training found!</Text>;
  }

  // Formatează datele
  const formattedDate = new Date(plan.date).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedCreatedAt = new Date(plan.createdAt).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedUpdatedAt = new Date(plan.updatedAt).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Verifica daca exista un meci asociat (doar echipe)
  const matchTeams = plan.matchId
    ? `${plan.matchId.teams.join(' vs ')}`
    : 'Niciun meci asociat';

  // Verifica creatorul
  const creator = plan.createdBy?.name && plan.createdBy?.surname
    ? `${plan.createdBy.name} ${plan.createdBy.surname}`
    : 'Unknown User';

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bgGradient="linear-gradient(90deg, #1e78bf, #00a38e)"
      maxW="600px"
      mx="auto"
      color="black"
    >
      <VStack align="start" spacing={4}>
        {/* Titlu și imaginea mingii */}
        <HStack justify="space-between" w="full">
          <Heading as="h2" size="lg">
            {'Titlu: ' + (plan.title || 'Training plan:')}
          </Heading>
          <Image src="/images/ball.png" alt="Soccer Ball" boxSize="80px" />
        </HStack>

        {/* Descriere */}
        <Text fontSize="md">
          {'Descriere: ' + (plan.description || 'Without description.')}
        </Text>

        {/* Detalii generale */}
        <HStack spacing={4}>
          <Badge colorScheme="teal">Data: {formattedDate}</Badge>
          <Badge colorScheme="blue">Duration: {plan.duration} min</Badge>
        </HStack>

        {/* Meci asociat (doar echipe) */}
        <Text fontWeight="bold">Game:</Text>
        <Text>{matchTeams}</Text>

        {/* Creator și Timestamps */}
        <Text fontWeight="bold">Create by:</Text>
        <Text>{creator}</Text>

        <HStack spacing={4}>
          <Badge colorScheme="purple">
            Crate at: {formattedCreatedAt}
          </Badge>
          <Badge colorScheme="orange">
            Update at: {formattedUpdatedAt}
          </Badge>
        </HStack>

        {/* Secțiunea de exerciții */}
        <Box>
          <Heading as="h3" size="md" mt={4}>
            Exercises
          </Heading>
          {plan.exercises && plan.exercises.length > 0 ? (
            <VStack align="start" mt={2} spacing={2}>
              {plan.exercises.map((exercise, index) => (
                <Text key={index}>
                  - {exercise.name}{' '}
                  {exercise.duration ? `(${exercise.duration} min)` : '(Duration unspecified)'}{' '}
                  {exercise.description && `- ${exercise.description}`}
                </Text>
              ))}
            </VStack>
          ) : (
            <Text>No exercises added.</Text>
          )}
        </Box>

        {/* Divider pentru separare vizuală */}
        <Divider my={4} />
      </VStack>
    </Box>
  );
};

export default TrainingPlanDisplay;