import React, {useState, useEffect} from 'react';
import loadingGif from '../img/loading.gif';
import {STAT_URLS, STAT_TITLE} from '../constants/constants';
import {csv} from 'd3-fetch';
import latest from '../csv/latest_situation_of_reported_cases_covid_19_chi.csv';
import cases from '../csv/enhanced_sur_covid_19_chi.csv';
import buildings from '../csv/building_list_chi.csv';
import confiness from '../csv/home_confinees_tier2_building_list.csv';
import Tooltip from '@material-ui/core/Tooltip';
import TablePagination from '@material-ui/core/TablePagination';

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

import Paper from '@material-ui/core/Paper';

export const Statisitcs = (props) => {
    const initState = {
        columns: null,
        data: null,
        title: '',
    }
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState(initState);
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
        csv(url).then(csvData => {
            const data = csvData.filter((row, i) => i !== csvData.length-1);
            const columns = csvData.columns.map(col => ({title: col, field: col}));
            setState((prevState) => ({...prevState, data, columns, title,}));
            setIsLoading(false);
            console.log('data: ', data);
            console.log('columns: ', columns);
        })
    },[])
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
    if (state.data !== null && state.columns !== null) {
        result = state.data.map(row => {
            const keys = Object.keys(row);
            const tableContent = keys.map(k => <tr><td>{k}</td><td>{row[k]}</td></tr>)
            return (
            <div style={{backgroundColor: 'white', color: 'rgba(0, 0, 0, 0.87)', borderRadius: '10px', border: '1px solid #E7E7E7', margin: 10}}>
                <table style={{width: 300, textAlign: 'left', padding: 30}}>
                    <tbody>{tableContent}</tbody>
                </table>
            </div>
        )})
    }
    return (
        isLoading ? <img src={loadingGif}/> :
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>{result}</div>
    );
}