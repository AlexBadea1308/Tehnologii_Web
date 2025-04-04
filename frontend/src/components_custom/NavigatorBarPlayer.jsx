import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  Image,
  Link,
  useColorMode,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../../public/images/logo.png';
import { useAuthStore } from '../store/authStore';

const NavigationBarPlayer = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'player') {
      navigate('/login'); // Redirectioneaza daca nu e player
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userData');
    navigate('/');
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  const renderPlayerMenu = () => (
    <HStack spacing={8}>
      <Link as={RouterLink} to="/player-home" fontWeight="bold" color="red.500">
        Player Home
      </Link>
      <Link as={RouterLink} to="/view-contract">View Contract</Link>
      <Link as={RouterLink} to="/schedule">Daily Schedule</Link>
      <Link as={RouterLink} to="/position-fixxtures">Fixtures</Link>
    </HStack>
  );

  const renderPlayerMenuMobile = () => (
    <Flex direction="column" align="start" gap={4}>
      <Link as={RouterLink} to="/player-home" fontWeight="bold" color="red.500" mb={2}>
        Player Home
      </Link>
      <Link as={RouterLink} to="/view-contract" mb={2}>View Contract</Link>
      <Link as={RouterLink} to="/schedule" mb={2}>Daily Schedule</Link>
      <Link as={RouterLink} to="/position-fixxtures" mb={2}>Fixtures</Link>
    </Flex>
  );

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} py={3} px={4} boxShadow="sm" sx={{ outline: 'none', userSelect: 'none' }}>
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Logo */}
        <Box>
          <Image src={logo} alt="Logo" h="80px" />
        </Box>

        {/* Mobile Drawer button */}
        {isMobile ? (
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            onClick={() => setIsDrawerOpen(true)}
            variant="ghost"
            size="lg"
          />
        ) : (
          // Desktop navigation items
          <HStack spacing={8}>
            {isAuthenticated && user?.role === 'player' && renderPlayerMenu()}
            {isAuthenticated && (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" size="lg">
                  <HStack>
                    <Avatar size="xs" name={user?.username || ""} src={user?.profileImage || ""} />
                    <Text>{user?.username || "User"}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/account">My Account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
            {!isAuthenticated && (
              <>
                <Link as={RouterLink} to="/login">Login</Link>
                <Link as={RouterLink} to="/register">Register</Link>
              </>
            )}
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              size="sm"
              variant="ghost"
            />
          </HStack>
        )}
      </Flex>

      {/* Drawer for Mobile */}
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={() => setIsDrawerOpen(false)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Meniu</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" align="start" gap={4}>
              {isAuthenticated && (
                <Box mb={4}>
                  <HStack mb={2}>
                    <Avatar size="sm" name={user?.username || ""} src={user?.profileImage || ""} />
                    <Text>{user?.username || "User"}</Text>
                  </HStack>
                  <Link as={RouterLink} to="/account" display="block" mb={1}>My Account</Link>
                  <Link as="button" onClick={handleLogout} display="block">Logout</Link>
                </Box>
              )}
              {!isAuthenticated && (
                <Box mb={4}>
                  <Link as={RouterLink} to="/login" display="block" mb={2}>Login</Link>
                  <Link as={RouterLink} to="/register" display="block">Register</Link>
                </Box>
              )}
              {isAuthenticated && user?.role === 'player' && renderPlayerMenuMobile()}
            </Flex>
          </DrawerBody>
          <Box position="absolute" bottom="16px" right="16px">
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              size="sm"
              variant="ghost"
            />
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default NavigationBarPlayer;