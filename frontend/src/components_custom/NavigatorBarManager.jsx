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
import { FaShoppingCart } from 'react-icons/fa';
import logo from '../../public/images/logo.png';
import { useAuthStore } from '../store/authStore';

const NavigationBarManager = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userData');
    navigate('/');
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  const renderManagerMenu = () => (
    <HStack spacing={8}>
      <Link as={RouterLink} to="/manager-home" fontWeight="bold" color="red.500">
        Manager Home
      </Link>
      <Link as={RouterLink} to="/prepare-squads">Squads</Link>
      <Link as={RouterLink} to="/training-plans">Trainings</Link>
      <Link as={RouterLink} to="/player-stats">Player Stats</Link>
      <Link as={RouterLink} to="/contracts">Contracts</Link>
    </HStack>
  );

  const renderFanMenu = () => (
    <HStack spacing={8}>
      <Link as={RouterLink} to="/" fontWeight="bold" color="red.500">
        Home
      </Link>
      <Link as={RouterLink} to="/about">About</Link>
      <Link as={RouterLink} to="/fixtures">Fixture</Link>
      <Link as={RouterLink} to="/tickets">Tickets</Link>
      <Link as={RouterLink} to="/shop">Shop</Link>
      <Link as={RouterLink} to="/contact">Contact</Link>
      <Link as={RouterLink} to="/cart">
        <HStack>
          <FaShoppingCart size={24} />
          {cartItems.length > 0 && <Text>{cartItems.length}</Text>}
        </HStack>
      </Link>
    </HStack>
  );

  const renderDesktopMenu = () => {
    if (!isAuthenticated) return renderFanMenu();
    switch (user?.role) {
      case 'manager':
        return renderManagerMenu();
      case 'fan':
      default:
        return renderFanMenu();
    }
  };

  const renderMobileMenu = () => {
    if (!isAuthenticated) return renderFanMenuMobile();
    switch (user?.role) {
      case 'manager':
        return renderManagerMenuMobile();
      case 'fan':
      default:
        return renderFanMenuMobile();
    }
  };

  const renderManagerMenuMobile = () => (
    <Flex direction="column" align="start" gap={4}>
      <Link as={RouterLink} to="/manager-home" fontWeight="bold" color="red.500" mb={2}>
        Manager Home
      </Link>
      <Link as={RouterLink} to="/prepare-squads">Squads</Link>
      <Link as={RouterLink} to="/training-plans">Trainings</Link>
      <Link as={RouterLink} to="/player-stats">Player Stats</Link>
      <Link as={RouterLink} to="/contracts">Contracts</Link>
    </Flex>
  );

  const renderFanMenuMobile = () => (
    <Flex direction="column" align="start" gap={4}>
      <Link as={RouterLink} to="/" fontWeight="bold" color="red.500" mb={2}>Home</Link>
      <Link as={RouterLink} to="/about" mb={2}>About</Link>
      <Link as={RouterLink} to="/fixtures" mb={2}>Fixture</Link>
      <Link as={RouterLink} to="/tickets" mb={2}>Tickets</Link>
      <Link as={RouterLink} to="/shop" mb={2}>Shop</Link>
      <Link as={RouterLink} to="/contact" mb={2}>Contact</Link>
      <Link as={RouterLink} to="/cart" mb={2}>Cart</Link>
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
            {renderDesktopMenu()}
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
              {renderMobileMenu()}
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

export default NavigationBarManager;