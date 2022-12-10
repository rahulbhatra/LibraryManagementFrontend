import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import { BorrowReturn } from '../../models/borrow-return';
import { Copy, Thesis, TypeOfDocument } from '../../models/document.model';
import { AllDocs, Operation } from '../document/documents';
import TokenService from '../services/token.service';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';


interface AddProps {
  existingDocument?: AllDocs;
  fetchDocument?: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

class ShowData extends Copy {

};

const AddReturn = ({ existingDocument, fetchDocument, setOpen }: AddProps) => {
  const { open, severity, message, openSnackBar } = useSnackBar();
  const [doc, setDoc] = useState<AllDocs | null>(existingDocument ? existingDocument : null);
  const [selectedBorrowReturn, setSelectedBorrowReturn] = useState<BorrowReturn | null>(null);

  const [{ data: borrowCopies, loading: borrowedCopiesLoading, error: borrowedCopiesError}, getAllBorrowed] = useAxios(
    {
      url: 'http://localhost:8080/copy/getAllBorrowed',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    {
      manual: true,
    }
  );

  const [{ data: borrowReturnData, loading: borrowReturnLoading, error: borrowReturnError}, createOrUpdateBorrowReturn] = useAxios(
    {
      url: 'http://localhost:8080/copy/createOrUpdateBorrowReturn',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    getAllBorrowed();
  }, []);

  useEffect(() => {
    if (borrowedCopiesError) {
      openSnackBar('error', borrowedCopiesError.message);
    }
  }, [borrowedCopiesError]);
    
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data : BorrowReturn = {
      ... selectedBorrowReturn,
      returnDate: new Date().toISOString()
    };
    await createOrUpdateBorrowReturn({data: data});
    fetchDocument?.();
    setTimeout(setOpen, 2000);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <CustomSnackBar open={open} severity={severity} message={message} />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        rowSpacing={2} columnSpacing={2}
      >
        
        <Grid item xs={12}>
          <Autocomplete 
            options={borrowCopies}
            value={selectedBorrowReturn}
            onChange={(event, value: BorrowReturn | null, reason) => {
              if(value) {
                setSelectedBorrowReturn(value);
              }
            }}
            getOptionLabel={(option: BorrowReturn) => {
              const copy = option?.copy;
              const optionLabel = 'Copy ID: ' + copy?.id + ' Room Number: ' + copy?.roomNumber + 
              ' Level: ' + copy?.level + ', Document ID: ' + copy?.document?.id;
              return optionLabel;
            }}
            renderInput={(params) => <TextField {...params} label="Select Copy" />} />
        </Grid>
        {/* {copies.map((copy: Copy, index: number) => {
          return (
            <>
              <Grid item xs={6} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="roomNumber"
                  type={'number'}
                  label="Room Number"
                  name="roomNumber"
                  autoComplete="family-name"
                  value={copy.roomNumber}
                  onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    setCopies((oldCopies) => {
                      return oldCopies.map((oCopy: Copy, idx: number) => {
                        if (idx === index) {
                          return {
                            ...oCopy,
                            roomNumber: parseInt(event.target.value)
                          };
                        } else {
                          return oCopy;
                        }
                      });
                    });
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="level"
                  label="Level"
                  name="level"
                  type={'number'}
                  autoComplete="family-name"
                  value={copy.level}
                  onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    setCopies((oldCopies) => {
                      return oldCopies.map((oCopy: Copy, idx: number) => {
                        if (idx === index) {
                          return {
                            ...oCopy,
                            level: parseInt(event.target.value)
                          };
                        } else {
                          return oCopy;
                        }
                      });
                    });
                  }}
                />
              </Grid>
            </>
          );
        })} */}
        {/* <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2, mr: 2 }}
            // disabled={loading}
            onClick={() => {
              setCopies((oCopies) => {
                const undefinedFields = oCopies.every((oCopy: Copy) => oCopy.roomNumber === undefined || oCopy.level === undefined);
                if (oCopies?.length > 0 && undefinedFields) {
                  openSnackBar('warning', 'Please Fill All Info Before Continuing');
                  return oCopies;
                } else {
                  return [...oCopies, {}];
                }
              });
            }}
          >
            Add Copy
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2, mr: 2 }}
            // disabled={loading}
            onClick={() => {
              setCopies((oCopies) => {
                return oCopies.splice(0, oCopies.length - 1);
              });
            }}
          >
            Remove Author
          </Button>
        </Grid> */}
        <Grid container 
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          xs={12}>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Return
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddReturn;
