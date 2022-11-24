import { CircularProgress, Grid, Paper } from '@mui/material';

interface Props {
  open: boolean;
}

const Progress = ({open}: Props) => {
  return (
    <>
      {open && <Paper sx={{ height: '85vh'}}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '85vh'}}
        >
          <CircularProgress color={'secondary'} size={50} />
      Loading ...
        </Grid>
      </Paper>}
    </>
  );
};

export default Progress;