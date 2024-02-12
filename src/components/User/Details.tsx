import { Box, Typography, Menu, MenuItem, IconButton, Button, CircularProgress } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import { DeleteUserApi, DeleteUserByOwnerApi, DownloadBillReportApi } from '../../apis';
import { UserWithBillInfoObj, UserObj, Pathes, getDynamicPath, LocalStorage } from '../../lib';
import { ModalNames, UsersStatusType } from '../../store';

interface DetailsImporation {
  user: UserWithBillInfoObj;
}

const Details: FC<DetailsImporation> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const auth = useAuth();
  const isUserOnline = auth.isUserOnline(user.id);
  const isCurrentOwner = auth.isCurrentOwner();
  const isCurrentAdmin = auth.isCurrentAdmin();
  const isCurrentUser = auth.isCurrentUser();
  const isOwner = auth.isOwner(user);
  const hasRoleAuthorized = auth.hasRoleAuthorized(user);
  const hasCreatedByOwnerRoleAuthorized = auth.hasCreatedByOwnerRoleAuthorized(user);
  const isUserEqualToCurrentUser = auth.isUserEqualToCurrentUser(user);
  const isDeleteUserApiProcessing = request.isApiProcessing(DeleteUserApi);
  const isDownloadBillReportApiProcessing = request.isApiProcessing(DownloadBillReportApi);
  const connectionSocket = selectors.userServiceSocket.connection;

  const getOptions = useCallback(() => {
    const options = [];

    if (isUserEqualToCurrentUser || isCurrentOwner) {
      options.push({
        label: 'Update',
        path: isCurrentOwner
          ? getDynamicPath(Pathes.UPDATE_USER_BY_OWNER, { id: user.id })
          : getDynamicPath(Pathes.UPDATE_USER, { id: user.id }),
      });
    }

    if (isUserEqualToCurrentUser || ((isCurrentAdmin || isCurrentUser) && isOwner) || isCurrentOwner) {
      options.push({
        label: 'Start a conversation',
        path: `${Pathes.CHAT}?uid=${user.id}`,
      });
    }

    return options;
  }, []);
  const options = getOptions();

  useEffect(() => {
    if (connectionSocket) {
      if (isCurrentOwner) {
        connectionSocket.emit('initial-user-status', { id: user.id });
        connectionSocket.on('initial-user-status', (data: UsersStatusType) => {
          const newUsersStatus = Object.assign({}, selectors.specificDetails.usersStatus, data);
          actions.setSpecificDetails('usersStatus', newUsersStatus);
        });

        connectionSocket.on('user-status', (data: UsersStatusType) => {
          if (data[user.id] && data[user.id].id === user.id) {
            const newUsersStatus = Object.assign({}, selectors.specificDetails.usersStatus, data);
            actions.setSpecificDetails('usersStatus', newUsersStatus);
          }
        });
      }

      return () => {
        connectionSocket.removeListener('initial-user-status');
        connectionSocket.removeListener('user-status');
      };
    }
  }, [connectionSocket, isCurrentOwner]);

  const onMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onMenuClick = useCallback(
    (option: (typeof options)[number]) => {
      return function () {
        onMenuClose();
        navigate(option.path);
      };
    },
    [onMenuClose, navigate]
  );

  const onDeleteAccount = useCallback(() => {
    actions.showModal(ModalNames.CONFIRMATION);
  }, []);

  const onLogoutUser = useCallback(() => {
    if (connectionSocket && isCurrentOwner) {
      connectionSocket.emit('logout-user', { id: user.id });
    }
  }, [connectionSocket, isCurrentOwner]);

  const deleteByUser = useCallback(() => {
    request
      .build<UserObj, number>(new DeleteUserApi())
      .then(response => {
        actions.hideModal(ModalNames.CONFIRMATION);
        LocalStorage.clear();
        navigate(Pathes.LOGIN);
      })
      .catch(err => actions.hideModal(ModalNames.CONFIRMATION));
  }, []);

  const deleteByOwner = useCallback(() => {
    request
      .build<UserObj, number>(new DeleteUserByOwnerApi(user.id))
      .then(response => {
        actions.hideModal(ModalNames.CONFIRMATION);
        if (isUserEqualToCurrentUser) {
          LocalStorage.clear();
          navigate(Pathes.LOGIN);
        } else {
          if (isUserOnline) {
            onLogoutUser();
          }
          navigate(Pathes.USERS);
        }
      })
      .catch(err => actions.hideModal(ModalNames.CONFIRMATION));
  }, [user, isUserEqualToCurrentUser]);

  const downloadBillReport = useCallback(() => {
    if (isDownloadBillReportApiProcessing) return;

    request.build<Blob>(new DownloadBillReportApi(user.id)).then(response => {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${user.firstName}-${user.lastName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  }, [isDownloadBillReportApiProcessing, user]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="20px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Box component={'div'} display="flex" alignItems="center" justifyContent="start" gap="10px" flexWrap="wrap">
            {isCurrentOwner && (
              <Box
                sx={{
                  flex: 'unset',
                  width: '10px',
                  height: '10px',
                  backgroundColor: auth.getUserStatusColor(user.id),
                  borderRadius: '50%',
                }}
                component={'span'}
              ></Box>
            )}
            <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
          {options.length > 0 && (
            <>
              <IconButton onClick={onMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClick={onMenuClose}>
                {options.map(option => (
                  <MenuItem key={option.path} onClick={onMenuClick(option)}>
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Email:
          </Typography>{' '}
          {user.email}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Phone:
          </Typography>{' '}
          {user.phone}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Role:
          </Typography>{' '}
          {user.role}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Created by:
          </Typography>{' '}
          {user.parent.firstName} {user.parent.lastName} ({user.parent.role}){' '}
          {user.parent.deletedAt && `was deleted at ${moment(user.parent.deletedAt).format('LLLL')}`}
        </Typography>
        {isCurrentOwner && (
          <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              Total created users:
            </Typography>{' '}
            {user.users.quantities}
          </Typography>
        )}
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Total bill quantities:
          </Typography>{' '}
          {user.bill.counts}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Total bill amounts:
          </Typography>{' '}
          {user.bill.amounts}
        </Typography>
        {isCurrentOwner &&
          (() => {
            const userLastConnection = auth.getUserLastConnection(user.id);
            if (userLastConnection) {
              return (
                <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
                  <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                    Last connection:
                  </Typography>{' '}
                  {moment(userLastConnection).format('LLLL')}
                </Typography>
              );
            }
            return <></>;
          })()}
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Created at:
          </Typography>{' '}
          {moment(user.createdAt).format('LLLL')}
        </Typography>
        {new Date(user.updatedAt) > new Date(user.createdAt) && (
          <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              Last update:
            </Typography>{' '}
            {moment(user.updatedAt).format('LLLL')}
          </Typography>
        )}
        {hasRoleAuthorized && (
          <Box display="flex" alignItems="center" gap="8px">
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              The bill report:
            </Typography>
            <Box display="flex" alignItems="center" gap="10px">
              <Typography
                fontSize="12px"
                color="#20a0ff"
                component="span"
                sx={{ cursor: 'pointer' }}
                onClick={downloadBillReport}
              >
                download
              </Typography>
              {isDownloadBillReportApiProcessing && <CircularProgress size={10} />}
            </Box>
          </Box>
        )}
        <Box mt="30px" display={'flex'} alignItems={'center'} gap={'10px'}>
          {hasRoleAuthorized && (
            <Button
              disabled={isDeleteUserApiProcessing}
              onClick={onDeleteAccount}
              variant="contained"
              color="error"
              size="small"
              sx={{ textTransform: 'capitalize' }}
            >
              Delete the account
            </Button>
          )}
          {hasCreatedByOwnerRoleAuthorized && isUserOnline && (
            <Button
              disabled={isDeleteUserApiProcessing}
              onClick={onLogoutUser}
              variant="outlined"
              color="primary"
              size="small"
              sx={{ textTransform: 'capitalize' }}
            >
              Logout the user
            </Button>
          )}
        </Box>
      </Box>

      <Modal
        title="Deleting the Account"
        body="Are you sure do delete the user account?"
        isLoading={isDeleteUserApiProcessing}
        isActive={selectors.modals[ModalNames.CONFIRMATION]}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => (isCurrentOwner ? deleteByOwner() : deleteByUser())}
      />
    </>
  );
};

export default Details;
