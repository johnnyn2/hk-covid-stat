import React, {useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import {PAGES} from '../constants/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const CustomAppBar = (props) => {  
  const classes = useStyles();

  const handleChangePage = (currentPage) => {
      props.setCurrentPage((prevState) => ({
          ...prevState,
          currentPage,
      }))
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" style={{height: 64, justifyContent: 'center'}}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            {props.lang === 'cn' ? `新冠肺炎疫情數據庫` : 'New Coronary Pneumonia Epidemic Database'}
          </Typography>
          <Button color="inherit" onClick={() => handleChangePage(PAGES.MAIN)}>
            {props.lang === 'cn' ? '主頁' : 'Home'}
          </Button>
          <Button color="inherit" onClick={() => handleChangePage(PAGES.ABOUT)}>
            {props.lang === 'cn' ? '關於' : 'About'}
          </Button>
          
        </Toolbar>
      </AppBar>
    </div>
  );
}
