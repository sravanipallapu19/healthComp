

// src/components/Layout/Header.js
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice';

/**
 * App header component with navigation and user controls
 */
const Header = ({ sidebarOpen, onSidebarToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // User data from Redux store
  const { user } = useSelector(state => state.user);
  
  // Menu state
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);
  
  // Handle user menu open
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  // Handle user menu close
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  // Handle notification menu open
  const handleNotificationMenuOpen = (event) => {
    setNotificationMenuAnchor(event.currentTarget);
  };
  
  // Handle notification menu close
  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
    navigate('/login');
  };
  
  // Handle profile navigation
  const handleProfileClick = () => {
    navigate('/profile');
    handleUserMenuClose();
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AppBar 
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left section - Logo and menu button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onSidebarToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Box 
              component="img"
              src="/assets/images/logo.svg"
              alt="Mental Health Companion"
              sx={{ height: 32, mr: 1 }}
            />
            {!isMobile && "Mental Health Companion"}
          </Typography>
        </Box>
        
        {/* Right section - User controls */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Quick action button (mobile only) */}
          {isMobile && (
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              onClick={() => navigate('/chat')}
              sx={{ mr: 1 }}
            >
              Chat
            </Button>
          )}
        
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              onClick={handleNotificationMenuOpen}
              size="large"
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* User avatar */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls="user-menu"
              aria-haspopup="true"
            >
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: user?.avatarColor || 'primary.main'
                }}
                src={user?.avatarUrl || undefined}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* User menu */}
        <Menu
          id="user-menu"
          anchorEl={userMenuAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>
            <PersonIcon sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <SettingsIcon sx={{ mr: 1 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
        
        {/* Notifications menu */}
        <Menu
          id="notification-menu"
          anchorEl={notificationMenuAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationMenuAnchor)}
          onClose={handleNotificationMenuClose}
        >
          <MenuItem onClick={handleNotificationMenuClose}>
            Daily reflection reminder
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            New meditation content available
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            Weekly mood summary ready
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

