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
import { Edit } from '@mui/icons-material';
import useSnackBar, { CustomSnackBar } from '../snackbar/snackbar';
import { Book, Document, Magazine, Thesis, TypeOfDocument } from '../../models/document.model';
import { Author, Person } from '../../models/author.model';

export type Operation = 'Add' | 'Edit';

const Documents = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [type, setType] = useState<TypeOfDocument>('BOOK');
  const columns: string[] = ['id', 'title', 'edition', 'year', 'category', 'authorsList'];
  const [searchTerm, setSearchTerm] = useState<String | null>(null);
  const [{ data: documents, loading: documentsLoading, error: documentsError}, getAllDocuments] = useAxios(
    {
      url: 'http://localhost:8080/document/getAll',
      method: 'GET',
      headers: {
        'Authorization': TokenService.getAuthorization()
      }
    },
    {
      manual: true,
    }
  );

  const fetchDocument = () => {
    switch (type) {
    case 'BOOK':
      getAllDocuments({
        url: 'http://localhost:8080/document/getAll/book' + (searchTerm ? `?title=${searchTerm}`: '')
      });
      break;
    case 'JOURNAL_ARTICLE':
      getAllDocuments({
        url: 'http://localhost:8080/document/getAll/journalArticle'
      });
      break;
    case 'MAGAZINE':
      getAllDocuments({
        url: 'http://localhost:8080/document/getAll/book'
      });
      break;
    case 'REPORT':
      getAllDocuments({
        url: 'http://localhost:8080/document/getAll/book'
      });
      break;
    case 'THESIS':
      getAllDocuments({
        url: 'http://localhost:8080/document/getAll/book'
      });
      break;
  
    default:
      getAllDocuments({
        url: 'http://localhost:8080/document/getAll/book'
      });
  
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [type, searchTerm]);

  // useEffect(() => {
  //   if (librarians) {
  //     const documents = librarians.map((librarian: Librarian) => {
  //       return librarian.user;
  //     });
  //     setDocuments(documents);
  //   }
  // }, [librarians]);

  return (
    <>
      <Progress open = {documentsLoading} />
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
          spacing={2}
        >
          <Grid item xs={1}>
            <IconButton onClick={() => {setOpen(true);}} >
              <AddIcon />
            </IconButton>
            <IconButton onClick={() => {setEditOpen(true);}} >
              <Edit />
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              value={type}
              onChange={(event, value, reason) => {
                setType(value as TypeOfDocument);
              }}
              disableClearable
              options={['BOOK', 'MAGAZINE', 'JOURNAL_ARTICLE', 'THESIS','REPORT']} 
              renderInput={(params) => <TextField {...params} label="Document Type" />}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              label={'Search By Title'}
              placeholder={'Search By Title'}
            />
          </Grid>
        </Grid>
        {documents && <CustomTable rows={documents} columns={columns} />}
        <CustomModal open={open} setOpen={setOpen} children={<AddDocument operation='Add' fetchDocument={fetchDocument} setOpen={setOpen} />} />
        <CustomModal open={editOpen} setOpen={setEditOpen} children={<EditDocument documents={documents} fetchDocument={fetchDocument} setOpen={setEditOpen} />} />
      </Grid>
    </>
  );
};

export default Documents;

interface AddProps {
  operation: Operation;
  document?: AllDocs;
  fetchDocument?: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type AllDocs = Book | Magazine | Thesis

const AddDocument = ({ document, operation, fetchDocument, setOpen }: AddProps) => {
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

  const [doc, setDoc] = useState<AllDocs>(document ? document : {});
  const [type, setType] = useState<TypeOfDocument>('BOOK');
  const [authors, setAuthors] = useState<Person[]>([]);

  useEffect(() => {
    if (doc) {
      console.log(doc);
    }
  }, [doc]);

  useEffect(() => {
    if(document) {
      setDoc(document);
      const persons = document.authorsList?.map((author: Author) => {
        if (author?.person) {
          return author.person;
        } else {
          return {};
        }
      });
      persons && setAuthors(persons);
    }
  }, [document]);

  useEffect(() => {
    console.log(authors);
  }, [authors]);

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: Book = { 
      ... doc,
      authors: authors
    };

    if (operation === 'Add') {
      await postBook({
        data
      });
      openSnackBar('success', 'Successfully created book');
    } else {
      await putBook({
        data
      });
      openSnackBar('success', 'Successfully updated book');
    }
    fetchDocument?.();
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
            {operation === 'Add' ? 'Add': 'Update'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

interface EditProps {
  documents: AllDocs[];
  fetchDocument?: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditDocument = ({documents, fetchDocument, setOpen}: EditProps) => {
  const [document, setDocument] = useState<AllDocs | null>(null);

  useEffect(() => {
    console.log(document);
  }, [document]);

  return (
    <>
      <Autocomplete 
        options={documents}
        value={document}
        onChange={(event, value: AllDocs | null, reason) => {
          setDocument(value);
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
      {document && <AddDocument document={document} operation={'Edit'} fetchDocument={fetchDocument} setOpen={setOpen} />}
    </>
  );
};