import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import useAxios, { RefetchFunction } from 'axios-hooks';
import { useEffect, useState } from 'react';
import { Librarian, Member } from '../../models/librarian';
import { User } from '../../models/user';
import TokenService from '../services/token.service';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Operation } from './user.component';

interface AddProps {
  operation: Operation;
  userType: User['userType'];
  librarians?: Librarian[];
  members?: Member[];
  getAll?: RefetchFunction<any, any>;
  post?: RefetchFunction<any, any>;
  put?: RefetchFunction<any, any>;
  remove?: RefetchFunction<any, any>;
  loading?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddUser = ({ userType, librarians, members, getAll, operation, post, put, remove, loading, setOpen }: AddProps) => {
  const { open, severity, message, openSnackBar } = useSnackBar();
  const [user, setUser] = useState<User>({});
  const [librarian, setLibrarian] = useState<Librarian | null>( null);
  const [member, setMember] = useState<Member>({});

  useEffect(() => {
    if (librarian?.user) {
      setUser(librarian?.user);
    }
    if (member?.user) {
      setUser(member?.user);
    }
  }, [librarian, member]);

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: Librarian | Member = {
      id: userType === 'LIBRARIAN' ? librarian?.id : member.id,
      user: user,
      librarian: member.librarian,
    };
    if (operation === 'Add') {
      await post?.({ data });
      openSnackBar('success', `Successfully created ${userType}`);
    } else if (operation === 'Edit') {
      await put?.({ data });
      openSnackBar('success', `Successfully updated ${userType}`);
    } else {
      await remove?.({ data });
      openSnackBar('success', `Successfully deleted ${userType}`);
    }
    getAll?.();
    setTimeout(setOpen, 2000);
  };

  useEffect(() => {
    
  }, []);

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
        {operation !== 'Add' && librarians ? (
          <Grid item xs={12}>
            <Autocomplete 
              options={librarians}
              value={librarian}
              onChange={(event, value: Librarian | null, reason) => {
                value && setLibrarian(value);
              }}
              getOptionLabel={(option: Librarian) => {
                const userOption: User = option.user || {};
                return userOption.firstName + ' ' + userOption.lastName + `(${userOption.username})`;
              }}
              renderInput={(params) => <TextField {...params} label="Choose User" />}/>
          </Grid>
        ) : members && (
          <Grid item xs={12}>
            <Autocomplete 
              options={members}
              value={member}
              onChange={(event, value: Member | null, reason) => {
                value && setMember(value);
              }}
              getOptionLabel={(option: Member) => {
                const userOption: User = option.user || {};
                return userOption.firstName + ' ' + userOption.lastName + `(${userOption.username})`;
              }}
              renderInput={(params) => <TextField {...params} label="Choose User" />}/>
          </Grid>
        )}
        {operation !== 'Delete' && (
          <>
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
                placeholder="First Name"
                autoComplete="firstName"
                autoFocus
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField
                fullWidth
                id="middleName"
                placeholder="Middle Name"
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
                placeholder="Last Name"
                name="lastName"
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="date of birth"
                  value={user?.dobString ? new Date(user.dobString) : new Date()}
                  onChange={(value) => {
                    setUser((oldUser) => {
                      return {
                        ...oldUser,
                        dob: value?.toISOString(),
                        dobString: value?.toISOString()
                      };
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            {operation === 'Add' && userType === 'MEMBER' && librarians && (
              <Grid item xs={12}>
                <Autocomplete 
                  options={librarians}
                  value={member.librarian}
                  onChange={(event, value: Librarian | null, reason) => {
                    value && setMember((oldMember) => {
                      return {
                        ...oldMember,
                        librarian: value
                      };
                    });
                  }}
                  getOptionLabel={(option: Librarian) => {
                    const userOption: User = option.user || {};
                    return userOption.firstName + ' ' + userOption.lastName + `(${userOption.username})`;
                  }}
                  renderInput={(params) => <TextField {...params} label="Choose Librarian" />}/>
              </Grid>
            )}
          </>
        )}
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
            {operation === 'Add' ? 'Add': operation === 'Edit' ? 'Edit' : 'Delete'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};