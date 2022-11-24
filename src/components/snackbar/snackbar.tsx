import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  severity: AlertColor;
  message: string;
}

export const CustomSnackBar = ({open, severity, message} : Props) => {
  // console.log(open, severity, message);
  return (
    <Snackbar open={open} autoHideDuration={6000}>
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const useSnackBar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [message, setMessage] = useState<string>('');

  React.useEffect(() => {
    if (open === true) {
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [open]);

  const openSnackBar = (severity: AlertColor, message : string) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  };

  return { open, severity, setSeverity, message, openSnackBar};
};

export default useSnackBar;