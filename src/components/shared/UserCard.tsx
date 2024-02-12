import { Box, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import moment from 'moment';
import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usePaginationList } from '../../hooks';
import { DeletedUserList, getDynamicPath, Pathes, UserList, UserObj } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';

interface UserCardImportion extends PropsWithChildren {
  user: UserObj;
  index: number;
  listInstance: ReturnType<typeof usePaginationList<UserList | DeletedUserList>>;
}

const UserCard: FC<UserCardImportion> = ({ user, index, listInstance }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const isUserEqualToCurrentUser = auth.isUserEqualToCurrentUser(user);
  const isCurrentOwner = auth.isCurrentOwner();

  return (
    <Card
      variant="outlined"
      sx={{
        my: '20px',
        position: 'relative',
        overflow: 'visible',
        backgroundColor: isUserEqualToCurrentUser ? '#F8F8F8' : '',
      }}
      onClick={() => {
        const path = user.deletedAt ? Pathes.DELETED_USER : Pathes.USER;
        navigate(getDynamicPath(path, { id: user.id.toString() }));
      }}
    >
      <ListItemButton>
        <ListItem disablePadding sx={{ my: '10px' }}>
          <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap="10px">
            <Box
              component="div"
              mb={'8px'}
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap="10px"
              flexWrap="wrap"
            >
              {isCurrentOwner && !user.deletedAt && (
                <ListItemText
                  sx={{
                    flex: 'unset',
                    width: '10px',
                    height: '10px',
                    backgroundColor: auth.getUserStatusColor(user.id),
                    borderRadius: '50%',
                  }}
                  secondary={<Box component="span"></Box>}
                />
              )}
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 'bold' }}
                sx={{ margin: '0' }}
                primary={`${user.firstName} ${user.lastName}`}
              />
            </Box>
            <Box component="div">
              <ListItemText
                sx={{ margin: '0' }}
                secondary={
                  <Typography component={'p'} sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <Typography component={'span'} sx={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                      Email:{' '}
                    </Typography>
                    {user.email}
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
                      Phone:{' '}
                    </Typography>
                    {user.phone}
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
                      Role:{' '}
                    </Typography>
                    {user.role}
                  </Typography>
                }
              />
            </Box>

            <Box component="div" display="flex" alignItems="center" justifyContent="end" width="100%" flexWrap="wrap">
              <ListItemText
                sx={{ flex: 'unset' }}
                secondaryTypographyProps={{ fontSize: '10px' }}
                secondary={
                  user.deletedAt
                    ? `${moment(user.deletedAt).format('lll')} was deleted`
                    : new Date(user.updatedAt) > new Date(user.createdAt)
                    ? `${moment(user.updatedAt).format('lll')} was updated`
                    : `${moment(user.createdAt).format('lll')}`
                }
              />
            </Box>
          </Box>
          <CountBadge take={listInstance.getTake()} page={listInstance.getPage()} index={index} />
        </ListItem>
      </ListItemButton>
    </Card>
  );
};

export default UserCard;
