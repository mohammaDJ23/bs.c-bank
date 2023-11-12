import { PropsWithChildren, FC } from 'react';
import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getDynamicPath, NotificationObj, Pathes } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';
import { useAuth, usePaginationList } from '../../hooks';

interface NotificationCardImportation extends PropsWithChildren {
  notification: NotificationObj;
  index: number;
  listInfo: ReturnType<ReturnType<typeof usePaginationList>['getFullInfo']>;
}

const NotificationCard: FC<NotificationCardImportation> = ({ notification, index, listInfo }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const isUserEqualToCurrentUser = auth.isUserEqualToCurrentUser(notification.user);

  return (
    <Card
      key={index}
      variant="outlined"
      sx={{
        my: '20px',
        position: 'relative',
        overflow: 'visible',
        backgroundColor: isUserEqualToCurrentUser ? '#F8F8F8' : '',
      }}
      onClick={() => {
        navigate(getDynamicPath(Pathes.NOTIFICATION, { id: notification.id }));
      }}
    >
      <ListItemButton>
        <ListItem disablePadding sx={{ my: '10px' }}>
          <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap="10px">
            <Box component="div">
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px', mb: '10px', fontWeight: 'bold' }}
                sx={{ margin: '0' }}
                primary={`${notification.user.firstName} ${notification.user.lastName}`}
              />
            </Box>

            <Box component="div">
              <ListItemText
                sx={{ margin: '0' }}
                secondary={
                  <Typography component={'p'} sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <Typography component={'span'} sx={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                      Device description:{' '}
                    </Typography>
                    {notification.deviceDescription}
                  </Typography>
                }
              />
            </Box>

            <Box component="div">
              <ListItemText
                sx={{ margin: '0' }}
                secondary={
                  <Typography component={'p'} sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <Typography component={'span'} sx={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                      Endpoint url:{' '}
                    </Typography>
                    {notification.endpoint}
                  </Typography>
                }
              />
            </Box>

            <Box component="div">
              <ListItemText
                sx={{ margin: '0' }}
                secondary={
                  <Typography component={'p'} sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <Typography component={'span'} sx={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                      Visitor id:{' '}
                    </Typography>
                    {notification.visitorId}
                  </Typography>
                }
              />
            </Box>

            <Box
              component="div"
              display="flex"
              alignItems="center"
              justifyContent="end"
              gap="10px"
              width="100%"
              flexWrap="wrap"
            >
              <ListItemText
                sx={{ flex: 'unset' }}
                secondaryTypographyProps={{ fontSize: '10px' }}
                secondary={
                  notification.updatedAt
                    ? `${moment(notification.updatedAt).fromNow()}`
                    : `${moment(notification.createdAt).fromNow()} was updated`
                }
              />
            </Box>
          </Box>

          <CountBadge index={index} page={listInfo.page} take={listInfo.take} />
        </ListItem>
      </ListItemButton>
    </Card>
  );
};

export default NotificationCard;
