/* eslint-disable indent,no-mixed-spaces-and-tabs */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Switch, Route, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import {connect, useSelector} from "react-redux";
import {Header, Sidebar} from '../../components/index.component';
import dashboardRoutes from '../../routes/dashboard';
import appStyle from '../../assets/jss/material-dashboard-react/appStyle';
import logo from '../../assets/img/logo.png';
import CustomRouter from '../../libs/CustomRouter.utils';
import DashboardSnackbar from '../../components/Snackbar.component';
import {makeStyles} from "@mui/styles";
import EventEmitter from "../../libs/Events.utils";
import RolesUtils from "../../libs/Roles.utils";

const useStyles = makeStyles(appStyle);

const Dashboard = ({title, ...props}) => {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [isSideBar,setIsSideBar] = useState(true);
    const [message, setMessage] = useState('');
    const {user_profile, role} = useSelector(state => state.auth);
    const mainPanelRef = useRef(null);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        EventEmitter.subscribe(EventEmitter.MOVE_TO_TOP, moveToTop);
        // initializeFirebase();
        // getTokenFcm().then((token) => {
        //     if (token) {
        //         serviceCaptureInfo({ fcm_token: token });
        //     }
        // });
        return () => {
            EventEmitter.unsubscribe(EventEmitter.MOVE_TO_TOP);
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        if(isMobile){
            setDrawerOpen(false)
        }
        // this.refs.mainPanel.scrollTop = 0;
    }, []);

    const moveToTop = useCallback(() => {
        mainPanelRef.current.scrollTop = 0;
    }, []);

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen(e => !e);
    }, [setMobileOpen]);

    const handleResize =  useCallback((e) => {
        if (window.innerWidth < 767) {
            // setDrawerOpen(false);
        } else {
            setDrawerOpen(true);
        }
    }, [setDrawerOpen]);

    const handleOpenSideBar = useCallback(() => {
        setDrawerOpen(true);
    }, [setDrawerOpen]);

    const handleCloseSideBar = useCallback(() => {
        if(!isSideBar){
            setDrawerOpen(false);
        }
    }, [setDrawerOpen,isSideBar]);

    const handleHeaderClick = useCallback(() => {
        setDrawerOpen(e => !e);
        setIsSideBar(e =>!e)
    }, [setDrawerOpen,setIsSideBar]);

    const switchRoutes =  useMemo(() => {
        const tempRoutes = [];
        dashboardRoutes.forEach((prop, key) => {
            if ((user_profile.is_verified || !prop.is_protect) && prop.path ) {
                tempRoutes.push(<CustomRouter is_protect={prop.is_protect} private exact path={prop.path}
                                              component={prop.component} desktopComponent={prop.desktopComponent}
                                              key={key}
                                              {...prop}/>);
            }
        })
        return (<Switch>
            {tempRoutes}
        </Switch>)
    }, [dashboardRoutes]);

    const sideBarRoutes = useMemo(() => {
        return dashboardRoutes?.filter((val, index) => {
            // if (val.roles) {
            //     if (val.roles.indexOf(Constants.ROLES.GENERAL) >= 0) {
            //         return true;
            //     }
            //     const isThere = val.roles.indexOf(role);
            //     return isThere >= 0;
            // } return true;
            return RolesUtils?.canAccess(val?.roles, role);
        })
    }, [dashboardRoutes, role]);

    return (
        <div ref={mainPanelRef} className={classNames(classes.wrapper,'bottomAction')}>
            <Sidebar
                routes={sideBarRoutes}
                logoText={title}
                logo={logo}
                handleDrawerToggle={handleDrawerToggle}
                toggleSideBar={handleHeaderClick}
                handleOpenSideBar={handleOpenSideBar}
                handleCloseSideBar={handleCloseSideBar}
                open={drawerOpen}
                color="blue"
                {...props}
            />
            <div className={classNames(classes.appBar, {
                [classes.appBarShift]: drawerOpen,
            })}
            >
                <Header
                    handleHeaderClick={handleHeaderClick}
                    routes={dashboardRoutes}
                    handleDrawerToggle={handleDrawerToggle}
                    {...props}
                />
                {/* <Navbar routes={sideBarRoutes}/> */}
                <div className={classes.content}>
                    <div className={classes.container}>
                        {switchRoutes}
                    </div>
                </div>
            </div>
            <DashboardSnackbar/>
        </div>
    );
}

export default (Dashboard);
