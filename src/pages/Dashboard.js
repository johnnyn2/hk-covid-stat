import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import {PAGES} from '../constants/constants';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }));
const listButtonStyles = {
    marginBottom: 10,
}
export const Dashboard = (props) => {
    const classes = useStyles();

    const handleChangePage = (currentPage) => {
        props.setCurrentPage((prevState) => ({
            ...prevState,
            currentPage,
        }))
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        marginTop: 30,
                        paddingTop: 0,
                        paddingBottom: 0
                    }}
                >
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.LATEST)}>
                        本港2019冠狀病毒病的最新情況
                    </Button>
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.CASES)}>
                        本港疑似/確診2019冠狀病毒的個案詳情
                    </Button>
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.BUILDINGS)}>
                        過去14天內曾有疑似/確診個案居住過的住宅大廈; 或過去 14 天內曾出現兩宗或以上疑似/確診個案的非住宅大廈
                    </Button>
                    <Button variant="contained" color="default" tyle={listButtonStyles} onClick={() => handleChangePage(PAGES.CONFINEES_BUILDINGS)}>
                        根據香港法例第599C章正在接受強制家居檢疫人士所居住的大廈名單
                    </Button>   
                </div>
            </Container>
        </React.Fragment>
    )
}