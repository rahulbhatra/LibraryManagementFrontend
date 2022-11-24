import { Autocomplete, Box, Button, CircularProgress, FormControlLabel, Grid, IconButton, Link, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import useAxios, { RefetchFunction } from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { Librarian } from '../../models/librarian';
import { User } from '../../models/user';
import AddIcon from '@mui/icons-material/Add';
import TokenService from '../services/token.service';
import CustomTable from '../table/table';
import CustomModal from '../modal/modal';
import Progress from '../progress/progress.component';
import { Edit, PersonPinCircle } from '@mui/icons-material';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';

export type Operation = 'Add' | 'Edit';

const LibrarianHome = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const columns: string[] = ['id', 'firstName', 'lastName',
    'phoneNumber', 'dob', 'age', 'address1', 'address2',
    'city', 'state', 'zipCode', 'username'];
  const [users, setUsers] = useState<User[]>([]);
  const [{ data: librarians, loading: librariansLoading, error: librariansError}, getAllLibrarians] = useAxios(
    {
      url: 'http://localhost:8080/librarian/getAllLibrarians',
      method: 'GET',
      headers: {
        'Authorization': TokenService.getAuthorization()
      }
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    getAllLibrarians();
  }, []);

  // console.log(librariansLoading);

  useEffect(() => {
    if (librarians) {
      const users = librarians.map((librarian: Librarian) => {
        return librarian.user;
      });
      setUsers(users);
    }
  }, [librarians]);

  return (
    <>
      <Progress open = {librariansLoading} />
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <IconButton onClick={() => {setOpen(true);}} >
            <AddIcon />
          </IconButton>
          <IconButton onClick={() => {setEditOpen(true);}} >
            <Edit />
          </IconButton>
        </Grid>
        <CustomTable rows={users} columns={columns} />
        <CustomModal open={open} setOpen={setOpen} children={<AddLibrarian operation='Add' getAllLibrarians={getAllLibrarians} setOpen={setOpen} />} />
        <CustomModal open={editOpen} setOpen={setEditOpen} children={<EditLibrarian librarians={librarians} getAllLibrarians={getAllLibrarians} setOpen={setEditOpen} />} />
      </Grid>
    </>
  );
};

export default LibrarianHome;

interface AddProps {
  operation: Operation;
  librarian?: Librarian;
  getAllLibrarians?: RefetchFunction<any, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddLibrarian = ({ librarian, operation, getAllLibrarians, setOpen }: AddProps) => {
  const { open, severity, message, openSnackBar } = useSnackBar();
  const [{ data: __, loading: loading, error: error }, postLibrarian ] = useAxios(
    {
      method: 'POST',
      url: 'http://localhost:8080/librarian',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalRefreshToken()
      }
    },
    { 
      manual: true
    }
  );

  const [{ data: _, loading: updatedLoading, error: updatedError }, putLibrarian ] = useAxios(
    {
      method: 'PUT',
      url: 'http://localhost:8080/librarian',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalRefreshToken()
      }
    },
    { 
      manual: true
    }
  );

  const [user, setUser] = useState<User>(librarian? librarian.user : {});

  useEffect(() => {
    if (librarian) {
      setUser(librarian.user);
    }
  }, [librarian]);

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: Librarian = {
      id: librarian?.id,
      user: user
    };
    if (operation === 'Add') {
      await postLibrarian({
        data
      });
      openSnackBar('success', 'Successfully created librarian');
    } else {
      await putLibrarian({
        data
      });
      openSnackBar('success', 'Successfully updated librarian');
    }
    getAllLibrarians?.();
    setTimeout(setOpen, 2000);
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Box component="form" onSubmit={handleAdd} sx={{ mt: 1 }}>
      <CustomSnackBar open={open} severity={severity} message={message} />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        rowSpacing={2} columnSpacing={2}
      >
        <Grid item xs={4} sm={4}>
          <TextField
            required
            fullWidth
            id="firstName"
            value={user?.firstName}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setUser((oldUser) => {
                return {
                  ...oldUser,
                  firstName: event.target.value
                };
              });
            }}
            label="First Name"
            autoComplete="firstName"
            autoFocus
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <TextField
            fullWidth
            id="middleName"
            label="Middle Name"
            name="middleName"
            autoComplete="family-name"
            value={user.middleName}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setUser((oldUser) => {
                return {
                  ...oldUser,
                  middleName: event.target.value
                };
              });
            }}
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={user.lastName}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setUser((oldUser) => {
                return {
                  ...oldUser,
                  lastName: event.target.value
                };
              });
            }}
          />
        </Grid>
        {operation === 'Add' && <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={user.username}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setUser((oldUser) => {
                return {
                  ...oldUser,
                  username: event.target.value
                };
              });
            }}
          />
        </Grid>}
        
        {operation === 'Add' && <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={user.password}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setUser((oldUser) => {
                return {
                  ...oldUser,
                  password: event.target.value
                };
              });
            }}
          />
        </Grid>}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="address1"
            label="address 1"
            id="address1"
            autoComplete="address 1"
            value={user.address1}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setUser((oldUser) => {
                return {
                  ...oldUser,
                  address1: event.target.value
                };
              });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="address2"
            label="address 2"
            id="address2"
            autoComplete="address 2"
            value={user.address2}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setUser((oldUser) => {
                return {
                  ...oldUser,
                  address2: event.target.value
                };
              });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="dob"
            label="date of birth"
            id="dob"
            autoComplete="date of birth"
            defaultValue="1997-10-25"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setUser((oldUser) => {
                return {
                  ...oldUser,
                  dob: new Date(event.target.value).toISOString()
                };
              });
            }}
          />
        </Grid>
        <Grid container 
          direction="row"
          justifyContent="center"
          alignItems="center"xs={12}>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {operation === 'Add' ? 'Add': 'Update'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

interface EditProps {
  librarians: Librarian[];
  getAllLibrarians?: RefetchFunction<any, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditLibrarian = ({librarians, getAllLibrarians, setOpen}: EditProps) => {
  const [librarian, setLibrarian] = useState<Librarian | null>(null);

  useEffect(() => {
    console.log(librarian);
  }, [librarian]);

  return (
    <>
      <Autocomplete 
        options={librarians}
        value={librarian}
        onChange={(event, value: Librarian | null, reason) => {
          setLibrarian(value);
        }}
        getOptionLabel={(option: Librarian) => {
          const userOption: User = option.user;
          return userOption.firstName + ' ' + userOption.lastName + `(${userOption.username})`;
        }}
        renderInput={(params) => <TextField {...params} label="Choose User" />}/>
      {librarian && <AddLibrarian librarian={librarian} operation={'Edit'} getAllLibrarians={getAllLibrarians} setOpen={setOpen} />}
    </>
  );
};