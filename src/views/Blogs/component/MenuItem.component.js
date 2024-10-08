import React from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

const ITEM_HEIGHT = 48;

export default function LongMenu({handleEdit,blogId}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const _handleEdit = () => {
        handleEdit();
    }

    const handlePreview = () => {
        window.open(
            'http://91.205.173.97:8093/blogs/'+ blogId,
            '_blank'
        );
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                    },
                }}
            >
                {/*<MenuItem onClick={handleClose}>Publish</MenuItem>*/}
                <MenuItem onClick={_handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handlePreview}>Preview</MenuItem>
            </Menu>
        </div>
    );
}
