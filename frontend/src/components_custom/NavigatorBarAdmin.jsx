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

const NavigationBarAdmin = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const renderAdminMenu = () => (
    <HStack spacing={8}>
        <Link as={RouterLink} to="/admin-home" fontWeight="bold" color="purple.500">
        Home Page
      </Link>
      <Link as={RouterLink} to="/admin/users"> Users</Link>
      <Link as={RouterLink} to="/admin/tickets"> Tickets</Link>
      <Link as={RouterLink} to="/admin/products"> Products</Link>
      <Link as={RouterLink} to="/admin/matches"> Matches</Link>
      <Link as={RouterLink} to="/admin/players-stats"> PlayerStats</Link>
      <Link as={RouterLink} to="/admin/order-statistics">Statistics</Link>
      <Link as={RouterLink} to="/admin/manage-orders">Orders</Link>
    </HStack>
  );

  const renderAdminMenuMobile = () => (
    <Flex direction="column" align="start" gap={4}>
          <Link as={RouterLink} to="/admin-home" fontWeight="bold" color="purple.500">
        Home Page
      </Link>
      <Link as={RouterLink} to="/admin/users">  Users</Link>
      <Link as={RouterLink} to="/admin/tickets" mb={2}>Tickets</Link>
      <Link as={RouterLink} to="/admin/products" mb={2}>Products</Link>
      <Link as={RouterLink} to="/admin/matches" mb={2}>Matches</Link>
      <Link as={RouterLink} to="/admin/players-stats" mb={2}>PlayerStats</Link>
      <Link as={RouterLink} to="/admin/order-statistics" mb={2}>Statistics</Link>
      <Link as={RouterLink} to="/admin/manage-orders" mb={2}>Orders</Link>
    </Flex>
  );

  const renderDesktopMenu = () => {
    if (!isAuthenticated || user?.role !== 'admin') return null;
    return renderAdminMenu();
  };

  const renderMobileMenu = () => {
    if (!isAuthenticated || user?.role !== 'admin') return null;
    return renderAdminMenuMobile();
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

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
                    <Avatar size="xs" name={user?.username || ''} src={user?.profileImage || ''} />
                    <Text>{user?.username || 'Admin'}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/account">My Account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
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
          <DrawerHeader>Admin Menu</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" align="start" gap={4}>
              {isAuthenticated && (
                <Box mb={4}>
                  <HStack mb={2}>
                    <Avatar size="sm" name={user?.username || ''} src={user?.profileImage || ''} />
                    <Text>{user?.username || 'Admin'}</Text>
                  </HStack>
                  <Link as={RouterLink} to="/account" display="block" mb={1}>My Account</Link>
                  <Link as="button" onClick={handleLogout} display="block">Logout</Link>
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

export default NavigationBarAdmin;