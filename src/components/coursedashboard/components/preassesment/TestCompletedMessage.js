import { Modal, ModalDialog, Typography } from '@mui/joy';
import React from 'react';

function TestCompletedMessage({ isModelOpen, onClose, imageSrc, message }) {
    return (
        <Modal open={isModelOpen} onClose={onClose}>
            <ModalDialog sx={{ width: 200 }}>
                <img src={imageSrc} alt="Completion" className='mt-0 rounded-md' />
                <Typography sx={{ fontWeight: 600 }}>
                    {message}
                </Typography>
            </ModalDialog>
        </Modal>
    );
}

export default TestCompletedMessage;
