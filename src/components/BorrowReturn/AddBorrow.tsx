import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import { BorrowReturn } from '../../models/borrow-return';
import { Copy, Thesis, TypeOfDocument } from '../../models/document.model';
import { AllDocs, Operation } from '../document/documents';
import TokenService from '../services/token.service';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';


interface AddProps {
  operation: Operation;
  existingDocument?: AllDocs;
  documents?: any;
  fetchDocument?: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddBorrow = ({ existingDocument, documents, operation, fetchDocument, setOpen }: AddProps) => {
  const { open, severity, message, openSnackBar } = useSnackBar();
  const [doc, setDoc] = useState<AllDocs | null>(existingDocument ? existingDocument : null);
  const [copies, setCopies] = useState<Copy[]>([]);
  const [selectedCopy, setSelectedCopy] = useState<Copy | null>(null);

  const [{ data: members, loading: librariansLoading, error: librariansError}, getAll] = useAxios(
    {
      url: 'http://localhost:8080/user/getAllLibrarians}',
      method: 'GET',
      headers: {
        'Authorization': TokenService.getLocalAccessToken()
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
    if (borrowReturnError) {
      openSnackBar('error', borrowReturnError.message);
    }
  }, [borrowReturnError]);
    
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data : BorrowReturn = {
      copy: { ... selectedCopy },
      borrowDate: new Date().toISOString()
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
            options={documents}
            value={doc}
            onChange={(event, value: AllDocs | null, reason) => {
              if(value) {
                setDoc(value);
                setCopies(value?.copies || []);
              }
            }}
            getOptionLabel={(option: AllDocs) => {
              let optionLabel = '';
              if (!(option instanceof Thesis)) {
                optionLabel += option.title;
              }
              optionLabel += ' ' + option.document?.documentType;
              return optionLabel;
            }}
            renderInput={(params) => <TextField {...params} label="Search Document" />} />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete 
            options={copies}
            value={selectedCopy}
            onChange={(event, value: Copy | null, reason) => {
              if(value) {
                setSelectedCopy(value);
              }
            }}
            getOptionLabel={(option: Copy) => {
              const optionLabel = 'Copy ID: ' + option?.id + ' Room Number: ' + option?.roomNumber + 
              ' Level: ' + option?.level + ', Document ID: ' + option?.document?.id;
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
            {operation === 'Add' ? 'Add': operation === 'Edit' ? 'Update' : 'Delete'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddBorrow;
