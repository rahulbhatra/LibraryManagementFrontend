import { Grid, Paper } from '@mui/material';
import useAxios from 'axios-hooks';
import TokenService from '../services/token.service';
import CustomTable from '../table/table';

const Documents = () => {
  const {} = useAxios(
    {
      url: 'http://localhost:8080/book/createBook',
      method: 'POST',
      headers: {
        Authorization: 'Bearer' + TokenService.getLocalRefreshToken()
      }
    },
    { manual: true }
  );
  // const columns: Column[] = [
  //   {
  //     field: "id",
  //     headerName: "";
  //     width: number;
  //   }
  // ];
  return (
    // <CustomTable rows={[]} columns={} />
    <>Table will be here</>
  );
};

export default Documents;