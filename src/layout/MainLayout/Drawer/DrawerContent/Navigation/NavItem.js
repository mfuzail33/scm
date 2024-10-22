import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';

// project-imports
import useConfig from 'hooks/useConfig';
import { dispatch, useSelector } from 'store';
import { activeItem, openDrawer } from 'store/reducers/menu';
import { MenuOrientation, ThemeMode } from 'config';

// ==============================|| NAVIGATION - ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { drawerOpen, openItem } = useSelector((state) => state.menu);
  const { menuOrientation } = useConfig();

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const isSelected = openItem.findIndex((id) => id === item.id) > -1;

  const activeTextColor = theme.palette.primary.active;
  const nonActiveTextColor = theme.palette.primary.nonActive;

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon variant="Bulk" color={nonActiveTextColor} size={drawerOpen ? 20 : 22} /> : false;

  const { pathname } = useLocation();

  // active menu item on page load
  useEffect(() => {
    if (pathname && pathname.includes('product-details')) {
      if (item.url && item.url.includes('product-details')) {
        dispatch(activeItem({ openItem: [item.id] }));
      }
    }

    if (pathname && pathname.includes('kanban')) {
      if (item.url && item.url.includes('kanban')) {
        dispatch(activeItem({ openItem: [item.id] }));
      }
    }

    if (pathname === item.url) {
      dispatch(activeItem({ openItem: [item.id] }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  const textColor = theme.palette.mode === ThemeMode.DARK ? 'secondary.400' : 'secondary.main';
  const iconSelectedColor = 'primary.main';

  return (
    <>
      {menuOrientation === MenuOrientation.VERTICAL || downLG ? (
        <ListItemButton
          component={Link}
          to={item.url}
          target={itemTarget}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            pl: drawerOpen ? `${level * 20}px` : 1.5,
            py: !drawerOpen && level === 1 ? 1.25 : 1,
            ...(drawerOpen && {
              '&:hover': {
                bgcolor: '#3C4656'
              },
              '&.Mui-selected': {
                '&:hover': {
                  bgcolor: '#3C4656'
                },
                bgcolor: '#3C4656'
              }
            }),
            ...(drawerOpen &&
              level === 1 && {
              mx: 1.25,
              my: 0.5,
              borderRadius: 1,
              '&:hover': {
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : '#3C4656'
              },
              '&.Mui-selected': {
                color: iconSelectedColor,
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : '#3C4656',
                '&:hover': {
                  color: "#3C4656",
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : '#3C4656',
                }
              }
            }),
            ...(!drawerOpen && {
              px: 2.75,
              '&:hover': {
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : '#3C4656'
              },
              '&.Mui-selected': {
                color: iconSelectedColor,
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : '#3C4656',
                '&:hover': {
                  color: "#3C4656",
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : '#3C4656',
                }
              }
            })
          }}
          {...(downLG && {
            onClick: () => dispatch(openDrawer(false))
          })}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: isSelected ? activeTextColor : nonActiveTextColor,
                ...(!drawerOpen &&
                  level === 1 && {
                  borderRadius: 1,
                  width: 46,
                  height: 46,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : '#3C4656'
                  }
                }),
                ...(!drawerOpen &&
                  isSelected && {
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.100' : 'none',
                  '&:hover': {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.200' : 'none'
                  }
                })
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}

          {(drawerOpen || (!drawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Typography variant="h6"
                  sx={{
                    color: isSelected ? activeTextColor : nonActiveTextColor,
                    fontWeight: isSelected ? 500 : 400,
                  }}>
                  {item.title}
                </Typography>
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      ) : (
        <ListItemButton
          component={Link}
          to={item.url}
          target={itemTarget}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            ...(drawerOpen && {
              '&:hover': {
                bgcolor: 'transparent'
              },
              '&.Mui-selected': {
                bgcolor: 'transparent',
                color: iconSelectedColor,
                '&:hover': {
                  color: iconSelectedColor,
                  bgcolor: 'transparent'
                }
              }
            }),
            ...(!drawerOpen && {
              '&:hover': {
                bgcolor: 'transparent'
              },
              '&.Mui-selected': {
                '&:hover': {
                  bgcolor: 'transparent'
                },
                bgcolor: 'transparent'
              }
            })
          }}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 36,
                ...(!drawerOpen && {
                  borderRadius: 1,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    bgcolor: 'transparent'
                  }
                }),
                ...(!drawerOpen &&
                  isSelected && {
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: 'transparent'
                  }
                })
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}

          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor, fontWeight: isSelected ? 500 : 400 }}>
                {item.title}
              </Typography>
            }
          />
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
              sx={{ ml: 1 }}
            />
          )}
        </ListItemButton>
      )}
    </>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
