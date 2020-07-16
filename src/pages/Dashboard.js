import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import {PAGES} from '../constants/constants';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {createMuiTheme, createStyles} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';



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
                        {props.lang === 'cn' ? '本港2019冠狀病毒病的最新情況' : 'Latest situation of reported cases of COVID-19 in Hong Kong'}
                    </Button>
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.CASES)}>
                        {props.lang === 'cn' ? '本港疑似/確診2019冠狀病毒的個案詳情' : 'Details of probable/confirmed cases of COVID-19 infection in Hong Kong'}
                    </Button>
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.BUILDINGS)}>
                        {props.lang === 'cn' ? '過去14天內曾有疑似/確診個案居住過的住宅大廈; 或過去 14 天內曾出現兩宗或以上疑似/確診個案的非住宅大廈' : 'Residential buildings in which probable/confirmed cases have resided in the past 14 days or non-residential building with 2 or more probable/confirmed cases in the past 14 days'}
                    </Button>
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.CONFINEES_BUILDINGS)}>
                        {props.lang === 'cn' ? '根據香港法例第599C章正在接受強制家居檢疫人士所居住的大廈名單' : 'List of buildings of the home confinees under mandatory home quarantine according to Cap. 599C of Hong Kong Laws'}
                    </Button>
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.FLIGHT_TRAINS)}>
                        {props.lang === 'cn' ? '過去14天內曾有疑似/確診2019冠狀病毒病個案在出現病徵期間乘搭過的航班/火車/船/車名單' : 'List of flights/trains/ships/cars taken by probable/confirmed cases of COVID-19 during the symptomatic phase in the past 14 days'}
                    </Button>
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.COLLECTION_POINTS)}>
                        {props.lang === 'cn' ? '供私家醫生病人送交樣本作2019冠狀病毒病病毒測試的收集點' : 'Collection points for submission of specimens by patients of private doctors for COVID-19 testing'}
                    </Button>
                    <Button variant="contained" color="default" style={listButtonStyles} onClick={() => handleChangePage(PAGES.GUARANTINE_ORDERS)}>
                        {props.lang === 'cn' ? '根據《若干到港人士強制檢疫規例》（第599C章）新發出強制檢疫令的統計資料' : 'Statistics of newly issued quarantine orders under the Compulsory Quarantine of Certain Persons Arriving at Hong Kong Regulation (Cap. 599C)'}
                    </Button>
                    <div style={{ marginTop: 20, textAlign: 'right' }}>{props.lang === 'cn' ? '本程式最後更新時間' : 'Application Last Updated Time'}：16/07/2020 12:12</div>
                    <ToggleButtonGroup
                        value={props.lang}
                        exclusive
                        onChange={(event, lang) => { if (lang !== null) props.setLang(prevState => ({...prevState, lang,}))}}
                        aria-label="text alignment"
                        style={{alignSelf: 'flex-end'}}
                    >
                        <ToggleButton value="cn" aria-label="left" >
                            中文
                        </ToggleButton>
                        <ToggleButton value="en" aria-label="right" >
                            ENG
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </Container>
        </React.Fragment>
    )
}