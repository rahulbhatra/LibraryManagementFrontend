import { Alert, AlertColor, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  start: boolean;
  severity: AlertColor;
  message: string;
}

const CustomSnackbar = ({ start, severity, message } : Props) => {
  const [open, setOpen] = useState<boolean>(start);
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