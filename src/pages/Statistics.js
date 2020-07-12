import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import loadingGif from '../img/loading.gif';
import {STAT_URLS, STAT_TITLE} from '../constants/constants';
import {csv} from 'd3-fetch';
import latest from '../csv/latest_situation_of_reported_cases_covid_19_chi.csv';
import cases from '../csv/enhanced_sur_covid_19_chi.csv';
import buildings from '../csv/building_list_chi.csv';
import confiness from '../csv/home_confinees_tier2_building_list.csv';

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
import { TextField, InputAdornment, IconButton } from '@material-ui/core';

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
    const classes = useStyles();
    const setOpenSnack = (open) => {
        setSnackState((prevSnack) => ({...prevSnack, open,}))
    }
    useEffect(() => {
        let url = '';
        let title = '';
        switch(props.url) {
            case STAT_URLS.LATEST: url = latest; title = STAT_TITLE.LATEST; break;
            case STAT_URLS.CASES: url = cases; title = STAT_TITLE.CASES; break;
            case STAT_URLS.BUILDINGS: url = buildings; title = STAT_TITLE.BUILDINGS; break;
            case STAT_URLS.CONFINEES_BUILDINGS: url = confiness; title = STAT_TITLE.CONFINEES_BUILDINGS; break;
        }
        setIsLoading(true);
        setSnackState((prevSnack) => ({...prevSnack, open: true, severity: 'info', message: '加載中...'}))
        csv(url).then(csvData => {
            const data = csvData.filter((row, i) => i !== csvData.length-1);
            const columns = csvData.columns.map(col => ({title: col, field: col}));
            setState((prevState) => ({...prevState, data, columns, title, filteredData: data,}));
            const sortingState = {};
            Object.keys(csvData.columns).forEach(column => {
                console.log('init:', column);
                sortingState[columns[column].title] = 'ASC';
            });
            setSortingState(sortingState);
            setIsLoading(false);
            setSnackState((prevSnack) => ({...prevSnack, severity: 'success', message: '完成'}))
            console.log('data: ', data);
            console.log('columns: ', columns);
        })
    },[])

    const handleSearch = () => {
        const {searchKey} = state;
        if (searchKey === "") {
            handleReset();
            return;
        };
        const searchResult = state.data.filter(row => {
            const keys = Object.keys(row);
            if (keys.includes(searchKey)) return true;
            let contains = false;

            const matchedKeys = keys.filter(key => {
                console.log('compare: ', row[key], searchKey, row[key].includes(searchKey))
                return row[key].includes(searchKey);
            });
            console.log('matchedKeys: ', matchedKeys);
            return matchedKeys.length > 0;
        })
        setState((prevState) => ({...prevState, filteredData: searchResult,}));
    }

    const handleReset = () => {
        setState((prevState) => ({...prevState, searchKey: '', filteredData: state.data}));
    }

    const handleInput = (e) => {
        const searchKey = e.target.value;
        setState((prevState) => ({...prevState, searchKey,}))
    }

    const handleGotoTop = () => {
        window.scrollTo(0);
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
        console.log('handleSort: ', column, sortingState, sortingState[column]);
        handleCloseMenu();
        if (sortingState[column] === 'ASC') {
            let sortedData = [];
            if (column.includes('日期')) {
                sortedData = state.filteredData.sort((a,b) => compareDate(a, b, column, 'ASC'))
            } else if (/^\d+$/.test(state.filteredData[0][column])) {
                sortedData = state.filteredData.sort((a,b) => b[column] - a[column]);
            } else {
                // sortedData = state.filteredData.sort((a,b) => b[column] - a[column]);
                sortedData = state.filteredData.sort((a,b) => new Intl.Collator('cn').compare(b[column], a[column]));
            }
            console.log(sortedData);
            setState((prevState) => ({...prevState, filteredData: sortedData}));
            console.log('b4: ', sortingState, column);
            const newSortingState = {...sortingState};
            Object.keys(newSortingState).forEach((key) => {
                if (new Intl.Collator('cn').compare(key, column) === 0) {
                    newSortingState[key] = 'DES';
                }
            })
            setSortingState(newSortingState)
            console.log('after: ', sortingState);
        } else {
            let sortedData = [];
            if (column.includes('日期')) {
                sortedData = state.filteredData.sort((a,b) => compareDate(a, b, column, 'DES'))
            } else if (/^\d+$/.test(state.filteredData[0][column])) {
                sortedData = state.filteredData.sort((a,b) => a[column] - b[column]); 
            } else {
                // sortedData = state.filteredData.sort((a,b) => a[column] - b[column]); 
                sortedData = state.filteredData.sort((a,b) => new Intl.Collator('cn').compare(a[column], b[column]));
            }
            console.log(sortedData);
            setState((prevState) => ({...prevState, filteredData: sortedData}));
            console.log('b4: ', sortingState);
            const newSortingState = {...sortingState};
            Object.keys(newSortingState).forEach((key) => {
                if (new Intl.Collator('cn').compare(key, column) === 0) {
                    newSortingState[key] = 'ASC';
                }
            })
            setSortingState(newSortingState)
            console.log('after: ', sortingState);
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
            const tableContent = keys.map(k => <tr><td>{k}</td><td>{row[k]}</td></tr>)
            return (
            <div key={idx} style={{backgroundColor: 'white', color: 'rgba(0, 0, 0, 0.87)', borderRadius: '10px', border: '1px solid #E7E7E7', margin: 10}}>
                <table style={{width: 300, textAlign: 'left', padding: 30}}>
                    <tbody>{tableContent}</tbody>
                </table>
            </div>
        )})
    }

    const actions = [
        { icon: <ArrowDownward />, name: '最下', action: (e) => handleGotoBottom()},
        { icon: <ArrowUpward />, name: '最上', action: (e) => handleGotoTop()},
        { icon: <Sort />, name: '排序', action: (e) => setAnchorEl(e.currentTarget)},
    ];
    return (
        <div>
            <Snackbar open={snackState.open} autoHideDuration={6000} onClose={() => setOpenSnack(false)}>
                <Alert onClose={() => setOpenSnack(false)} severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>
            {isLoading ? <img src={loadingGif} /> :
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <TextField
                        placeholder="搜尋"
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
                        style={{position: 'fixed'}}
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
                    >
                        {state.columns && state.columns.map(column => {
                            console.log(sortingState[column.title]);
                            return (
                            <MenuItem onClick={() => handleSort(column.title)}>
                                {`${column.title} (${sortingState[column.title] && sortingState[column.title] === 'ASC' ? '由大至小' : '由小至大'})`}
                            </MenuItem>
                        );})}
                    </Menu>
                </div>}
        </div>
    );
}