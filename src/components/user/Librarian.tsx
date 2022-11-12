import { Box, Button, FormControlLabel, Grid, IconButton, Link, TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { Librarian } from '../../models/librarian';
import { User, UserKeys } from '../../models/user';
import AddIcon from '@mui/icons-material/Add';
import TableRowsIcon from '@mui/icons-material/TableRows';
import TokenService from '../services/token.service';
import CustomTable from '../table/table';

export type Operation = 'Add' | 'Table';

const UserHome = () => {
  const [operation, setOperation] = useState<Operation>();
  const columns: string[] = ['id', 'firstName', 'lastName',
    'phoneNumber', 'dob', 'age', 'address1', 'address2',
    'city', 'state', 'zipCode', 'username'];
  const [users, setUsers] = useState<User[]>([]);
  const [{ data: librarians, loading: librariansLoading, error: librariansError}, getAllLibrarians] = useAxios(
    {
      url: 'http://localhost:8080/librarian/getAllLibrarians',
      method: 'GET'
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (operation == 'Table') {
      getAllLibrarians();
    }
  }, [operation, getAllLibrarians]);

  useEffect(() => {
    if (librarians) {
      const users = librarians.map((librarian: Librarian) => {
        return librarian.librarianInfo;
      });
      setUsers(users);
    }
  }, [librarians]);

  return (
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
        <IconButton onClick={() => {setOperation('Table');}} >
          <TableRowsIcon />
        </IconButton>
        <IconButton onClick={() => {setOperation('Add');}} >
          <AddIcon />
        </IconButton>
      </Grid>
      {operation === 'Table' && <CustomTable rows={users} columns={columns} />}
      {operation === 'Add' && <AddLibrarian />}
    </Grid>
  );
};

export default UserHome;

const AddLibrarian = () => {
  const [{ data: librarian, loading: loading, error: error }, postLibrarian ] = useAxios(
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

  const [user, setUser] = useState<User>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: Librarian = {
      librarianInfo: user
    };
    postLibrarian({
      data
    });
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2} width={'80vh'}>
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
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid xs={12}>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};