import React, {useState, useEffect} from 'react';
import {STAT_URLS} from '../constants/constants';
import {csv} from 'd3-fetch'
import url from '../csv/building_list_chi.csv';

export const Statisitcs = (props) => {
    const initState = {
        data: null,
    }
    const [state, setState] = useState(initState);
    useEffect(() => {
        csv(url).then(data => console.log(data['columns']))
    },[])
    return <span>{props.url}</span>;
}