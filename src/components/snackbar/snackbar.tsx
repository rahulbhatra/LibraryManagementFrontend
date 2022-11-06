import { Alert, AlertColor, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  severity: AlertColor;
  message: string;
}

const CustomSnackbar = ({ open, setOpen, severity, message } : Props) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} 
      onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      }}>
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;