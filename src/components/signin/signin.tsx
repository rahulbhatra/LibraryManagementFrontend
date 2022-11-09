import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import useAxios from 'axios-hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BearerAccessRefreshToken } from '../../models/authentication';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';

const SignIn = () => {
  const navigate = useNavigate();
  const { open, severity, message, openSnackBar } = useSnackBar();

  const [{ data: token, loading: tokenLoading, error: tokenError }, verifyUser] = useAxios(
    {
      method: 'POST',
      url: 'http://localhost:8080/login'
    },
    { manual: true }
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    verifyUser({
      data: {
        username: data.get('email'),
        password: data.get('password'),
      }
    });
  };

  useEffect(() => {
    if (tokenError) {
      openSnackBar('error', 'Wrong username or password');
    }
  }, [tokenError]);

  useEffect(() => {
    if (token) {
      const loggedInToken: BearerAccessRefreshToken = token;
      openSnackBar('success', 'Signed In Success');
      localStorage.setItem('BearerAccessRefreshToken', JSON.stringify(loggedInToken));
      console.log(loggedInToken);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  }, [token]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <CustomSnackBar open={open} severity={severity} message={message}  />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
        Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {'Don\'t have an account? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;