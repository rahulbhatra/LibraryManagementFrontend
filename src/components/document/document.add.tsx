import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import { Author, Person } from '../../models/author.model';
import { Book, Thesis, TypeOfDocument } from '../../models/document.model';
import TokenService from '../services/token.service';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';
import { Operation } from '../user/user.component';
import { AllDocs } from './documents';

interface AddProps {
  operation: Operation;
  existingDocument?: AllDocs;
  documents?: any;
  fetchDocument?: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDocument = ({ existingDocument, documents, operation, fetchDocument, setOpen }: AddProps) => {
  const { open, severity, message, openSnackBar } = useSnackBar();
  const [{ data: __, loading: loading, error: error }, postBook ] = useAxios(
    {
      method: 'POST',
      url: 'http://localhost:8080/document/book',
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
      url: 'http://localhost:8080/document/book',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    { 
      manual: true
    }
  );

  const [{ data: deleteData, loading: deleteLoading, error: deleteError }, deleteDoc] = useAxios(
    {
      method: 'DELETE',
      url: 'http://localhost:8080/document',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    { 
      manual: true
    }
  );

  const [doc, setDoc] = useState<AllDocs | null>(existingDocument ? existingDocument : null);
  const [type, setType] = useState<TypeOfDocument>('BOOK');
  const [authors, setAuthors] = useState<Person[]>([]);
  const [document, setDocument] = useState<Document>();

  useEffect(() => {
    if (doc) {
      console.log(doc);
    }
  }, [doc]);

  useEffect(() => {
    if(existingDocument) {
      setDoc(existingDocument);
      const persons = existingDocument.authorsList?.map((author: Author) => author?.person || {});
      persons && setAuthors(persons);
    }
  }, [document]);

  useEffect(() => {
    console.log(authors);
  }, [authors]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: AllDocs = { 
      ... doc,
      authors: authors
    };

    if (operation === 'Add') {
      await postBook({
        data
      });
      openSnackBar('success', `Successfully created ${doc?.document?.documentType}`);
    } else if (operation === 'Edit') {
      await putBook({
        data
      });
      openSnackBar('success', `Successfully updated ${doc?.document?.documentType}`);
    } else {
      await deleteDoc({
        data: { id: doc?.document?.id}
      });
      openSnackBar('success', `Successfully deleted ${doc?.document?.documentType}`);
    }
    fetchDocument?.();
    setTimeout(setOpen, 2000);
  };

  useEffect(() => {
    console.log(document);
  }, [document]);

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
        {operation !== 'Add' && (
          <Grid item xs={12}>
            <Autocomplete 
              options={documents}
              value={doc}
              onChange={(event, value: AllDocs | null, reason) => {
                value && setDoc(value);
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
        )}
        {operation !== 'Delete' && (
          <>
            {!document && (
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  value={type}
                  onChange={(event, value, reason) => {
                    console.log(value);
                    setType(value as TypeOfDocument);
                  }}
                  options={['BOOK', 'MAGAZINE', 'JOURNAL_ARTICLE', 'THESIS','REPORT']} 
                  renderInput={(params) => <TextField {...params} label="Document Type" />}
                />
              </Grid>
            )}
            {!(doc instanceof Thesis) && (
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="title"
                    value={doc?.title}
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setDoc((oldBook) => {
                        return {
                          ...oldBook,
                          title: event.target.value
                        };
                      });
                    }}
                    label="Title"
                    autoComplete="title"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="edition"
                    value={doc?.edition}
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setDoc((oldBook) => {
                        return {
                          ...oldBook,
                          edition: +event.target.value
                        };
                      });
                    } }
                    label="Edition"
                    autoComplete="edition"
                    autoFocus />
                </Grid><Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="year"
                    value={doc?.year}
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setDoc((oldBook) => {
                        return {
                          ...oldBook,
                          year: +event.target.value
                        };
                      });
                    } }
                    label="Year"
                    autoComplete="year"
                    autoFocus />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="category"
                    value={doc?.category}
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      setDoc((oldBook) => {
                        return {
                          ...oldBook,
                          category: event.target.value
                        };
                      });
                    }}
                    label="Category"
                    autoComplete="category"
                    autoFocus
                  />
                </Grid>
              </>
            )}
            {authors.map((author: Person, index: number) => {
              return (
                <>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      autoComplete="family-name"
                      value={author.firstName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setAuthors((oldAuthors) => {
                          const newAuthors = oldAuthors.map((oldAuthor: Person, idx: number) => {
                            if (idx === index) {
                              return {
                                ...oldAuthor,
                                firstName: event.target.value 
                              };
                            } else {
                              return oldAuthor;
                            }
                          });
                          return newAuthors;
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      fullWidth
                      id="middleName"
                      label="Middle Name"
                      name="middleName"
                      autoComplete="family-name"
                      value={author.middleName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setAuthors((oldAuthors) => {
                          const newAuthors = oldAuthors.map((oldAuthor: Person, idx: number) => {
                            if (idx === index) {
                              return {
                                ...oldAuthor,
                                middleName: event.target.value 
                              };
                            } else {
                              return oldAuthor;
                            }
                          });
                          return newAuthors;
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
                      value={author.lastName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setAuthors((oldAuthors) => {
                          const newAuthors = oldAuthors.map((oldAuthor: Person, idx: number) => {
                            if (idx === index) {
                              return {
                                ...oldAuthor,
                                lastName: event.target.value 
                              };
                            } else {
                              return oldAuthor;
                            }
                          });
                          return newAuthors;
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
                disabled={loading}
                onClick={() => {
                  setAuthors((oldAuthors) => {
                    return [...oldAuthors, {}];
                  });
                }}
              >
            Add Author
              </Button>
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2, mr: 2 }}
                disabled={loading}
                onClick={() => {
                  setAuthors((oldAuthors) => {
                    return oldAuthors.splice(0, oldAuthors.length - 1);
                  });
                }}
              >
            Remove Author
              </Button>
            </Grid>
          </>
        )}
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
            disabled={loading}
          >
            {operation === 'Add' ? 'Add': operation === 'Edit' ? 'Update' : 'Delete'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddDocument;