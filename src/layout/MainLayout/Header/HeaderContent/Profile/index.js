import PropTypes from 'prop-types';


// material-ui

import {
  // Avatar,
  Box,
  Stack,
  Typography
} from '@mui/material';



// assets
// import avatar1 from 'assets/images/users/avatar-1.png';


// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};


// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {



  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          {/* <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} /> */}
          <Typography variant="subtitle1">{name}</Typography>
        </Stack>
    


    </Box>
  );
};

export default Profile;
