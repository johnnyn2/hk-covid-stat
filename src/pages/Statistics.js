import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import loadingGif from '../img/loading.gif';
import {STAT_URLS, STAT_TITLE} from '../constants/constants';
import {csv} from 'd3-fetch';
import latest from '../csv/latest_situation_of_reported_cases_covid_19_chi.csv';
import cases from '../csv/enhanced_sur_covid_19_chi.csv';
import buildings from '../csv/building_list_chi.csv';
import confiness from '../csv/home_confinees_tier2_building_list.csv';
import collections from '../csv/list_of_collection_points_chi.csv';
import flight from '../csv/flights_trains_list_chi.csv';
import orders from '../csv/newly_issued_quarantine_orders_cap599c.csv';

import latest_eng from '../csv/latest_situation_of_reported_cases_covid_19_eng.csv';
import cases_eng from '../csv/enhanced_sur_covid_19_eng.csv';
import buildings_eng from '../csv/building_list_eng.csv';
import collections_eng from '../csv/list_of_collection_points_eng.csv';
import flight_eng from '../csv/flights_trains_list_eng.csv';

import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Check from '@material-ui/icons/Check'
import FilterList from '@material-ui/icons/FilterList'
import Remove from '@material-ui/icons/Remove'
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Sort from '@material-ui/icons/Sort';

import MaterialTable from 'material-table';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { TextField, InputAdornment, IconButton, Typography } from '@material-ui/core';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    root: {
      transform: 'translateZ(0px)',
      flexGrow: 1,
    },
    exampleWrapper: {
      position: 'relative',
      marginTop: theme.spacing(3),
      height: 380,
    },
    radioGroup: {
      margin: theme.spacing(1, 0),
    },
    speedDial: {
      position: 'absolute',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
      },
    },
}));

export const Statisitcs = (props) => {
    const initState = {
        columns: null,
        data: null,
        title: '',
        searchKey: '',
        filteredData: null,
    }
    const initSortingState = {}
    const initSnackState = {
        open: false,
        severity: "info",
        message: ""
    }
    const [isLoading, setIsLoading] = useState(false);
    const [snackState, setSnackState] = useState(initSnackState);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [state, setState] = useState(initState);
    const [sortingState, setSortingState] = useState(initSortingState);
    const [noOfDataTag, setTag] = useState(''); 
    const classes = useStyles();
    const setOpenSnack = (open) => {
        setSnackState((prevSnack) => ({...prevSnack, open,}))
    }
    useEffect(() => {
        let url = '';
        let title = '';
        switch(props.url) {
            case STAT_URLS.LATEST: url = props.lang === 'cn' ? latest : latest_eng; title = STAT_TITLE.LATEST; break;
            case STAT_URLS.CASES: url = props.lang === 'cn' ? cases : cases_eng; title = STAT_TITLE.CASES; break;
            case STAT_URLS.BUILDINGS: url = props.lang === 'cn' ? buildings : buildings_eng; title = STAT_TITLE.BUILDINGS; break;
            case STAT_URLS.CONFINEES_BUILDINGS: url = confiness; title = STAT_TITLE.CONFINEES_BUILDINGS; break;
            case STAT_URLS.COLLECTION_POINTS: url = props.lang === 'cn' ? collections : collections_eng; title = STAT_TITLE.COLLECTION_POINTS; break;
            case STAT_URLS.FLIGHT_TRAINS: url = props.lang === 'cn' ? flight: flight_eng; title = STAT_TITLE.FLIGHT_TRAINS; break;
            case STAT_URLS.GUARANTINE_ORDERS: url = orders; title = STAT_TITLE.GUARANTINE_ORDERS; break;
        }
        setIsLoading(true);
        setSnackState((prevSnack) => ({...prevSnack, open: true, severity: 'info', message: props.lang === 'cn' ? '加載中...' : 'Loading...'}))
        csv(url).then(csvData => {
            const data = csvData.filter((row, i) => i !== csvData.length-1);
            const columns = csvData.columns.map(col => ({title: col, field: col}));
            let hasDate = false;
            let dataSortByDate = {};
            for (let i=0;i<csvData.columns.length;i++) {
                if (csvData.columns[i].includes(props.lang === 'cn' ? '日期' : 'date') || csvData.columns[i].includes('Date')) {
                    dataSortByDate = data.sort((a,b) => compareDate(a, b, csvData.columns[i], 'ASC'));
                    hasDate = true;
                    break;
                }
            }
            if (url.includes("enhanced")) {
                dataSortByDate = data.sort((a,b) => b[props.lang ==='cn' ? '個案編號' : 'Case no.'] - a[props.lang === 'cn' ? '個案編號' : 'Case no.'])
            }
            if (hasDate) {
                setState((prevState) => ({...prevState, data: dataSortByDate, columns, title, filteredData: dataSortByDate,}));
            } else {
                setState((prevState) => ({...prevState, data, columns, title, filteredData: data,}));
            }
            
            const sortingState = {};
            Object.keys(csvData.columns).forEach(column => {
                sortingState[columns[column].title] = columns[column].title.includes(props.lang === 'cn' ? '日期' : 'date') ||
                    columns[column].title.includes(props.lang === 'cn' ? '個案編號' : 'Case no.') || columns[column].title.includes('Date') ? 'DES' : 'ASC';
            });
            setSortingState(sortingState);
            setTag(props.lang === 'cn' ? `共${csvData.length - 1}項資料` : `${csvData.length - 1} data in total`);
            setIsLoading(false);
            setSnackState((prevSnack) => ({...prevSnack, severity: 'success', message: props.lang === 'cn' ? '完成' : 'Done'}))
        })
    },[])

    const handleSearch = () => {
        setSnackState({
            open: true,
            severity: "into",
            message: props.lang === 'cn' ? "處理中" : "Processing",
        })
        const {searchKey} = state;
        if (searchKey === "") {
            handleReset();
            setTag(props.lang === 'cn' ? `共${state.filteredData.length}項資料` : `${state.filteredData.length} data in total`);
            setSnackState({
                open: true,
                severity: "success",
                message: props.lang === 'cn' ? "完成" : "Done"
            })
            return;
        };
        const searchResult = state.data.filter(row => {
            const keys = Object.keys(row);
            if (keys.includes(searchKey)) return true;
            let contains = false;

            const matchedKeys = keys.filter(key => {
                return row[key].includes(searchKey);
            });
            return matchedKeys.length > 0;
        })
        setState((prevState) => ({...prevState, filteredData: searchResult,}));
        setTag(props.lang === 'cn' ? `共${state.data.length}項資料，${searchResult.length}個結果。` : `${state.data.length} data in total. ${searchResult.length} search result(s).`);
        setSnackState({
            open: true,
            severity: "success",
            message: props.lang === 'cn' ? "完成" : "Done"
        })
    }

    const handleReset = () => {
        setState((prevState) => ({...prevState, searchKey: '', filteredData: state.data}));
        setTag(props.lang === 'cn' ? `共${state.data.length}項資料` : `${state.data.length} data in total`)
    }

    const handleInput = (e) => {
        const searchKey = e.target.value;
        setState((prevState) => ({...prevState, searchKey,}))
    }

    const handleGotoTop = () => {
        window.scrollTo({top: 0});
    }

    const handleGotoBottom = () => {
        window.scrollTo(0,document.body.scrollHeight);
    }

    const compareDate = (a,b, column, sort) => {
        const aTimestamps = a[column].split('/');
        const bTimestamps = b[column].split('/');
        const aTime = new Date();
        aTime.setDate(aTimestamps[0]);
        aTime.setMonth(aTimestamps[1]);
        aTime.setFullYear(aTimestamps[2]);
        const bTime = new Date();
        bTime.setDate(bTimestamps[0]);
        bTime.setMonth(bTimestamps[1]);
        bTime.setFullYear(bTimestamps[2]);
        return sort === 'ASC' ? bTime.getTime() - aTime.getTime() : aTime.getTime() - bTime.getTime();
    }

    const letterSort = (lang, letters) => {
        letters.sort(new Intl.Collator(lang).compare);
        return letters;
      }

    const handleSort = (column) => {
        handleCloseMenu();
        if (sortingState[column] === 'ASC') {
            let sortedData = [];
            if (column.includes(props.lang === 'cn' ? '日期' : 'date') || column.includes('Date')) {
                sortedData = state.filteredData.sort((a,b) => compareDate(a, b, column, 'ASC'))
            } else if (/^\d+$/.test(state.filteredData[0][column])) {
                sortedData = state.filteredData.sort((a,b) => b[column] - a[column]);
            } else {
                // sortedData = state.filteredData.sort((a,b) => b[column] - a[column]);
                sortedData = state.filteredData.sort((a,b) => new Intl.Collator(props.lang).compare(b[column], a[column]));
            }
            setState((prevState) => ({...prevState, filteredData: sortedData}));
            const newSortingState = {...sortingState};
            Object.keys(newSortingState).forEach((key) => {
                if (new Intl.Collator(props.lang).compare(key, column) === 0) {
                    newSortingState[key] = 'DES';
                }
            })
            setSortingState(newSortingState)
        } else {
            let sortedData = [];
            if (column.includes(props.lang === 'cn' ? '日期' : 'date') || column.includes('Date')) {
                sortedData = state.filteredData.sort((a,b) => compareDate(a, b, column, 'DES'))
            } else if (/^\d+$/.test(state.filteredData[0][column])) {
                sortedData = state.filteredData.sort((a,b) => a[column] - b[column]); 
            } else {
                // sortedData = state.filteredData.sort((a,b) => a[column] - b[column]); 
                sortedData = state.filteredData.sort((a,b) => new Intl.Collator(props.lang).compare(a[column], b[column]));
            }
            setState((prevState) => ({...prevState, filteredData: sortedData}));
            const newSortingState = {...sortingState};
            Object.keys(newSortingState).forEach((key) => {
                if (new Intl.Collator(props.lang).compare(key, column) === 0) {
                    newSortingState[key] = 'ASC';
                }
            })
            setSortingState(newSortingState)
        }
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    let result = <span/>;
    if (state.data !== null && state.col !== null) {
        result = (
            <MaterialTable
                title={<div style={{ display: 'flex' }}>{state.title}</div>}
                columns={state.columns}
                data={state.data}
                localization={{
                    pagination: {
                        previousTooltip: '上一頁',
                        previousAriaLabel: '上一頁',
                        nextTooltip: '下一頁',
                        nextAriaLabel: '下一頁',
                        lastTooltip: '最後一頁',
                        lastAriaLabel: '最後一頁',
                        firstTooltip: '第一頁',
                        firstAriaLabel: '第一頁',
                        labelRowsSelect: '行',
                        labelRowsPerPage: '行/頁'
                    },
                    toolbar: {
                        searchTooltip: '搜尋',
                        searchPlaceholder: '搜尋'
                    },

                }}
                icons={{
                    Check: Check,
                    DetailPanel: ChevronRight,
                    Export: SaveAlt,
                    Filter: FilterList,
                    FirstPage: FirstPage,
                    LastPage: LastPage,
                    NextPage: ChevronRight,
                    PreviousPage: ChevronLeft,
                    Search: Search,
                    ThirdStateCheck: Remove,
                    ViewColumn: ViewColumn,
                    ResetSearch: Clear,
                    SortArrow: ArrowDownward
                }}
            />
        );
    }
    if (state.filteredData !== null && state.columns !== null) {
        result = state.filteredData.map((row, idx) => {
            const keys = Object.keys(row);
            const tableContent = keys.map(k => <tr><td style={{minWidth: 50}}>{k}</td><td>{row[k]}</td></tr>)
            return (
            <div key={idx} style={{backgroundColor: 'white', color: 'rgba(0, 0, 0, 0.87)', borderRadius: '10px', border: '1px solid #E7E7E7', margin: 10}}>
                <table style={{width: 300, textAlign: 'left', padding: 30}}>
                    <tbody>{tableContent}</tbody>
                </table>
            </div>
        )})
    }

    const actions = [
        { icon: <ArrowDownward />, name: props.lang === 'cn' ? '最下' : 'Lowest', action: (e) => handleGotoBottom()},
        { icon: <ArrowUpward />, name: props.lang=== 'cn' ? '最上' : 'Uppest', action: (e) => handleGotoTop()},
        { icon: <Sort />, name: props.lang==='cn' ? '排序' : 'Sort', action: (e) => setAnchorEl(e.currentTarget)},
    ];
    let title = '';
    switch(props.url) {
        case STAT_URLS.BUILDINGS: title = props.lang === 'cn' ? STAT_TITLE.CN.BUILDINGS : STAT_TITLE.EN.BUILDINGS; break;
        case STAT_URLS.CASES: title = props.lang === 'cn' ? STAT_TITLE.CN.CASES: STAT_TITLE.EN.CASES; break;
        case STAT_URLS.COLLECTION_POINTS: title = props.lang === 'cn' ? STAT_TITLE.CN.COLLECTION_POINTS : STAT_TITLE.EN.COLLECTION_POINTS; break;
        case STAT_URLS.LATEST: title = props.lang === 'cn' ? STAT_TITLE.CN.LATEST : STAT_TITLE.EN.LATEST; break;
        case STAT_URLS.FLIGHT_TRAINS: title = props.lang === 'cn' ? STAT_TITLE.CN.FLIGHT_TRAINS : STAT_TITLE.EN.FLIGHT_TRAINS; break;
        case STAT_URLS.GUARANTINE_ORDERS: title = props.lang === 'cn' ? STAT_TITLE.CN.GUARANTINE_ORDERS : STAT_TITLE.EN.GUARANTINE_ORDERS; break;
        case STAT_URLS.CONFINEES_BUILDINGS: title = props.lang === 'cn' ? STAT_TITLE.CN.CONFINEES_BUILDINGS: STAT_TITLE.EN.CONFINEES_BUILDINGS; break;

    }
    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div>
                <Typography style={{fontWeight: 'bold', textAlign: 'left', marginLeft: 20, marginRight: 20}} component="h1">
                    {title}
                </Typography>
                </div>
            </div>
            <Snackbar open={snackState.open} autoHideDuration={6000} onClose={() => setOpenSnack(false)}>
                <Alert onClose={() => setOpenSnack(false)} severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>
            {isLoading ? <span /> :
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div>
                    <span style={{paddingLeft: 20, paddingRight: 20, textAlign: 'left'}}>{noOfDataTag}</span>
                    </div>
                    <TextField
                        placeholder={props.lang === 'cn' ? "搜尋" : 'Search'}
                        value={state.searchKey}
                        onChange={(e) => handleInput(e)}
                        InputProps={{
                            endAdornment: (
                                <React.Fragment>
                                    <IconButton onClick={() => handleSearch()}>
                                        <Search />
                                    </IconButton>
                                    <IconButton onClick={() => handleReset()}>
                                        <Clear />
                                    </IconButton>
                                </React.Fragment>
                            )
                        }}
                    />
                    {result}
                    <SpeedDial
                        ariaLabel="sdsd"
                        className={classes.speedDial}
                        icon={<SpeedDialIcon />}
                        onClick={() => setSpeedDialOpen(!speedDialOpen)}
                        open={speedDialOpen}
                        direction={'up'}
                        style={{position: 'fixed', zIndex: 1500}}
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={(e) => action.action(e)}
                            />
                        ))}
                    </SpeedDial>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => handleCloseMenu()}
                        style={{zIndex: 1501}}
                    >
                        {state.columns && state.columns.map(column => {
                            return (
                            <MenuItem onClick={() => handleSort(column.title)}>
                                {`${column.title} (${sortingState[column.title] && sortingState[column.title] === 'ASC' ? props.lang ==='cn' ? '由大至小' : 'Descending' : props.lang==='cn' ? '由小至大' : 'Ascending'})`}
                            </MenuItem>
                        );})}
                    </Menu>
                </div>}
        </div>
    );
}