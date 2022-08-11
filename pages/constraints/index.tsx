import ClearIcon from '@mui/icons-material/Clear';
import { Box, Card } from "@mui/material";
import { Component } from "react";
import styles from '../../styles/prefrences.module.css';

export default class PrefrencesPage extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { date: new Date().toDateString(), rank: -1, reason: "From DB" };
    }

    render() {
        const PrefrenceCard = () => {
            return <Card>
                <Box className={styles.root}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                        <div>
                            <p>
                                <b>{this.state.date}</b>
                                <br />
                                אעדיף שלא לשמור ביום הזה
                                <br />
                                עדיפות: {this.state.rank}
                            </p>
                            <p style={{ color: '#555B6E' }}>{this.state.reason}</p>
                        </div>
                        <div style={{ flexGrow: 4, display: 'flex', flexDirection: "column" }}>
                            <ClearIcon style={{ color: '#555B6E', alignSelf: 'end' }} />
                        </div>
                        <div style={{ flexGrow: 1 }}>

                        </div>
                    </div>
                </Box>
            </Card>;
        };

        return <div style={{}}>
            <PrefrenceCard></PrefrenceCard>;
        </div>;
    }
};

interface Props {

}

interface State {
    rank: number;
    reason: string;
    date: string;
}

