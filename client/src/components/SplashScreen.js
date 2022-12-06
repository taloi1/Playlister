import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

export default function SplashScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    function handleRegisterButton() {
        store.history.push("/register");
    }

    function handleLoginButton() {
        store.history.push("/login");
    }

    function handleGuestButton() {
        store.loginGuest();
    }

    return (
        <div id="splash-screen">
            <Box style={{ position: 'absolute', left: '67%', top: '44%', width: 'auto', display: 'flex', flexDirection: 'column', }}>
                <Button
                    style={{ fontSize: '18pt', backgroundColor: '#dddddd', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111', borderRadius: '8px'}}
                    onClick={handleRegisterButton}
                    id='guest-button'
                    variant="contained">
                    Create Account
                </Button>
                <Button
                    style={{ marginTop: '25px', fontSize: '18pt', backgroundColor: '#dddddd', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111', borderRadius: '8px' }}
                    onClick={handleLoginButton}
                    id='guest-button'
                    variant="contained">
                    Login
                </Button>
                <Button
                    style={{ marginTop: '25px', fontSize: '18pt', backgroundColor: '#dddddd', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111', borderRadius: '8px' }}
                    onClick={handleGuestButton}
                    id='guest-button'
                    variant="contained">
                    Continue as Guest
                </Button>
            </Box>
        </div>
    )
}