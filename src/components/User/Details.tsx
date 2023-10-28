import { Box, Typography, Menu, MenuItem, IconButton, Button, CircularProgress } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import { DeleteUserApi, DownloadBillReportApi } from '../../apis';
import { UserWithBillInfoObj, UserObj, Pathes, getDynamicPath, UserRoles, LocalStorage } from '../../lib';
import { ModalNames } from '../../store';

interface DetailsImporation {
  user: UserWithBillInfoObj;
}

const Details: FC<DetailsImporation> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { showModal, hideModal } = useAction();
  const { modals, userServiceSocket } = useSelector();
  const { isApiProcessing, request } = useRequest();
  const {
    isOwner,
    getTokenInfo,
    hasUserAuthorized,
    getUserStatusColor,
    getUserLastConnection,
    isSameUser,
    isUserOnline,
  } = useAuth();
  const isUserOwner = isOwner();
  const isCurrentUserSameUser = isSameUser(user.id);
  const isCurrentUserOnline = isUserOnline(user.id);
  const isCurrentUserOwner = isOwner(user.role);
  const isAuthorized = hasUserAuthorized(user);
  const userInfo = getTokenInfo();
  const isUserExist = !!userInfo;
  const isDeleteUserApiProcessing = isApiProcessing(DeleteUserApi);
  const isDownloadBillReportApiProcessing = isApiProcessing(DownloadBillReportApi);
  const options = [
    {
      label: 'Update',
      path: isUserOwner
        ? getDynamicPath(Pathes.UPDATE_USER_BY_OWNER, { id: user.id })
        : getDynamicPath(Pathes.UPDATE_USER, { id: user.id }),
    },
  ];

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
    showModal(ModalNames.CONFIRMATION);
  }, [showModal]);

  const onLogoutUser = useCallback(() => {
    if (userServiceSocket) {
      userServiceSocket.emit('logout_user', { id: user.id });
    }
  }, [user, userServiceSocket]);

  const deleteUser = useCallback(() => {
    if (isUserOnline(user.id)) {
      onLogoutUser();
    }

    request<UserObj, number>(new DeleteUserApi(user.id))
      .then((response) => {
        hideModal(ModalNames.CONFIRMATION);
        if (isUserExist) {
          if ((userInfo.role === UserRoles.OWNER && userInfo.id === user.id) || userInfo.role !== UserRoles.OWNER) {
            LocalStorage.clear();
            navigate(Pathes.LOGIN);
          } else {
            navigate(Pathes.USERS);
          }
        } else {
          LocalStorage.clear();
          navigate(Pathes.LOGIN);
        }
      })
      .catch((err) => hideModal(ModalNames.CONFIRMATION));
  }, [user, isUserExist, userInfo, request, hideModal, navigate, onLogoutUser, isSameUser]);

  const downloadBillReport = useCallback(() => {
    if (isDownloadBillReportApiProcessing) return;

    request<Blob>(new DownloadBillReportApi(user.id)).then((response) => {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${user.firstName}-${user.lastName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  }, [isDownloadBillReportApiProcessing, user, request]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Box
            component={'div'}
            display="flex"
            alignItems="center"
            justifyContent="start"
            gap="10px"
            flexWrap="wrap"
            mb={'15px'}
          >
            {isUserOwner && (
              <Box
                sx={{
                  flex: 'unset',
                  width: '10px',
                  height: '10px',
                  backgroundColor: getUserStatusColor(user.id),
                  borderRadius: '50%',
                }}
                component={'span'}
              ></Box>
            )}
            <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
          {options.length > 0 && isAuthorized && (
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
        {isCurrentUserOwner && (
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
        {isUserOwner &&
          (() => {
            const userLastConnection = getUserLastConnection(user.id);
            if (userLastConnection) {
              return (
                <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
                  <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                    Last connection:
                  </Typography>{' '}
                  {moment(userLastConnection).format('LLLL')}
                </Typography>
              );
            } else if (userLastConnection === undefined) {
              return (
                <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
                  <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                    Last connection:
                  </Typography>{' '}
                  long time ago
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
        {isAuthorized && (
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
        {isAuthorized && (
          <Box mt="30px" display={'flex'} alignItems={'center'} gap={'10px'}>
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
            {!isCurrentUserSameUser && isCurrentUserOnline && (
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
        )}
      </Box>

      <Modal
        title="Deleting the Account"
        body="Are you sure do delete the user account?"
        isLoading={isDeleteUserApiProcessing}
        isActive={modals[ModalNames.CONFIRMATION]}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteUser()}
      />
    </>
  );
};

export default Details;
