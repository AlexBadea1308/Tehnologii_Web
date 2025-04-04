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
import { useToast } from '@chakra-ui/react';
import { useCartStore } from '../store/cartStore.js';

const NavigationBarFan = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const toast = useToast();
  const { clearCartInMemory } = useCartStore();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleLogout = () => {
    logout();
    clearCartInMemory(); 
    localStorage.removeItem('userData'); 
  
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  
    navigate('/');
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} py={3} px={4} boxShadow="sm" sx={{ outline: 'none', userSelect: 'none' }}>
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Logo space (left side) */}
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
            <Link as={RouterLink} to="/" fontWeight="bold" color="red.500">
              Home
            </Link>
            <Link as={RouterLink} to="/about">About</Link>
            <Link as={RouterLink} to="/fixture">Fixture</Link>
            <Link as={RouterLink} to="/tickets">Tickets</Link>
            <Link as={RouterLink} to="/shop">Shop</Link>
            <Link as={RouterLink} to="/contact">Contact</Link>
            
            {/* Cart icon */}
            <Link as={RouterLink} to="/cart">
              <HStack>
                <FaShoppingCart size={24} />
                {/* Display the number of items in cart */}
                {cartItems.length > 0 && <Text>{cartItems.length}</Text>}
              </HStack>
            </Link>

            {isAuthenticated ? (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" size="lg">
                  <HStack>
                    <Avatar size="xs" name={user?.username || ""} src={user?.profileImage || ""} />
                    <Text>{user?.username || "User"}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/account">My Account</MenuItem>
                  <MenuItem as={RouterLink} to="/orders-history">Order History</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
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
              {isAuthenticated ? (
                <Box mb={4}>
                  <HStack mb={2}>
                    <Avatar size="sm" name={user?.username || ""} src={user?.profileImage || ""} />
                    <Text>{user?.username || "User"}</Text>
                  </HStack>
                  <Link as={RouterLink} to="/account" display="block" mb={1}>My Account</Link>
                  <Link as={RouterLink} to="/orders-history" display="block" mb={1}>Order History</Link>
                  <Link as="button" onClick={handleLogout} display="block">Logout</Link>
                </Box>
              ) : (
                <Box mb={4}>
                  <Link as={RouterLink} to="/login" display="block" mb={2}>Login</Link>
                  <Link as={RouterLink} to="/register" display="block">Register</Link>
                </Box>
              )}
              <Link as={RouterLink} to="/" fontWeight="bold" color="red.500" mb={2}>Home</Link>
              <Link as={RouterLink} to="/about" mb={2}>About</Link>
              <Link as={RouterLink} to="/fixture" mb={2}>Fixture</Link>
              <Link as={RouterLink} to="/tickets" mb={2}>Tickets</Link>
              <Link as={RouterLink} to="/shop" mb={2}>Shop</Link>
              <Link as={RouterLink} to="/contact" mb={2}>Contact</Link>
              <Link as={RouterLink} to="/cart" mb={2}>Cart</Link>
            </Flex>
          </DrawerBody>

          {/* Button to change theme in the bottom right corner */}
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

export default NavigationBarFan;