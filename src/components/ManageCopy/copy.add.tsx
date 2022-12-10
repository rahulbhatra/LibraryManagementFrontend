import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import { useState } from 'react';
import { Copy, Thesis, TypeOfDocument } from '../../models/document.model';
import { AllDocs } from '../document/documents';
import TokenService from '../services/token.service';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';
import { Operation } from '../user/user.component';

interface AddProps {
  operation: Operation;
  existingDocument?: AllDocs;
  documents?: any;
  fetchDocument?: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddCopy = ({ existingDocument, documents, operation, fetchDocument, setOpen }: AddProps) => {

  const { open, severity, message, openSnackBar } = useSnackBar();
  const [doc, setDoc] = useState<AllDocs | null>(existingDocument ? existingDocument : null);
  const [type, setType] = useState<TypeOfDocument>('BOOK');
  const [copies, setCopies] = useState<Copy[]>([]);
  const [document, setDocument] = useState<Document>();

  const [{ data: copiesData, loading: copiesLoading, error: copiesError }, insertCopies] = useAxios(
    {
      method: 'POST',
      url: 'http://localhost:8080/copy/createOrUpdateCopies',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    { 
      manual: true
    }
  );
    
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = copies.map((copy) => { 
      return {
        ... copy,
        document: doc?.document
      };
    });
    await insertCopies({ data: {copies: data} });
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
        {copies.map((copy: Copy, index: number) => {
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
        })}
        <Grid
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
        </Grid>
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

export default AddCopy;