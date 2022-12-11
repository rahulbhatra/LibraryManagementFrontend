import useAxios from 'axios-hooks';
import TokenService from '../components/services/token.service';
import { TypeOfDocument } from '../models/document.model';

const useFetchDocuments = () => {
  const [{ data: documents, loading: documentsLoading, error: documentsError}, getAllDocuments] = useAxios(
    {
      url: 'http://localhost:8080/document/getAll',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + TokenService.getLocalAccessToken()
      }
    },
    {
      manual: true,
    }
  );

  const fetchDocuments = (type: TypeOfDocument, authorTerm: string | null, searchTerm: string | null, combinedSearch?: boolean) => {
    switch (type) {
    case 'BOOK':
      getAllDocuments({
        url: 'http://localhost:8080/document/getAll/book',
        data: {
          'author': authorTerm,
          'title': searchTerm,
          'combinedSearch': combinedSearch,
          'searchTerm': searchTerm,
        }
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

  return {
    documents, documentsLoading, fetchDocuments
  };
};

export default useFetchDocuments;