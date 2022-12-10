import { Add, Delete, Search } from '@mui/icons-material';
import { Autocomplete, Grid, IconButton, TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import useFetchDocuments from '../../hooks/useFetchDocuments';
import { TypeOfDocument } from '../../models/document.model';
import CustomModal from '../modal/modal';
import Progress from '../progress/progress.component';
import CustomTable from '../table/table';
import { Operation } from '../user/user.component';
import AddCopy from './copy.add';

const ManageCopy = () => {
  const columns: string[] = ['title', 'edition', 'year', 'category', 'authorsList', 'totalCopies'];
  const { documents, documentsLoading, fetchDocuments } = useFetchDocuments();
  const [open, setOpen] = useState<boolean>(false);
  const [operation, setOperation] = useState<Operation>('Add');
  const [type, setType] = useState<TypeOfDocument>('BOOK');
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [authorTerm, setAuthorTerm] = useState<string | null>(null);

  useEffect(() => {
    const fetch =async () => {
      const data = await fetchDocuments('BOOK', null, null);
      console.log(data);
    };
    fetch();
  }, []);

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
          <Grid item xs={0}>
            <IconButton 
              onClick={() => {
                setOpen(true);
                setOperation('Add');
              }}
            >
              <Add />
            </IconButton>
            {/* <IconButton 
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
            </IconButton> */}
          </Grid>
          {/* <Grid item xs={2}>
            <Autocomplete
              value={type}
              onChange={(event, value, reason) => {
                setType(value as TypeOfDocument);
              }}
              disableClearable
              options={['BOOK', 'MAGAZINE', 'JOURNAL_ARTICLE', 'THESIS','REPORT']} 
              renderInput={(params) => <TextField {...params} label="Document Type" />}
            />
          </Grid> */}
          <Grid item xs={2}>
            <TextField
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              placeholder={'Search By Title'}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              value={authorTerm}
              onChange={(event) => {
                setAuthorTerm(event.target.value);
              }}
              placeholder={'Search By Author'}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => {
                fetchDocuments(type, authorTerm, searchTerm);
              }}
            >
              <Search />
            </IconButton>
          </Grid>
        </Grid>
        {documents && <CustomTable rows={documents} columns={columns} />}
        {operation === 'Add' && (<CustomModal open={open} setOpen={setOpen} children={<AddCopy operation={operation} documents={documents} fetchDocument={() => fetchDocuments(type, authorTerm, searchTerm)} setOpen={setOpen} />} />)}
        {/* {operation === 'Edit' && (<CustomModal open={open} setOpen={setOpen} children={<AddDocument operation={operation} documents={documents} fetchDocument={() => fetchDocuments(type, authorTerm, searchTerm)} setOpen={setOpen} />} />)}
        {operation === 'Delete' && (<CustomModal open={open} setOpen={setOpen} children={<AddDocument operation={operation} documents={documents} fetchDocument={() => fetchDocuments(type, authorTerm, searchTerm)} setOpen={setOpen} />} />)} */}
      </Grid>
    </>
  );
  
};

export default ManageCopy;