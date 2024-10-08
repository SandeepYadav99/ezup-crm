/**
 * Created by charnjeetelectrovese@gmail.com on 4/30/2020.
 */
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';
import {VerifiedUser} from '@mui/icons-material';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%'
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    gridTitle:{
        display:"flex",
        flexDirection:"column",

    },
    title1: {
        fontWeight: 500,
        fontSize: '14px'
    },
    title2: {
        fontWeight: 500,
        fontSize: '14px',
        padding:"10px"

    },
    avatar: {
        backgroundColor: 'black',
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    difference: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    differenceIcon: {
        color: theme.palette.error.dark
    },
    differenceValue: {
        color: theme.palette.error.dark,
        marginRight: theme.spacing(1)
    }
}));

const Budget = props => {
    const { className, manufacturestitle, newTitle,value, icon, ...rest } = props;

    const classes = useStyles();
    const TempIcon = icon;
    return (
        <Card
            {...rest}
            className={classnames(classes.root, className)}
        >
            <CardContent>
                <Grid
                    container
                    justify="space-between"
                >
                    <Grid item  className={classes.gridTitle}>
                        <Typography
                            className={classes.title1}
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                        >
                            {manufacturestitle}
                        </Typography>

                        <Typography
                            className={classes.title2}
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                        >
                            {newTitle}
                        </Typography>
                        {/* <Typography variant="h3">{value}</Typography> */}

                    </Grid>
                    <Grid item>
                        {/* <Avatar className={classes.avatar}>
                            <TempIcon className={classes.icon} />
                        </Avatar> */}
                        <Typography variant="h3">{value}</Typography>
                        <Typography variant="h3">{value}</Typography>
                    </Grid>

                </Grid>
                {/*<div className={classes.difference}>*/}
                {/*    <ArrowDownwardIcon className={classes.differenceIcon} />*/}
                {/*    <Typography*/}
                {/*        className={classes.differenceValue}*/}
                {/*        variant="body2"*/}
                {/*    >*/}
                {/*        12%*/}
                {/*    </Typography>*/}
                {/*    <Typography*/}
                {/*        className={classes.caption}*/}
                {/*        variant="caption"*/}
                {/*    >*/}
                {/*        Since last month*/}
                {/*    </Typography>*/}
                {/*</div>*/}
            </CardContent>
        </Card>
    );
};

Budget.propTypes = {
    className: PropTypes.string
};

export default Budget;
