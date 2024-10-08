/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, MenuItem, FormControlLabel, Switch, IconButton} from '@mui/material';
import {Field, reduxForm} from 'redux-form';
import {withStyles} from '@mui/styles';
import {connect} from 'react-redux';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderFileField,
    renderOutlinedMultipleSelectField
} from '../../libs/redux-material.utils';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Slide,
    Tooltip
} from '@mui/material'
import styles from "./Style.module.css";
import {Delete as DeleteIcon, Info as InfoIcon} from "@mui/icons-material";
import MuiStyle from "../../libs/MuiStyle";
import {serviceTypeCheck} from "../../services/Type.service";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


let requiredFields = []
const validate = (values) => {
    const errors = {};

    requiredFields.forEach(field => {
        if (!values[field] || (Array.isArray(values[field]) && (values[field]).length == 0)) {
            errors[field] = 'Required'
        } else if( values[field] && typeof values[field] == 'string' && !(values[field]).trim()) {
            errors[field] = 'Required'
        }
    });
    if (values.name && !/^[A-Z ]*$/i.test(values.name)) {
        errors.name = 'Only alphabets are allowed';
    }
    return errors
};

let lastValue = '';
let isExists = false;

const asyncValidate = (values, dispatch, props) => {
    return new Promise((resolve, reject) => {
        if (values.name) {
            const value = values.name;
            if (lastValue == value && isExists && false) {
                reject({name: 'Type Name already Taken'});
            } else {
                const data = props.data;
                serviceTypeCheck({name: value, id: data ? data.id : null }).then((data) => {
                    console.log(data);
                    lastValue = value;
                    if (!data.error) {
                        if (data.data.is_exists) {
                            reject({name: 'Type Name already Taken'});
                        }
                    }
                    resolve({});
                })
            }
        } else {
            resolve({});
        }
    });
};


const nameNormalize = (value, prevValue) => {
    if ((value.length) > 50) {
        return prevValue
    } else {
        return value
            // ? value.toLowerCase() : value;
    }
}

class CreateContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'INDIVIDUAL',
            is_active:true,
            show_confirm: false,
            subcategory: [],
            selectedIndustry: null
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleActive = this._handleActive.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._suspendItem = this._suspendItem.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
    }

    componentDidMount() {
        const {data,subcategories,industries} = this.props;
        if (data) {
            requiredFields=['name','industry_id','subcategory','unit']
            Object.keys(data).forEach((val) => {
                if(['status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
            this.setState({
                is_active: data.status == 'ACTIVE',
            }, () => {
                this.changeIndustry(data.industry_id, false);
            });
        }
        else {
            requiredFields=['name','industry_id','subcategory','unit']
        }
    }

    _handleTypeChange(e) {
        this.changeIndustry(e.target.value);
    }

    changeIndustry(industryId, shouldReset = true){
        const {subcategories} = this.props;
        const filteredSub =  subcategories.filter((val) => {
            return val.industry_id == industryId;
        });
        const {selectedIndustry} = this.state;
        this.setState({
            subcategory: filteredSub,
            selectedIndustry: industryId,
        }, () => {
            if (industryId !== selectedIndustry && shouldReset) {
                this.props.change('subcategory', []);
            }
        })
    }


    _handleSubmit(tData) {
        //console.log(tData)

        const status = this.state.is_active ? 'ACTIVE' : 'INACTIVE';
        const {data} = this.props;
        if (data) {
            this.props.handleDataSave({ ...tData, status: status, id: data.id }, 'UPDATE')
        } else {
            this.props.handleDataSave({...tData}, 'CREATE')
        }
    }

    _convertData(data) {
        const temp = {};
        data.forEach((val) => {
            temp[val.id] = val.name;
        });
        return temp;
    }

    // _handleReject() {
    //     const {data} = this.props;
    //     this.props.changeStatus(data, 'REJECT');
    // }

    _renderReject() {
        if (this.props.data) {
            return (<Button variant={'contained'}
                            className={this.props.classes.btnError}
                            onClick={this._handleReject}
                            type="button">
                Reject
            </Button>);
        }
        return null;
    }

    _renderMenuTypes(){
        return this.props.tour_types.map((val)=>{
            return (
                <MenuItem value={val.id}>{val.name}</MenuItem>
            )
        })
    }

    _handleActive() {
        this.setState({
            is_active: !this.state.is_active,
        });
    }


    _renderStatus(){
        const {data} = this.props;
        // if (data) {
            return (<FormControlLabel
                control={
                    <Switch color={'primary'} checked={this.state.is_active} onChange={this._handleActive.bind(this)}
                            value="is_active"/>
                }
                label="Active ?"
            />);
        // } else {
        //     return null;
        // }
    }

    _suspendItem() {
        const {data} = this.props;
        this.setState({
            show_confirm: false,
        });
        this.props.handleDelete(data.id);
    }

    _handleDialogClose() {
        this.setState({
            show_confirm: false,
        })
    }


    _handleDelete() {
        this.setState({
            show_confirm: true
        });
    }


    _renderDialog() {
        const {classes} = this.props;
        if (this.state.show_confirm) {
            return (<Dialog
                keepMounted
                TransitionComponent={Transition}
                open={this.state.show_confirm}
                onClose={this._handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{paper: classes.dialog}}
            >
                <DialogTitle id="alert-dialog-title">{"Are You Sure"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you really want to delete the item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._handleDialogClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={this._suspendItem} color="primary">
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>)
        } return null;
    }

    _renderIndustries(){
        const {industries} = this.props;
        return industries.map((val) => {
            return (<MenuItem value={val.id}>{val.name}</MenuItem>);
        });
    }

    render() {
        const {handleSubmit, data,units} = this.props;
        const {subcategory} = this.state
        return (
            <div>
                <div className={styles.headerFlex}>
                    <h4 className={styles.infoTitle}>
                        <div className={styles.heading}>Type</div>
                        <Tooltip title="Info" aria-label="info" placement="right">
                            <InfoIcon fontSize={'small'}/>
                        </Tooltip>

                    </h4>
                    {data && <IconButton variant={'contained'} className={this.props.classes.iconBtnError}
                                         onClick={this._handleDelete}
                                         type="button">
                        <DeleteIcon />
                    </IconButton> }
                </div>

                <form onSubmit={handleSubmit(this._handleSubmit)}>

                    <div className={'formFlex'} style={{alignItems:'center'}}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="name" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   normalize={nameNormalize}
                                   label="Type Name"/>
                        </div>

                        {/*<div className={'formGroup'}>*/}
                        {/*    <Field*/}
                        {/*        inputId={'concernSelect'}*/}
                        {/*        fullWidth={true}*/}
                        {/*        name="industry_id"*/}
                        {/*        onChange={this._handleTypeChange}*/}
                        {/*        component={renderOutlinedSelectField} margin={'dense'} label="Industry Name">*/}
                        {/*        {this._renderIndustries()}*/}
                        {/*    </Field>*/}
                        {/*</div>*/}
                    </div>

                    {/*<div className={'formFlex'}>*/}
                    {/*    <div className={'formGroup'}>*/}
                    {/*        <Field*/}
                    {/*            inputId={'subcategory_id'}*/}
                    {/*            fullWidth={true}*/}
                    {/*            name="subcategory"*/}
                    {/*            //errorText={'Required'}*/}
                    {/*            dataObj={this._convertData(subcategory)}*/}
                    {/*            extract={{value: 'id', title: 'name'}}*/}
                    {/*            data={subcategory}*/}
                    {/*            component={renderOutlinedMultipleSelectField} margin={'dense'} label="Subcategory">*/}
                    {/*        </Field>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field
                                inputId={'unit_id'}
                                fullWidth={true}
                                name="unit"
                                //errorText={'Required'}
                                dataObj={this._convertData(units)}
                                extract={{value: 'id', title: 'name'}}
                                data={units}
                                component={renderOutlinedMultipleSelectField} margin={'dense'} label="Unit">
                            </Field>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            {this._renderStatus()}
                        </div>
                    </div>

                    <div style={{float: 'right'}}>
                        <Button variant={'contained'} color={'primary'} type={'submit'}>
                            Submit
                        </Button>
                    </div>

                </form>
                {this._renderDialog()}
            </div>
        )
    }

}

const useStyle = MuiStyle;


const ReduxForm = reduxForm({
    form: 'type',  // a unique identifier for this form
    validate,
    asyncValidate,
    // asyncBlurField: ['email'],
    // enableReinitialize: true,
    // onSubmitFail: errors => {
    //     EventEmitter.dispatch(EventEmitter.THROW_ERROR, 'Rejected');
    // }
})(withStyles(useStyle, {withTheme: true})(CreateContainer));

const mapStateToProps = state => {
    //console.log(user_profile);
    return {}
};

export default connect(mapStateToProps, null)(ReduxForm);
