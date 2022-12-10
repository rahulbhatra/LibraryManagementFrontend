import { Add, Delete, Search } from '@mui/icons-material';
import { Autocomplete, Button, Grid, IconButton, TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import useFetchDocuments from '../../hooks/useFetchDocuments';
import { BorrowReturn } from '../../models/borrow-return';
import { Copy, TypeOfDocument } from '../../models/document.model';
import CustomModal from '../modal/modal';
import Progress from '../progress/progress.component';
import TokenService from '../services/token.service';
import CustomTable from '../table/table';
import AddBorrow from './AddBorrow';
import AddReturn from './AddReturn';

type Operation = 'Borrow' |  'Return';
type View = 'All Docs' | 'All Borrowed';

type BorrowViewData = {
  borrowedBy?: String;
  copyId?: number;
  roomNumber?: number;
  level?: number;
  borrowDate?: String;
  dueDate?: String;
  returnDate?: String;
  isOverDue?: 'Yes' | 'No';
};

const BorrowReturnComponent = () => {
  const columns: string[] = ['title', 'edition', 'year', 'category', 'authorsList', 'totalCopies'];
  const borrowColumns: string[] = ['borrowedBy', 'copyId', 'roomNumber', 'level', 'borrowDate', 'dueDate', 'returnDate', 'isOverDue'];
  const { documents, documentsLoading, fetchDocuments } = useFetchDocuments();
  const [open, setOpen] = useState<boolean>(false);
  const [operation, setOperation] = useState<Operation>('Borrow');
  const [view, setView] = useState<View>('All Docs');
  const [type, setType] = useState<TypeOfDocument>('BOOK');
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [authorTerm, setAuthorTerm] = useState<string | null>(null);
  const [borrowViews, setBorrowViews] = useState<BorrowViewData[]>([]);

  useEffect(() => {
    const fetch =async () => {
      const data = await fetchDocuments('BOOK', null, null);
      console.log(data);
    };
    fetch();
  }, []);

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

  useEffect(() => {
    if (view === 'All Borrowed') {
      getAllBorrowed();
    } else {
      fetchDocuments('BOOK', null, null);
    }
  }, [view]);

  useEffect(() => {
    if (borrowCopies) {
      const borrowViewDatas: BorrowViewData[] = 
      borrowCopies?.map((borrowCopy: BorrowReturn) => {
        const borrowViewData: BorrowViewData = {
          borrowedBy: borrowCopy?.borrowedBy?.user?.username,
          copyId: borrowCopy?.copy?.id,
          roomNumber: borrowCopy?.copy?.roomNumber,
          level: borrowCopy?.copy?.level,
          borrowDate: borrowCopy?.borrowDateString,
          dueDate: borrowCopy?.dueDateString,
          returnDate: borrowCopy?.returnDateString,
          isOverDue: borrowCopy.isOverdue ? 'Yes' : 'No',
        };
        return borrowViewData;
      });
      setBorrowViews(borrowViewDatas);
    }
  }, [borrowCopies]);

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
          <Grid 
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
            item 
            xs={12}>
            <Button
              variant='contained'
              onClick={() => {
                setView('All Docs');
              }}
            >
              Documents
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                setView('All Borrowed');
              }}
            >
              Borrowed
            </Button>
          </Grid>
          {view === 'All Docs' && (
            <>
              <Grid 
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                item 
                xs={3}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpen(true);
                    setOperation('Borrow');
                  }}
                >
              Borrow
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpen(true);
                    setOperation('Return');
                  }}
                >
              Return
                </Button>
              </Grid>
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
            </>  
          )}
          
        </Grid>
        {documents && view === 'All Docs' && <CustomTable rows={documents} columns={columns} />}
        {borrowViews && view === 'All Borrowed' && <CustomTable rows={borrowViews} columns={borrowColumns} />}
        {operation === 'Borrow' && (<CustomModal open={open} setOpen={setOpen} children={<AddBorrow operation={'Add'} documents={documents} fetchDocument={() => fetchDocuments(type, authorTerm, searchTerm)} setOpen={setOpen} />} />)}
        {operation === 'Return' && (<CustomModal open={open} setOpen={setOpen} children={<AddReturn fetchDocument={() => fetchDocuments(type, authorTerm, searchTerm)} setOpen={setOpen} />} />)}
      </Grid>
    </>
  );
  
};

export default BorrowReturnComponent;