import React, { useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Image, 
  Text, 
  VStack, 
  HStack, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Select,
  Divider,
  Flex,
  SimpleGrid
} from '@chakra-ui/react';

const ContractCard = ({ player, contract, onSave, onCancel, formData, setFormData }) => {
  useEffect(() => {
    const today = new Date();
    setFormData((prev) => ({
      ...prev,
      startDate: prev.startDate || today.toISOString().split('T')[0],
      salaryPerWeek: prev.salaryPerWeek || '1000',
    }));
  }, [setFormData]);

  // Calculate end date based on contract length
  useEffect(() => {
    if (formData.startDate && formData.contractLength) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + parseInt(formData.contractLength));
      
      setFormData({
        ...formData,
        endDate: endDate.toISOString().split('T')[0]
      });
    }
  }, [formData.startDate, formData.contractLength, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (e) => {
    if (e.target.name === 'releaseClause' && formData.releaseClause === 'No Release Clause') {
      setFormData({ ...formData, releaseClause: '' });
    }
  };

  const incrementSalary = () => {
    const currentSalary = parseInt(formData.salaryPerWeek) || 0;
    setFormData({ ...formData, salaryPerWeek: (currentSalary + 1000).toString() });
  };

  const decrementSalary = () => {
    const currentSalary = parseInt(formData.salaryPerWeek) || 0;
    if (currentSalary >= 1000) {
      setFormData({ ...formData, salaryPerWeek: (currentSalary - 1000).toString() });
    }
  };

  // Format the remaining contract to only show years
  const remainingContract = contract 
    ? `Years: ${contract.contractLength || 'undefined'}`
    : 'Years: undefined';
    
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  return (
    <Grid 
      templateColumns="1fr 1fr"
      w="800px"
      bgGradient="linear-gradient(90deg, #1e78bf, #00a38e)"
      borderRadius="md"
      overflow="hidden"
      boxShadow="xl"
      border="2px solid #ccc"
      color="black"
    >
      {/* Left Side - Player Info */}
      <Box position="relative" p={0} borderRight="1px solid #ccc">
        <Box position="absolute" top={2} left={2} zIndex={2}>
          <Image src="../../public/images/logo.png" alt="Club Logo" boxSize="30px" />
        </Box>
        
        <Box p={2} borderBottom="1px solid #ccc">
          <Text fontSize="md" fontWeight="bold" pl={10} color="black">PLAYER INFO</Text>
          <Divider borderColor="red.500" borderWidth="2px" w="100%" mt={1} />
        </Box>
        
        <Box p={4}>
          <Box 
            w="200px"
            h="350px"
            bgImage={'../../../public/images/playercard.png'}
            bgSize="cover"
            bgPosition="center"
            borderRadius="20px"
            overflow="hidden"
            boxShadow="xl"
            transition="transform 0.3s ease"
            _hover={{ transform: 'scale(1.05)' }}
            position="relative"
            mx="auto"
          >
            <Image
              src={player?.profileImage || 'https://via.placeholder.com/200x200'}
              alt={`${player?.name || 'Player'} ${player?.surname || ''}`}
              w="100%"
              h="200px"
              objectFit="cover"
              borderBottom="2px solid rgba(255, 255, 255, 0.5)"
            />
            <Box
              position="absolute"
              top="160px"
              left="10px"
              color="black"
              px={2}
              py={1}
              borderRadius="md"
              fontWeight="bold"
              fontSize="lg"
              textTransform="uppercase"
            >
              {player?.position || 'N/A'}
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="black"
                fontFamily="'Montserrat', sans-serif"
                textShadow="0 0 5px white"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {player?.name || 'Unknown'} {player?.surname || ''}
              </Text>
            </Box>
            <SimpleGrid columns={2} spacing={0} p={7} mt={0}>
              <Box>
                <HStack justifyContent="space-between" px={5} py={0}>
                  <Text fontSize="sm" fontWeight="bold" color="black">M</Text>
                  <Text fontSize="sm" fontWeight="bold" color="black">{player?.matchesPlayed ?? 0}</Text>
                </HStack>
                <HStack justifyContent="space-between" px={5} py={0}>
                  <Text fontSize="sm" fontWeight="bold" color="black">G</Text>
                  <Text fontSize="sm" fontWeight="bold" color="black">{player?.goals ?? 0}</Text>
                </HStack>
                <HStack justifyContent="space-between" px={5} py={0}>
                  <Text fontSize="sm" fontWeight="bold" color="black">A</Text>
                  <Text fontSize="sm" fontWeight="bold" color="black">{player?.assists ?? 0}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack justifyContent="space-between" px={5} py={0}>
                  <Text fontSize="sm" fontWeight="bold" color="black">YC</Text>
                  <Text fontSize="sm" fontWeight="bold" color="black">{player?.yellowCards ?? 0}</Text>
                </HStack>
                <HStack justifyContent="space-between" px={5} py={0}>
                  <Text fontSize="sm" fontWeight="bold" color="black">RC</Text>
                  <Text fontSize="sm" fontWeight="bold" color="black">{player?.redCards ?? 0}</Text>
                </HStack>
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
        
        <Box p={4}>
          <Text fontSize="md" fontWeight="bold" color="black">CURRENT CONTRACT</Text>
          <Grid templateColumns="2fr 1fr" gap={2} mt={2}>
            <Text fontSize="sm" color="black">Remaining Contract:</Text>
            <Text fontSize="sm" textAlign="right" color="black">{remainingContract}</Text>
            <Text fontSize="sm" color="black">Salary (per Week):</Text>
            <Text fontSize="sm" textAlign="right" color="black">£{contract?.salaryPerWeek || '0'}</Text>
            <Text fontSize="sm" color="black">Bonus per Goal:</Text>
            <Text fontSize="sm" textAlign="right" color="black">£{contract?.bonusPerGoal || '0'}</Text>
            <Text fontSize="sm" color="black">Release Clause:</Text>
            <Text fontSize="sm" textAlign="right" color="black">{contract?.releaseClause || 'No Release Clause'}</Text>
            <Text fontSize="sm" color="black">Squad Role:</Text>
            <Text fontSize="sm" textAlign="right" color="black">{contract?.squadRole || 'Do Not Specify'}</Text>
          </Grid>
        </Box>
      </Box>
      
      {/* Right Side - Contract Offer */}
      <Box position="relative" p={0}>
        <Box position="absolute" top={2} left={2} zIndex={2}>
          <Image src="../../public/images/contract.png" alt="Club Logo" boxSize="30px" />
        </Box>
        
        <Box p={2} borderBottom="1px solid #ccc">
          <Text fontSize="md" fontWeight="bold" pl={10} color="black">CONTRACT OFFER</Text>
          <Divider borderColor="red.500" borderWidth="2px" w="100%" mt={1} />
        </Box>
        
        <Box p={4}>
          <Text fontSize="md" fontWeight="bold" mb={2} color="black">PLAYER DEMANDS</Text>
          <Grid templateColumns="2fr 1fr" gap={2}>
            <Text fontSize="sm" color="black">Contract Length:</Text>
            <Text fontSize="sm" textAlign="right" color="black">{formData.contractLength || '0'} Year(s)</Text>
            <Text fontSize="sm" color="black">Salary (Per Week):</Text>
            <Text fontSize="sm" textAlign="right" color="black">£{formData.salaryPerWeek || '0'}</Text>
          </Grid>
          
          <Text fontSize="md" fontWeight="bold" mt={4} mb={2} color="black">OFFERED TERMS</Text>
          
          <VStack spacing={3} align="stretch">
            <FormControl display="flex" alignItems="center">
              <FormLabel fontSize="sm" w="40%" m={0} color="black">Offered Wage (week):</FormLabel>
              <Box bg="white" flex="1" px={2} display="flex" justifyContent="space-between" alignItems="center" borderRadius="md">
                <Box>⏺️</Box>
                <Input
                  name="salaryPerWeek"
                  type="number"
                  value={formData.salaryPerWeek || ''}
                  onChange={handleChange}
                  variant="unstyled"
                  textAlign="right"
                  p={0}
                  size="sm"
                  color="black"
                />
                <HStack spacing={0}>
                  <Button size="xs" variant="ghost" onClick={decrementSalary}>◀</Button>
                  <Button size="xs" variant="ghost" onClick={incrementSalary}>▶</Button>
                </HStack>
              </Box>
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel fontSize="sm" w="40%" m={0} color="black">Bonus Per Goal:</FormLabel>
              <HStack bg="white" flex="1" px={2} borderRadius="md">
                <Input
                  name="bonusPerGoal"
                  type="number"
                  value={formData.bonusPerGoal || '0'}
                  onChange={handleChange}
                  size="sm"
                  textAlign="right"
                  variant="unstyled"
                  color="black"
                />
              </HStack>
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel fontSize="sm" w="40%" m={0} color="black">Release Clause:</FormLabel>
              <Input
                name="releaseClause"
                type="text"
                value={formData.releaseClause}
                onChange={handleChange}
                onFocus={handleFocus}
                size="sm"
                textAlign="right"
                bg="white"
                color="black"
              />
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
            <FormLabel fontSize="sm" w="40%" m={0} color="black">Length:</FormLabel>
            <Select
                name="contractLength"
                value={formData.contractLength || '1'}
                onChange={handleChange}
                size="sm"
                bg="white"
                color="black"
                sx={{
                '& option': {
                    bg: 'white',
                    color: 'black',
                }
                }}
            >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
            </Select>
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel fontSize="sm" w="40%" m={0} color="black">Squad Role:</FormLabel>
              <Select
                name="squadRole"
                value={formData.squadRole || 'Do Not Specify'}
                onChange={handleChange}
                size="sm"
                bg="white"
                color="black"
                sx={{
                    '& option': {
                        bg: 'white',
                        color: 'black',
                    }
                    }}
              >
                <option value="Crucial">Crucial</option>
                <option value="Important">Important</option>
                <option value="Rotation">Rotation</option>
                <option value="Sporadic">Sporadic</option>
                <option value="Do Not Specify">Do Not Specify</option>
              </Select>
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel fontSize="sm" w="40%" m={0} color="black">Start Date:</FormLabel>
              <Input
                name="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={handleChange}
                size="sm"
                bg="white"
                color="black"
              />
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel fontSize="sm" w="40%" m={0} color="black">End Date:</FormLabel>
              <Text fontSize="sm" bg="white" p={2} borderRadius="md" w="full" color="black">
                {formatDate(formData.endDate)}
              </Text>
            </FormControl>
          </VStack>
          
          <Flex justifyContent="flex-end" mt={6}>
            <Button colorScheme="blue" onClick={onSave} size="md">
              SUBMIT OFFER
            </Button>
          </Flex>
          
          <Box mt={4} pt={4} borderTop="1px dashed gray">
            <Flex justifyContent="space-between">
              <Box>
                <Text fontSize="xs" color="black">Chief Executive</Text>
                <Text fontFamily="cursive" fontSize="sm" color="black">____________________</Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="xs" color="black">Manager</Text>
                <Text fontFamily="cursive" fontSize="sm" color="black">____________________</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default ContractCard;