import { Box, Typography, Button } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pathes } from '../../lib';

const EmptyList: FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="10px" mt="20px">
      <Typography fontSize={'16px'} fontWeight={'500'}>
        Empty List
      </Typography>
      <Button
        onClick={() => navigate(Pathes.DASHBOARD)}
        sx={{ textTransform: 'capitalize' }}
        size="small"
        variant="contained"
      >
        Navigate to your dashboard
      </Button>
    </Box>
  );
};

export default EmptyList;
