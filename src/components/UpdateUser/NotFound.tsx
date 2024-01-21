import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAuth } from '../../hooks';
import { getDynamicPath, Pathes } from '../../lib';

const NotFound: FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const decodedToken = auth.getDecodedToken()!;

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="10px" mt="50px">
      <Typography fontSize={'16px'} fontWeight={'500'}>
        Not found the user
      </Typography>

      <Button
        onClick={() => navigate(getDynamicPath(Pathes.USER, { id: decodedToken.id.toString() }))}
        sx={{ textTransform: 'capitalize' }}
        variant="contained"
        size="small"
      >
        Navigate To The User Page
      </Button>
    </Box>
  );
};

export default NotFound;
