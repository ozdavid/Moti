import { createStyles } from "@mui/styles";
import { Theme } from '@mui/material';

export const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
    },

    main: {
        padding: '2%',
        flexGrow: 1,
    },
});