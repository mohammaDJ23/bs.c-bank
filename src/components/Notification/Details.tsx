import { Box, Typography } from '@mui/material';
import moment from 'moment';
import { FC } from 'react';
import { NotificationObj } from '../../lib';

interface DetailsImporation {
  notification: NotificationObj;
}

const Details: FC<DetailsImporation> = ({ notification }) => {
  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Typography component={'p'} fontSize="14px" fontWeight={'bold'} mb={'15px'}>
          {notification.user.firstName} {notification.user.lastName}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Role:
          </Typography>{' '}
          {notification.user.role}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Device description:
          </Typography>{' '}
          {notification.deviceDescription}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Endpoint url:
          </Typography>{' '}
          {notification.endpoint}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Visitor id:
          </Typography>{' '}
          {notification.visitorId}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            P256dh:
          </Typography>{' '}
          {notification.p256dh}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Auth:
          </Typography>{' '}
          {notification.auth}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            User agent:
          </Typography>{' '}
          {notification.userAgent}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Created at:
          </Typography>{' '}
          {moment(notification.createdAt).format('LLLL')}
        </Typography>
      </Box>
    </>
  );
};

export default Details;
