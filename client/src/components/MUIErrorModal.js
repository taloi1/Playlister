import { useContext } from 'react'
import AuthContext from '../auth';
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import { Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';


export default function MUIErrorModal() {
    const { auth } = useContext(AuthContext);
    let message = auth.errorMessage;
    function handleCloseModal(event) {
        auth.hideModal();
    }

    return (
        <Modal
            open={auth.errorMessage !== ""}
        >
            <Stack sx={{ width: '40%', marginLeft: '30%', marginTop: '20%' }} spacing={2}>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {message}
                    <Button color="primary" size="small" onClick={handleCloseModal}>
                            Close
                    </Button>
                </Alert>
            </Stack>
        </Modal>
    );
}