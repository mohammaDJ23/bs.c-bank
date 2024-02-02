import { Box, Typography, Button } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pathes } from '../../lib';

const EmptyList: FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="10px" mt="34px">
      <Typography fontSize={'16px'} fontWeight={'500'}>
        No bills were deleted yet.
      </Typography>
      <Button
        onClick={() => navigate(Pathes.BILLS)}
        sx={{ textTransform: 'capitalize' }}
        size="small"
        variant="contained"
      >
        Navigate to the bill list
      </Button>
    </Box>
  );
};

export default EmptyList;
