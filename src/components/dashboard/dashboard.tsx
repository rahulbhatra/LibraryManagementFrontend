import * as React from 'react';
import { styled, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Container, Grid, Paper, Typography } from '@mui/material';

function Dashboard() {

  const theme = useTheme();

  return (
    <>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Grid 
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant='h4' color={theme.palette.secondary.dark}>This is an awesome Library Management System</Typography>

            </Grid>
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        {/* <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            
          </Paper>
        </Grid> */}
        {/* Recent Orders */}
        {/* <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            
          </Paper>
        </Grid> */}
      </Grid>
    </>
  );
}

export default Dashboard;