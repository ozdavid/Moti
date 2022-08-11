import { createStyles } from "@mui/styles";
import { CSSObject, Theme } from '@mui/material';

export const styles = (theme: Theme) => createStyles({
  root: {
    height: '100%',
    position: 'relative',
  },

  avatar: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    bottom: '20px',
    position: 'fixed',
  },

  username: {
    paddingRight: '5px',
    color: 'white'
  }
});

export const drawerWidth = 240;

export const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#89B0AE'
});

export const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: '#89B0AE'
});