import React, {useState, useEffect} from 'react';
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

import MaterialTable from 'material-table';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';

export const Statisitcs = (props) => {
    const initState = {
        columns: null,
        data: null,
        title: '',
        searchKey: '',
        filteredData: null,
    }
    const initSnackState = {
        open: false,
        severity: "info",
        message: ""
    }
    const [isLoading, setIsLoading] = useState(false);
    const [snackState, setSnackState] = useState(initSnackState);
    const [state, setState] = useState(initState);
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

    }

    const handleGotoBottom = () => {

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
    return (
        <div>
            <Snackbar open={snackState.open} autoHideDuration={6000} onClose={() => setOpenSnack(false)}>
                <Alert onClose={() => setOpenSnack(false)} severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>
            {isLoading ? <img src={loadingGif}/> :
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
                                        <Search/>
                                    </IconButton>
                                    <IconButton onClick={() => handleReset()}>
                                        <Clear/>
                                    </IconButton>
                                </React.Fragment>
                            )
                        }}
                    />
                    {result}
                </div>}
        </div>
    );
}