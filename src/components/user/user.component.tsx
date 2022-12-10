import { Autocomplete, Box, Button, CircularProgress, FormControlLabel, Grid, IconButton, Link, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import useAxios, { RefetchFunction } from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { Librarian, Member } from '../../models/librarian';
import { User } from '../../models/user';
import AddIcon from '@mui/icons-material/Add';
import TokenService from '../services/token.service';
import CustomTable from '../table/table';
import CustomModal from '../modal/modal';
import Progress from '../progress/progress.component';
import { Edit, Delete } from '@mui/icons-material';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';
import { AddUser } from './addUser.component';

export type Operation = 'Add' | 'Edit' | 'Delete';

const UserComponent = () => {

  const [open, setOpen] = useState<boolean>(false);
  const [operation, setOperation] = useState<Operation>('Add');
  const [userType, setUserType] = useState<User['userType']>('LIBRARIAN');
  const userTypes: User['userType'][] = ['LIBRARIAN', 'MEMBER'];
  const columns: string[] = ['id', 'firstName', 'lastName',
    'phoneNumber', 'dob', 'age', 'address1', 'address2',
    'city', 'state', 'zipCode', 'username'];
  const [users, setUsers] = useState<User[]>([]);
  const [librarians, setLibrarians] = useState<Librarian[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [{ data: librariansOrMembers, loading: librariansLoading, error: librariansError}, getAll] = useAxios(
    {
      url: `http://localhost:8080/user/getAll${ userType === 'LIBRARIAN' ? 'Librarians' : 'Members'}`,
      method: 'GET',
      headers: {
        'Authorization': TokenService.getAuthorization()
      }
    },
    {
      manual: true,
    }
  );

  const [{ data: __, loading: loading, error: error }, post ] = useAxios(
    {
      method: 'POST',
      url: `http://localhost:8080/user/${ userType === 'LIBRARIAN' ? 'librarian' : 'member'}`,
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    { 
      manual: true
    }
  );

  const [{ data: _, loading: updatedLoading, error: updatedError }, put ] = useAxios(
    {
      method: 'PUT',
      url: `http://localhost:8080/user/${ userType === 'LIBRARIAN' ? 'librarian' : 'member'}`,
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    { 
      manual: true
    }
  );

  const [{ data: removeData, loading: removeLoading, error: removeError }, remove ] = useAxios(
    {
      method: 'DELETE',
      url: `http://localhost:8080/user/${ userType === 'LIBRARIAN' ? 'librarian' : 'member'}`,
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    { 
      manual: true
    }
  );

  useEffect(() => {
    getAll();
  }, [userType]);

  // console.log(librariansLoading);

  useEffect(() => {
    const users : User[] = librariansOrMembers?.map((librariansOrMember: Librarian | Member) => librariansOrMember?.user);
    userType === 'LIBRARIAN' && setLibrarians(librariansOrMembers);
    userType === 'MEMBER' && setMembers(librariansOrMembers);
    setUsers(users || []);
  }, [userType, librariansOrMembers]);

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
          <Grid item xs={2}>
            <IconButton 
              onClick={() => {
                setOpen(true);
                setOperation('Add');
              }} >
              <AddIcon />
            </IconButton>
            <IconButton 
              onClick={() => {
                setOpen(true);
                setOperation('Edit');
              }} >
              <Edit />
            </IconButton>
            <IconButton 
              onClick={() => {
                setOpen(true);
                setOperation('Delete');
              }}>
              <Delete />
            </IconButton>
          </Grid>
          <Grid item xs={4}>
            <Autocomplete 
              disableClearable
              options={userTypes}
              value={userType}
              onChange={(event, value: User['userType'] | undefined | null, reason) => {
                value && setUserType(value);
              }}
              getOptionLabel={(option: User['userType']) => {
                return option?.toString() + '';
              }}
              renderInput={(params) => <TextField {...params} label="Choose User Type" />} />
          </Grid>
        </Grid>
        <CustomTable rows={users} columns={columns} />
        {operation === 'Add' && <CustomModal open={open} setOpen={setOpen} children={<AddUser userType={userType} operation='Add' librarians={librarians} getAll={getAll} setOpen={setOpen} post={post}/>} />}
        {operation === 'Edit' && <CustomModal open={open} setOpen={setOpen} children={<AddUser userType={userType} operation='Edit' librarians={librariansOrMembers} getAll={getAll} setOpen={setOpen} put={put} />} />}
        {operation === 'Delete' && <CustomModal open={open} setOpen={setOpen} children={<AddUser userType={userType} operation='Delete' librarians={librariansOrMembers} getAll={getAll} setOpen={setOpen} remove={remove} />} />}
      </Grid>
    </>
  );
};

export default UserComponent;