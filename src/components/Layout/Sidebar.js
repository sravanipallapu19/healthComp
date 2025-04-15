// src/components/Layout/Sidebar.js
import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Divider,
  Typography,
  Tooltip,
  Badge
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useSelector } from 'react-redux';

// Navigation items configuration
const mainNavItems = [
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    icon: <DashboardIcon /> 
  },
  { 
    path: '/chat', 
    name: 'Chat Companion', 
    icon: <ChatIcon />,
    badge: 1
  },
  { 
    path: '/journal', 
    name: 'Journal', 
    icon: <MenuBookIcon /> 
  },
  { 
    path: '/resources', 
    name: 'Resources', 
    icon: <LocalLibraryIcon />,
    badge: 3
  },
];

const toolsNavItems = [
  { 
    path: '/meditation', 
    name: 'Meditation', 
    icon: <SelfImprovementIcon /> 
  },
  { 
    path: '/sleep', 
    name: 'Sleep Sounds', 
    icon: <NightlightIcon /> 
  },
  { 
    path: '/progress', 
    name: 'Progress', 
    icon: <BarChartIcon /> 
  },
];

const bottomNavItems = [
  { 
    path: '/profile', 
    name: 'Profile', 
    icon: <AccountCircleIcon /> 
  },
];

/**
 * Sidebar component with main app navigation
 */
const Sidebar = ({ open, onClose, variant = 'permanent' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadMessages } = useSelector(state => state.chat);
  
  // Check if a route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  // Render nav items
  const renderNavItems = (items) => {
    return items.map((item) => (
      <ListItem
        button
        key={item.path}
        onClick={() => handleNavigation(item.path)}
        selected={isActiveRoute(item.path)}
        sx={{
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          '&.Mui-selected': {
            backgroundColor: 'primary.light',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light',
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.main',
            }
          }
        }}
      >
        <Tooltip title={item.name} placement="right" arrow>
          <ListItemIcon>
            {item.badge ? (
              <Badge 
                badgeContent={item.path === '/chat' ? unreadMessages : item.badge} 
                color="error"
              >
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )}
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary={item.name} />
      </ListItem>
    ));
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 8 }}>
      {/* Main navigation */}
      <List component="nav" sx={{ px: 1 }}>
        {renderNavItems(mainNavItems)}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Section title */}
      <Typography 
        variant="overline" 
        sx={{ px: 3, color: 'text.secondary', fontWeight: 500 }}
      >
        Tools
      </Typography>
      
      {/* Tools navigation */}
      <List component="nav" sx={{ px: 1 }}>
        {renderNavItems(toolsNavItems)}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Bottom navigation */}
      <List component="nav" sx={{ px: 1 }}>
        {renderNavItems(bottomNavItems)}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: theme => theme.spacing(30),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: theme => theme.spacing(30),
          boxSizing: 'border-box',
          border: 'none',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;