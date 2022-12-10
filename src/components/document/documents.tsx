import { Autocomplete, AutocompleteRenderInputParams, Box, Button, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, Link, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import useAxios, { RefetchFunction } from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TokenService from '../services/token.service';
import CustomTable from '../table/table';
import CustomModal from '../modal/modal';
import Progress from '../progress/progress.component';
import { Delete, Edit } from '@mui/icons-material';
import { Book, Magazine, Thesis, TypeOfDocument } from '../../models/document.model';
export type AllDocs = Book | Magazine | Thesis
import AddDocument from './document.add';
import useFetchDocuments from '../../hooks/useFetchDocuments';

export type Operation = 'Add' | 'Edit' | 'Delete';

const Documents = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [operation, setOperation] = useState<Operation>('Add');
  const [type, setType] = useState<TypeOfDocument>('BOOK');
  const columns: string[] = ['title', 'edition', 'year', 'category', 'authorsList'];
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [authorTerm, setAuthorTerm] = useState<string | null>(null);
  const [combineSearch, setCombineSearch] = useState<boolean>(false);
  const { documents, documentsLoading, fetchDocuments } = useFetchDocuments();

  useEffect(() => {
    fetchDocuments(type, authorTerm, searchTerm);
  }, []);

  

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
          spacing={1}
        >
          <Grid item xs={1}>
            <IconButton 
              onClick={() => {
                setOpen(true);
                setOperation('Add');
              }}
            >
              <AddIcon />
            </IconButton>
            <IconButton 
              onClick={() => {
                setOpen(true);
                setOperation('Edit');
              }}
            >
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
          <Grid item xs={2}>
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
          <Grid 
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            item 
            xs={4}>
            <Typography variant='button'> Combine Search</Typography>
            <Checkbox value={combineSearch} onClick={(event) => {
              setCombineSearch(!combineSearch);
            }} />
          </Grid>
          <Grid item xs={combineSearch ? 4 : 2} style={{ width: combineSearch ? '64px' : '32px' }}>
            <TextField
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              placeholder={'Search By ' + (combineSearch ? 'Title / Author' : ' Title')}
            />
          </Grid>
          {!combineSearch && (
            <Grid item xs={2}>
              <TextField
                value={authorTerm}
                onChange={(event) => {
                  setAuthorTerm(event.target.value);
                }}
                placeholder={'Search By Author'}
              />
            </Grid>
          )}
          <Grid item xs={1}>
            <IconButton
              onClick={() => {
                fetchDocuments(type, authorTerm, searchTerm, combineSearch);
              }}
            >
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
        {documents && <CustomTable rows={documents} columns={columns} />}
        {operation === 'Add' && (<CustomModal open={open} setOpen={setOpen} children={<AddDocument operation={operation} fetchDocument={() => fetchDocuments(type, authorTerm, searchTerm)} setOpen={setOpen} />} />)}
        {operation === 'Edit' && (<CustomModal open={open} setOpen={setOpen} children={<AddDocument operation={operation} documents={documents} fetchDocument={() => fetchDocuments(type, authorTerm, searchTerm)} setOpen={setOpen} />} />)}
        {operation === 'Delete' && (<CustomModal open={open} setOpen={setOpen} children={<AddDocument operation={operation} documents={documents} fetchDocument={() => fetchDocuments(type, authorTerm, searchTerm)} setOpen={setOpen} />} />)}
      </Grid>
    </>
  );
};

export default Documents;