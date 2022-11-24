import { Autocomplete, AutocompleteRenderInputParams, Box, Button, CircularProgress, FormControlLabel, Grid, IconButton, Link, MenuItem, Select, Snackbar, TextField } from '@mui/material';
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
import { Document, TypeOfDocument } from '../../models/document';

export type Operation = 'Add' | 'Edit';

const Documents = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const columns: string[] = ['id', 'firstName', 'lastName',
    'phoneNumber', 'dob', 'age', 'address1', 'address2',
    'city', 'state', 'zipCode', 'username'];
  const [users, setUsers] = useState<User[]>([]);
  const [{ data: librarians, loading: librariansLoading, error: librariansError}, getAllDocuments] = useAxios(
    {
      url: 'http://localhost:8080/document/getAllDocuments',
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
    getAllDocuments();
  }, []);

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
        <CustomModal open={open} setOpen={setOpen} children={<AddDocument operation='Add' getAllDocuments={getAllDocuments} setOpen={setOpen} />} />
        <CustomModal open={editOpen} setOpen={setEditOpen} children={<EditLibrarian librarians={librarians} getAllDocuments={getAllDocuments} setOpen={setEditOpen} />} />
      </Grid>
    </>
  );
};

export default Documents;

interface AddProps {
  operation: Operation;
  librarian?: Librarian;
  getAllDocuments?: RefetchFunction<any, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDocument = ({ librarian, operation, getAllDocuments, setOpen }: AddProps) => {
  const { open, severity, message, openSnackBar } = useSnackBar();
  const [{ data: __, loading: loading, error: error }, postDocument ] = useAxios(
    {
      method: 'POST',
      url: 'http://localhost:8080/document',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    { 
      manual: true
    }
  );

  const [{ data: _, loading: updatedLoading, error: updatedError }, putBook ] = useAxios(
    {
      method: 'PUT',
      url: 'http://localhost:8080/librarian',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    { 
      manual: true
    }
  );

  const [document, setDocument] = useState<Document>({
    documentType: 'BOOK'
  });

  // useEffect(() => {
  //   if (librarian) {
  //     setUser(librarian.user);
  //   }
  // }, [librarian]);

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: Document = document;
    if (operation === 'Add') {
      await postDocument({
        data
      });
      openSnackBar('success', 'Successfully created librarian');
    } else {
      await putBook({
        data
      });
      openSnackBar('success', 'Successfully updated librarian');
    }
    getAllDocuments?.();
    setTimeout(setOpen, 2000);
  };

  useEffect(() => {
    console.log(document);
  }, [document]);

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
        <Grid item xs={12} sm={12}>
          <Autocomplete
            value={document.documentType}
            onChange={(event, value, reason) => {
              console.log(value);
              setDocument((oldDocument) => {
                return {
                  ... oldDocument,
                  documentType: value as TypeOfDocument,
                };
              });
            }}
            options={['BOOK', 'MAGAZINE', 'JOURNAL_ARTICLE', 'THESIS','REPORT']} 
            renderInput={(params) => <TextField {...params} label="User Type" />}
          />
        </Grid>
        {/* <Grid item xs={12}>
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
        </Grid> */}
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
  getAllDocuments?: RefetchFunction<any, any>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditLibrarian = ({librarians, getAllDocuments, setOpen}: EditProps) => {
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
        renderInput={(params) => <TextField {...params} label="Choose User" />} />
      {librarian && <AddDocument librarian={librarian} operation={'Edit'} getAllDocuments={getAllDocuments} setOpen={setOpen} />}
    </>
  );
};