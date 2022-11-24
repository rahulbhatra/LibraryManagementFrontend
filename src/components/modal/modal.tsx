import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, Paper, SxProps, Theme } from '@mui/material';

const style: SxProps<Theme> = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  border: '2px',
  boxShadow: 24,
  p: 4,
};

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
};

export default function CustomModal({open, setOpen, children}: Props) {

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          {children}
        </Paper>
      </Modal>
    </div>
  );
}