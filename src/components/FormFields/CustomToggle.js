import React from 'react';
import { withStyles } from '@mui/styles';
import { purple } from '@mui/material/colors';
import {FormGroup, FormControlLabel, Switch, Grid, Typography} from '@mui/material';

const AntSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

export default function CustomToggle({handleChange,leftLabel,rightLabel, value}) {

    // const handleChange = (event) => {
    //     setState({ ...state, [event.target.name]: event.target.checked });
    // };

    return (
        <FormGroup>
            <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>{leftLabel}</Grid>
                    <Grid item>
                        <AntSwitch checked={value}  onChange={(e) => handleChange(e.target.checked)} />
                    </Grid>
                    <Grid item>{rightLabel}</Grid>
                </Grid>
            </Typography>
        </FormGroup>
    );
}
