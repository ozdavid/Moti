import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useTheme } from "@mui/material";
import { withStyles, WithStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { views } from './consts';
import { Drawer, DrawerHeader } from "./styledComponents";
import { styles } from "./styles";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


interface MenuProps extends WithStyles<typeof styles> {
    user: any;
}

const Menu: FunctionComponent<MenuProps> = props => {
    const { classes, user } = props;
    const router = useRouter();
    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const handleDrawrHeaderClick = () => {
        setOpen(!open)
    }

    const changeRoute = (route: string) => {
        router.push(route)
    };

    return (
        <Drawer
            variant="permanent"
            anchor="right"
            open={open}
            className={classes.root}>
            <DrawerHeader>
                <IconButton onClick={handleDrawrHeaderClick} sx={{color: 'white'}}>
                    {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>

            <Divider />

            <List>
                {views.map(view => (
                    <ListItem key={view.label} disablePadding sx={{color: 'white'}}>
                        <ListItemButton onClick={() => changeRoute(view.route)}>
                            <ListItemIcon sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                {view.icon}
                            </ListItemIcon>
                            {open ? <ListItemText primary={view.label}/> : null}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            {
                open ?
                    <Box className={classes.avatar}>
                        <Avatar>
                            {user?.name?.charAt?.(0)}
                        </Avatar>
                        {user ? <Typography className={classes.username}>{user.name}</Typography> : null}
                    </Box> : null
            }
        </Drawer>
    )
}

export default withStyles(styles)(Menu);