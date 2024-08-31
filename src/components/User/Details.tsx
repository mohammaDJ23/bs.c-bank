import { Box, Typography, Menu, MenuItem, IconButton, Button, CircularProgress } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import { DeleteUserApi, DeleteUserByOwnerApi, DownloadBillReportApi } from '../../apis';
import { UserWithBillInfo, Pathes, getDynamicPath, LocalStorage } from '../../lib';
import { ModalNames, UsersStatusType } from '../../store';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface DetailsImporation {
  user: UserWithBillInfo;
}

const Details: FC<DetailsImporation> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const auth = useAuth();
  const snackbar = useSnackbar();
  const isUserOnline = auth.isUserOnline(user.id);
  const isCurrentOwner = auth.isCurrentOwner();
  const isCurrentAdmin = auth.isCurrentAdmin();
  const isCurrentUser = auth.isCurrentUser();
  const isOwner = auth.isOwner(user);
  const hasRoleAuthorized = auth.hasRoleAuthorized(user);
  const hasCreatedByOwnerRoleAuthorized = auth.hasCreatedByOwnerRoleAuthorized(user);
  const isUserEqualToCurrentUser = auth.isUserEqualToCurrentUser(user);
  const isDeleteUserApiProcessing = request.isApiProcessing(DeleteUserApi);
  const isDeleteUserApiFailed = request.isProcessingApiFailed(DeleteUserApi);
  const isDeleteUserApiSuccessed = request.isProcessingApiSuccessed(DeleteUserApi);
  const deleteUserApiExceptionMessage = request.getExceptionMessage(DeleteUserApi);
  const isDeleteUserByOwnerApiProcessing = request.isApiProcessing(DeleteUserByOwnerApi);
  const isDeleteUserByOwnerApiFailed = request.isProcessingApiFailed(DeleteUserByOwnerApi);
  const isDeleteUserByOwnerApiSuccessed = request.isProcessingApiSuccessed(DeleteUserByOwnerApi);
  const deleteUserByOwnerApiExceptionMessage = request.getExceptionMessage(DeleteUserByOwnerApi);
  const isDownloadBillReportApiProcessing = request.isApiProcessing(DownloadBillReportApi);
  const isDownloadBillReportApiFailed = request.isProcessingApiFailed(DownloadBillReportApi);
  const isDownloadBillReportApiSuccessed = request.isProcessingApiSuccessed(DownloadBillReportApi);
  const downloadBillReportApiExceptionMessage = request.getExceptionMessage(DownloadBillReportApi);
  const connectionSocket = selectors.userServiceSocket.connection;
  const downloadedBillReport = selectors.specificDetails.downloadedBillReport;

  const getOptions = useCallback(() => {
    const options = [];

    if (hasRoleAuthorized) {
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
    actions.deleteUser();
  }, [connectionSocket]);

  useEffect(() => {
    if (isDeleteUserApiSuccessed) {
      if (connectionSocket) {
        connectionSocket.disconnect();
      }
      actions.hideModal(ModalNames.CONFIRMATION);
      LocalStorage.clear();
      navigate(Pathes.LOGIN);
    } else if (isDeleteUserApiFailed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      snackbar.enqueueSnackbar({ message: deleteUserApiExceptionMessage, variant: 'error' });
    }
  }, [isDeleteUserApiFailed, isDeleteUserApiSuccessed, connectionSocket]);

  const deleteByOwner = useCallback(() => {
    actions.deleteUserByOwner(user.id);
  }, [user]);

  useEffect(() => {
    if (isDeleteUserByOwnerApiSuccessed) {
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
    } else if (isDeleteUserByOwnerApiFailed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      snackbar.enqueueSnackbar({ message: deleteUserByOwnerApiExceptionMessage, variant: 'error' });
    }
  }, [isDeleteUserByOwnerApiFailed, isDeleteUserByOwnerApiSuccessed, isUserEqualToCurrentUser, onLogoutUser]);

  const downloadBillReport = useCallback(() => {
    if (isDownloadBillReportApiProcessing) return;
    actions.downloadBillReport(user.id);
  }, [isDownloadBillReportApiProcessing, user]);

  useEffect(() => {
    if (isDownloadBillReportApiSuccessed && downloadedBillReport) {
      const href = URL.createObjectURL(downloadedBillReport);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${user.firstName}-${user.lastName}-${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } else if (isDownloadBillReportApiFailed && !downloadedBillReport) {
      snackbar.enqueueSnackbar({ message: downloadBillReportApiExceptionMessage, variant: 'error' });
    }
  }, [isDownloadBillReportApiFailed, isDownloadBillReportApiSuccessed, user, downloadedBillReport]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px" overflow="hidden">
        <Box overflow="hidden" mb="20px" width="100%">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Box
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              }}
              width="100%"
              display="flex"
              gap="8px"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                component={'div'}
                display="flex"
                alignItems="center"
                justifyContent="start"
                gap="10px"
                flexWrap="wrap"
              >
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
                    {options.map((option) => (
                      <MenuItem key={option.path} onClick={onMenuClick(option)}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          </ResetStyleWithAnimation>
        </Box>

        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.02s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Email:
              </Typography>{' '}
              {user.email}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>

        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.04s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Phone:
              </Typography>{' '}
              {user.phone}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>

        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.06s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Role:
              </Typography>{' '}
              {user.role}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>

        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.08s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Created by:
              </Typography>{' '}
              {user.parent.firstName} {user.parent.lastName} ({user.parent.role}){' '}
              {user.parent.deletedAt && `was deleted at ${moment(user.parent.deletedAt).format('LLLL')}`}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>

        {isCurrentOwner && (
          <Box overflow="hidden">
            <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
              <Typography
                sx={{
                  transform: 'translateY(100%)',
                  transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                  transitionDelay: '0.1s',
                }}
                component={'p'}
                fontSize="12px"
                color="rgba(0, 0, 0, 0.6)"
              >
                <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                  Total created users:
                </Typography>{' '}
                {user.users.quantities}
              </Typography>
            </ResetStyleWithAnimation>
          </Box>
        )}
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.12s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Total bill quantities:
              </Typography>{' '}
              {user.bill.counts}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>

        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.14s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Total bill amounts:
              </Typography>{' '}
              {user.bill.amounts}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>

        {isCurrentOwner &&
          (() => {
            const userLastConnection = auth.getUserLastConnection(user.id);
            if (userLastConnection) {
              return (
                <Box overflow="hidden">
                  <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
                    <Typography
                      sx={{
                        transform: 'translateY(100%)',
                        transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                        transitionDelay: '0.16s',
                      }}
                      component={'p'}
                      fontSize="12px"
                      color="rgba(0, 0, 0, 0.6)"
                    >
                      <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                        Last connection:
                      </Typography>{' '}
                      {moment(userLastConnection).format('LLLL')}
                    </Typography>
                  </ResetStyleWithAnimation>
                </Box>
              );
            }
            return <></>;
          })()}
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.18s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Created at:
              </Typography>{' '}
              {moment(user.createdAt).format('LLLL')}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>

        {new Date(user.updatedAt) > new Date(user.createdAt) && (
          <Box overflow="hidden">
            <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
              <Typography
                sx={{
                  transform: 'translateY(100%)',
                  transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                  transitionDelay: '0.2s',
                }}
                component={'p'}
                fontSize="12px"
                color="rgba(0, 0, 0, 0.6)"
              >
                <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                  Last update:
                </Typography>{' '}
                {moment(user.updatedAt).format('LLLL')}
              </Typography>
            </ResetStyleWithAnimation>
          </Box>
        )}
        {hasRoleAuthorized && (
          <Box overflow="hidden">
            <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
              <Box
                sx={{
                  transform: 'translateY(100%)',
                  transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                  transitionDelay: '0.22s',
                }}
                display="flex"
                alignItems="center"
                gap="8px"
              >
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
            </ResetStyleWithAnimation>
          </Box>
        )}
        <Box overflow="hidden" mt="30px">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Box
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.24s',
              }}
              display={'flex'}
              alignItems={'center'}
              gap={'10px'}
            >
              {hasRoleAuthorized && (
                <Button
                  disabled={isDeleteUserApiProcessing || isDeleteUserByOwnerApiProcessing}
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
                  disabled={isDeleteUserApiProcessing || isDeleteUserByOwnerApiProcessing}
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
          </ResetStyleWithAnimation>
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
