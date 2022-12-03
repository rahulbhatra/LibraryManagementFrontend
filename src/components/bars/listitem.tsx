import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import React from 'react';
import TokenService from '../services/token.service';
import { User } from '../../models/user';

const MainListItems = () => {

  const isMember = TokenService.isMember();
  const isLibrarian = TokenService.isLibrarian();

  return (
    <React.Fragment>
      <ListItemButton href="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      {isLibrarian && (<ListItemButton href='/documents'>
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary="Documents" />
      </ListItemButton>
      )}
      {isLibrarian && (<ListItemButton href='/user'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="User" />
      </ListItemButton>
      )}
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItemButton>
    </React.Fragment>
  );
};

export default MainListItems;

// export const secondaryListItems = (
//   <React.Fragment>
//     <ListSubheader component="div" inset>
//       Saved reports
//     </ListSubheader>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItemButton>
//   </React.Fragment>
// );