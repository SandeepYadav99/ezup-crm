import React, {Component} from 'react';
import PageBox from '../../components/PageBox/PageBox.component';
import startsWith from 'lodash.startswith';
import {Button, MenuItem, FormControlLabel, Switch,IconButton} from '@mui/material';
import {withStyles} from '@mui/styles';
import { Delete as DeleteIcon } from '@mui/icons-material';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {
    renderTextField,
    renderSelectField,
    renderOutlinedTextField,
    renderOutlinedSelectField,
    renderFileField,
    renderOutlinedMultipleSelectField
} from '../../libs/redux-material.utils';
import EventEmitter from "../../libs/Events.utils";
import {CountryPhone} from '../../components/index.component';
import styles from './Style.module.css';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import {bindActionCreators} from "redux";
import QuestionaireChild from '../../components/Questionnaire/Questionaire.component'
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import {serviceCategoryCheck} from "../../services/Category.service";
// import IncludeForm from './components/includes/Includes.component';
// import {serviceProviderEmailExists} from "../../services/ProviderRequest.service";
// import {servicePromotionCheck} from "../../services/Promotion.service";

let requiredFields = [];
const validate = (values) => {
    const errors = {};
    requiredFields.forEach(field => {
        if (!values[field] || values[field] == ' ') {
            errors[field] = 'Required'
        } else if( values[field] && typeof values[field] == 'string' && !(values[field]).trim()) {
            errors[field] = 'Required'
        }
    });
    if (values.name && !/^[A-Z ]*$/i.test(values.name)) {
        errors.name = 'Only alphabets are allowed';
    }
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if (values.age && parseInt(values.age) < 18) {
        errors.age = 'Minimum age must be 18'
    }
    if (values.languages && values.languages.length == 0) {
        errors.languages = 'Required';
    }
    return errors
};

const titleNormalize = (val, prevVal) => {
    if(val.length <= 50){
        return val;
    } return prevVal;
}
const countNormalize = (value, prevValue) => {
    if (value.length > 500) {
        return prevValue;
    }
    return value;
};

// const educationNormalize = (value, prevValue) => {
//     if (value.length > 300) {
//         return prevValue
//     } else {
//         return value;
//     }
// };

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

let lastValue = '';
let isExists = false

const asyncValidate = (values, dispatch, props) => {
    return new Promise((resolve, reject) => {
        if (values.name) {
            const value = values.name;
            if (lastValue == value && isExists && false) {
                reject({name: 'Category Name already Taken'});
            } else {
                const data = props.data;
                serviceCategoryCheck({name: value, id: data ? data.id : null }).then((data) => {

                    lastValue = value;
                    if (!data.error) {
                        if (data.data.is_exists) {
                            reject({name: 'Category Name already Taken'});
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

class Category extends Component {
    constructor(props) {
        super(props);
        this.includes = null;
        this.state = {
            is_active: true,
            is_featured: false,
            type: 'GENERAL',
            show_confirm: false,
            included: null,
            questionnaire: [],
            is_kyc: false
            };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._handleFeatured = this._handleFeatured.bind(this);
        this._handleActive = this._handleActive.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._handleQuestionnaire = this._handleQuestionnaire.bind(this);
        this._suspendItem = this._suspendItem.bind(this);
        this._handleType = this._handleType.bind(this);
    }

    componentDidMount() {
        const {data} = this.props;
        if (data) {
            requiredFields = ['name','description'];
            Object.keys(data).forEach((val) => {
                if (['logo', 'is_featured','status'].indexOf(val) == -1) {
                    const temp = data[val];
                    this.props.change(val, temp);
                }
            });
            this.setState({
                is_active: data.status == 'ACTIVE',
                is_featured: data.is_featured,
                questionnaire: data.kyc ? data.kyc : [],
            })
        } else {
            requiredFields = ['name','description','banner','logo'];
        }
    }

    _handleSubmit(tData) {
        const {industry_id} = this.props;
        const { questionnaire,kyc } = this.state;
        console.log(questionnaire)
        if(Array.isArray(questionnaire) && questionnaire.length > 0){
            this.setState({
                is_kyc: true
            });
            let isValid = true;
            questionnaire.forEach((val) => {
                if(val.name == '' || val.applies_to == ''){
                    EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please Enter Valid Values',type:'error'});
                    isValid = false;
                }
            });
            if (!isValid) {
                return true;
            }
        }

        const fd = new FormData();
        Object.keys(tData).forEach((key) => {
            if (['is_featured','is_kyc','kyc','status','industry_id'].indexOf(key) < 0) {
                fd.append(key, tData[key]);
            }
        });
        fd.append('is_featured', (this.state.is_featured));
        if (industry_id) {
            fd.append('industry_id', industry_id);
        }
        fd.append('status', (this.state.is_active ? 'ACTIVE' : 'INACTIVE'));
        fd.append('kyc',JSON.stringify(questionnaire))
        fd.append('is_kyc',this.state.is_kyc)
        const {data} = this.props;
        if (data) {
            this.props.handleDataSave(fd, 'UPDATE')
        } else {
            this.props.handleDataSave(fd, 'CREATE')
        }
    }

    _handleActive() {
        this.setState({
            is_active: !this.state.is_active,
        });
    }

    _handleFileChange(file) {
        this.setState({
            company_proof: file
        })
    }

    _renderActive() {
        const {data} = this.props;
        if (data) {
            return (<FormControlLabel
                control={
                    <Switch color={'primary'} checked={this.state.is_active} onChange={this._handleActive.bind(this)}
                            value="is_active"/>
                }
                label="Active ?"
            />);
        } else {
            return null
        }
    }

    _renderFeatured() {
        return (<FormControlLabel
            control={
                <Switch color={'secondary'} checked={this.state.is_featured} onChange={this._handleFeatured}
                        value="is_featured"/>
            }
            label="Featured ?"
        />);
    }

    _handleFeatured() {
        this.setState({
            is_featured: !this.state.is_featured,
        });
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

    _handleQuestionnaire(data) {
        this.setState({
            questionnaire: data
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
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you really want to delete the item?
                        <br/>
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

    _handleType(e) {
        const type = e.target.value;
        this.setState({
            type: type,
        });
        if (type == 'CATEGORY') {
            const index = requiredFields.indexOf('ref_id');
            if (index == -1) {
                requiredFields.push('ref_id');
            }
        } else {
            const index = requiredFields.indexOf('ref_id');
            if (index != -1) {
                requiredFields.splice(index, 1);
            }
        }
    }


    render() {
        const {handleSubmit, data, industry_id} = this.props;
        const {included} = this.state;
        return (
            <div>
                <div className={styles.headerFlex}>
                    <h4 className={styles.infoTitle}>
                        <div className={styles.heading}>Category</div>
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
                    <div className={'formFlex'} style={{ }}>
                        <div className={''} style={{ margin: '0px 20px'}}>
                            <Field
                                max_size={2 * 1024 * 1024}
                                type={['jpg', 'png', 'jpeg']}
                                fullWidth={true}
                                name="logo"
                                component={renderFileField}
                                //label=""
                                show_image
                                default_image={data ? data.logo : ''}
                                link={data ? data.logo : ''}
                            />
                        </div>
                        <div className={'formGroup'}>
                            <Field fullWidth={true} name="name" component={renderOutlinedTextField}
                                   margin={'dense'}
                                   normalize={titleNormalize}
                                   label="Category Name"/>
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        {!industry_id && (<div className={'formGroup'}>
                        <Field fullWidth={true}
                               name="industry_id"
                               component={renderOutlinedSelectField}
                               margin={'dense'}
                               label="Industry">
                            {this.props.industries.map((val) => {
                                return (<MenuItem value={val.id}>{val.name}</MenuItem>);
                            })}
                        </Field>
                    </div>)}
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            <Field fullWidth={true}
                                   name="description"
                                   component={renderOutlinedTextField}
                                   multiline
                                   rows="3"
                                   margin={'dense'}
                                   normalize={countNormalize}
                                   label="Description"/>
                        </div>
                    </div>

                    <label htmlFor="" className={styles.includeContainer}>
                        KYC
                    </label>
                    <div className={'formFlex'} style={{position: 'relative'}}>
                        <div className={'formGroup'}>
                            <QuestionaireChild questionnaire={this.state.questionnaire}
                                               handleQuestionnaire={this._handleQuestionnaire}
                            />
                            {/*<IncludeForm*/}
                                {/*data={included}*/}
                                {/*ref={(ref) => {*/}
                                    {/*this.includes = ref*/}
                                {/*}}></IncludeForm>*/}
                        </div>
                    </div>

                    <div className={'formFlex'}>
                        <div className={'formGroup'}>
                            {this._renderFeatured()}
                        </div>
                        <div className={'formGroup'}>
                            {this._renderActive()}
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

const useStyle = theme => ({
    iconBtnError: {
        color: theme.palette.error.dark
    }
});


const ReduxForm = reduxForm({
    form: 'category',  // a unique identifier for this form
    validate,
    asyncValidate,
    enableReinitialize: true,
    onSubmitFail: errors => {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Please enter values', type: 'error'});
    }
})(withStyles(useStyle, {withTheme: true})(Category));


function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
