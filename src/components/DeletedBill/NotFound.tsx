import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { Pathes } from '../../lib';

const NotFound: FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="10px" mt="34px">
      <Typography fontSize={'16px'} fontWeight={'500'}>
        Not found the deleted bill
      </Typography>
      <Button
        onClick={() => navigate(Pathes.DELETED_bILLS)}
        sx={{ textTransform: 'capitalize' }}
        size="small"
        variant="contained"
      >
        Navigate To The Deleted Bill List
      </Button>
    </Box>
  );
};

export default NotFound;
