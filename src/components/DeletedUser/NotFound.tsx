import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAuth } from '../../hooks';
import { Pathes } from '../../lib';

const NotFound: FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const isCurrentOwner = auth.isCurrentOwner();
  const decodedTOken = auth.getDecodedToken()!;

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="10px" mt="34px">
      <Typography fontSize={'16px'} fontWeight={'500'}>
        Not found the user
      </Typography>
      {isCurrentOwner ? (
        <Button
          onClick={() => navigate(Pathes.USERS)}
          sx={{ textTransform: 'capitalize' }}
          size="small"
          variant="contained"
        >
          Navigate To The User List
        </Button>
      ) : (
        <Button
          onClick={() => navigate(Pathes.USERS, { state: { previousUserId: decodedTOken.id } })}
          sx={{ textTransform: 'capitalize' }}
          variant="contained"
          size="small"
        >
          Navigate To The User Page
        </Button>
      )}
    </Box>
  );
};

export default NotFound;
