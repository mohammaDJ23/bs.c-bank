import { PropsWithChildren, FC, useState, Fragment, useCallback } from 'react';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import NotificationIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { styled } from '@mui/material/styles';
import { getDynamicPath, LocalStorage, Pathes, routes, UserRoles } from '../lib';
import { useAuth, useSelector } from '../hooks';
import { MoreVert } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import ResetStyleWithAnimation from '../components/shared/ResetStyleWithAnimation';

interface StyledListItemTextAttr {
  active: string | undefined;
}

interface StyledListItemIconAttr {
  active: string | undefined;
}

interface NavigationItemObj {
  title: string;
  icon: JSX.Element;
  roles?: UserRoles[];
  path?: Pathes | string;
  onClick: () => void;
}

const AppBar = styled('div')(({ theme }) => ({
  minHeight: '64px',
  width: '100%',
  backgroundColor: '#20a0ff',
  transition: 'all 0.3s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
  [theme.breakpoints.between('xs', 'sm')]: {
    minHeight: '48px',
    '.css-hyum1k-MuiToolbar-root': {
      transition: 'all 0.3s',
      minHeight: '48px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '48px',
    '.css-hyum1k-MuiToolbar-root': {
      transition: 'all 0.3s',
      minHeight: '48px',
    },
  },
}));

const AppBarWrapper = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 15,
  minHeight: '64px',
  width: '100%',
  [theme.breakpoints.between('xs', 'sm')]: {
    minHeight: '48px',
    '.css-hyum1k-MuiToolbar-root': {
      transition: 'all 0.3s',
      minHeight: '48px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '48px',
    '.css-hyum1k-MuiToolbar-root': {
      transition: 'all 0.3s',
      minHeight: '48px',
    },
  },
}));

const ChildrenWrapper = styled('div')(({ theme }) => ({
  transition: 'all 0.3s',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'start',
  padding: '16px 14px 15px 14px',
}));

const StyledListItemText = styled(Typography)<StyledListItemTextAttr>(({ theme, active }) => ({
  color: active ? '#20a0ff' : 'inherit',
}));

const StyledListItemIcon = styled(ListItemIcon)<StyledListItemIconAttr>(({ theme, active }) => ({
  color: active ? '#20a0ff' : 'inherit',
}));

const MoreVertIcon = styled(MoreVert)(({}) => ({
  color: 'white',
}));

interface NavigationImportation extends PropsWithChildren {
  menuOptions?: (string | React.ReactElement)[];
  title?: string | React.ReactElement;
}

const Navigation: FC<NavigationImportation> = ({ children, menuOptions, title }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpened = Boolean(anchorEl);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const navigate = useNavigate();
  const selectors = useSelector();
  const location = useLocation();
  const auth = useAuth();
  const decodedToken = auth.getDecodedToken()!;
  const isUserAuthenticated = auth.isUserAuthenticated();
  const isCurrentOwner = auth.isCurrentOwner();
  const activeRoute = routes.find((route) => matchPath(route.path, location.pathname));
  const activeRouteTitle = activeRoute?.title || 'Bank system';

  const onMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onMenuClick = useCallback(() => {
    return function () {
      onMenuClose();
    };
  }, [onMenuClose]);

  function getNavigationItems() {
    const navigationItems: NavigationItemObj[] = [
      {
        title: `${decodedToken.firstName} ${decodedToken.lastName}`,
        icon: <PersonIcon />,
        path: getDynamicPath(Pathes.USER, { id: decodedToken.id }),
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Dashboard',
        icon: <DashboardIcon />,
        path: Pathes.DASHBOARD,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Create user',
        icon: <PersonAddAlt1Icon />,
        roles: [UserRoles.OWNER],
        path: Pathes.CREATE_USER,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Create bill',
        icon: <AddCardIcon />,
        path: Pathes.CREATE_BILL,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Users',
        icon: <SupervisorAccountIcon />,
        path: Pathes.USERS,
        roles: [UserRoles.OWNER, UserRoles.ADMIN],
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Deleted users',
        icon: <GroupRemoveIcon />,
        path: Pathes.DELETED_USERS,
        roles: [UserRoles.OWNER],
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Bills',
        path: Pathes.BILLS,
        icon: <CreditCardIcon />,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Deleted bills',
        path: Pathes.DELETED_bILLS,
        icon: <LayersClearIcon />,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Receivers',
        path: Pathes.RECEIVERS,
        icon: <CallReceivedIcon />,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Locations',
        path: Pathes.LOCATIONS,
        icon: <LocationOnIcon />,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Consumers',
        path: Pathes.CONSUMERS,
        icon: <AddShoppingCartIcon />,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'All bills',
        path: Pathes.ALL_BILLS,
        icon: <AutoAwesomeMotionIcon />,
        roles: [UserRoles.OWNER],
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Notifications',
        path: Pathes.NOTIFICATIONS,
        icon: <NotificationIcon />,
        roles: [UserRoles.OWNER],
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      },
      {
        title: 'Logout',
        icon: <LogoutIcon />,
        onClick() {
          setIsDrawerOpened(false);
          if (selectors.userServiceSocket.connection) {
            selectors.userServiceSocket.connection.disconnect();
          }
          LocalStorage.clear();
          navigate(Pathes.LOGIN);
        },
      },
    ];

    if (isCurrentOwner) {
      navigationItems.splice(-2, 0, {
        title: 'Conversations',
        path: Pathes.CHAT,
        icon: <ChatIcon />,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      });
    } else {
      navigationItems.splice(-2, 0, {
        title: 'Contact support',
        path: Pathes.CHAT,
        icon: <ChatIcon />,
        onClick() {
          setIsDrawerOpened(false);
          navigate(this.path!);
        },
      });
    }

    return navigationItems;
  }

  const isPathActive = (item: NavigationItemObj) => {
    const isActive = location.pathname === item.path;
    if (isActive) {
      return isActive.toString();
    }
    return undefined;
  };

  return (
    <>
      <AppBarWrapper>
        <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
          <AppBar sx={{ transform: 'translateY(-100%)', transition: 'cubic-bezier(.41,.55,.03,.96) 0.5s' }}>
            <Toolbar
              sx={{
                minHeight: 'inherit',
              }}
            >
              {isUserAuthenticated && (
                <Box mr="20px" overflow="hidden" flexShrink={0}>
                  <ResetStyleWithAnimation sx={{ transform: 'translateX(12px)' }}>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={() => setIsDrawerOpened(true)}
                      edge="start"
                      sx={{
                        width: '100%',
                        minHeight: 'inherit',
                        transform: 'translateX(-100%)',
                        transition: 'cubic-bezier(.41,.55,.03,.96) 0.3s',
                        transitionDelay: '0.2s',
                      }}
                    >
                      <MenuIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </ResetStyleWithAnimation>
                </Box>
              )}

              <Box overflow="hidden" width="100%">
                <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      width: '100%',
                      color: 'white',
                      minHeight: 'inherit',
                      transform: 'translateY(100%)',
                      transition: 'cubic-bezier(.41,.55,.03,.96) 0.3s',
                      transitionDelay: '0.2s',
                    }}
                  >
                    {title || activeRouteTitle}
                  </Typography>
                </ResetStyleWithAnimation>
              </Box>
            </Toolbar>

            {menuOptions && menuOptions.length > 0 && (
              <Box overflow="hidden">
                <ResetStyleWithAnimation sx={{ transform: 'translateX(0)' }}>
                  <Box
                    sx={{
                      minHeight: 'inherit',
                      transform: 'translateX(100%)',
                      transition: 'cubic-bezier(.41,.55,.03,.96) 0.3s',
                    }}
                  >
                    <IconButton onClick={onMenuOpen}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={isMenuOpened} onClick={onMenuClose}>
                      {menuOptions.map((menu, index) => (
                        <MenuItem key={index} onClick={onMenuClick}>
                          {menu}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </ResetStyleWithAnimation>
              </Box>
            )}
          </AppBar>
        </ResetStyleWithAnimation>
      </AppBarWrapper>

      <ChildrenWrapper>{children}</ChildrenWrapper>

      {isUserAuthenticated && (
        <Drawer
          sx={{ zIndex: 20, overflow: 'hidden' }}
          anchor="left"
          open={isDrawerOpened}
          onClose={() => setIsDrawerOpened(false)}
        >
          <Box sx={{ width: 250 }} role="presentation">
            <DrawerHeader>
              <CloseIcon onClick={() => setIsDrawerOpened(false)} />
            </DrawerHeader>

            <Divider />

            <List sx={{ overflow: 'hidden' }}>
              {getNavigationItems().map((item, index) => {
                const navigationEl = (
                  <ResetStyleWithAnimation sx={{ opacity: '1', transform: 'translateX(0)' }}>
                    <Box
                      sx={{
                        opacity: '0',
                        transform: 'translateX(-20px)',
                        transition: 'cubic-bezier(.41,.55,.03,.96) 0.3s',
                        transitionDelay: `${index * 0.01}s`,
                      }}
                    >
                      <ListItem onClick={() => item.onClick.call(item)} key={index} disablePadding>
                        <ListItemButton>
                          <StyledListItemIcon active={isPathActive(item)}>{item.icon}</StyledListItemIcon>
                          <Box
                            component="div"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              width: '10rem',
                              maxWidth: '10rem',
                            }}
                          >
                            <StyledListItemText fontSize="1rem" marginY="4px" noWrap active={isPathActive(item)}>
                              {item.title}
                            </StyledListItemText>
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    </Box>
                  </ResetStyleWithAnimation>
                );

                return !item.roles ? (
                  navigationEl
                ) : item.roles.includes(decodedToken.role) ? (
                  navigationEl
                ) : (
                  <Fragment key={index}></Fragment>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Navigation;
