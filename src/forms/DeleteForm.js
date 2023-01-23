import React from 'react';
import { Button } from 'react-bootstrap';
import * as Icon from "react-bootstrap-icons"
import PropTypes from 'prop-types';

const DeleteForm = (props) => {
    const { index, deleteRecording, onClose } = props;
    return (
        <div className='alertForm'>
            <span className='closeButton'>
                <Icon.XCircleFill color="dimgray" size={18} onClick={() => onClose()} />
            </span>
            <div className='ImportantInfoInAlert'>
                <Icon.Info size={60} color ="#017BFF" />
                Czy jesteś pewny, że chcesz usunąć ten quiz?
            </div>
            <div className='recordingDeleteButtons'>
                <Button variant='primary' onClick={() => onClose()}>Nie</Button>
                <Button variant='danger' style={{ marginLeft: "10px" }} 
                    onClick={() => {
                        deleteRecording(index);
                        onClose();
                    }}>Tak</Button>
            </div>
        </div>
    );
}

DeleteForm.propTypes = {
    index: PropTypes.string,
    onClose: PropTypes.func,
    deleteRecording: PropTypes.func,
};
  
DeleteForm.defaultProps = {};

export default DeleteForm