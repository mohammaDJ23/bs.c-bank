import { Box, Typography, Button } from '@mui/material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { FC, useCallback, useEffect } from 'react';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import { RestoreUserApi } from '../../apis';
import { User, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface DetailsImporation {
  user: User;
}

const Details: FC<DetailsImporation> = ({ user }) => {
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const auth = useAuth();
  const snackbar = useSnackbar();
  const isUserCreatedByCurrentUser = auth.isUserCreatedByCurrentUser(user);
  const isRestoreUserApiProcessing = request.isApiProcessing(RestoreUserApi);
  const isRestoreUserApiFailed = request.isProcessingApiFailed(RestoreUserApi);
  const isRestoreUserApiSuccessed = request.isProcessingApiSuccessed(RestoreUserApi);
  const restoreUserApiExceptionMessage = request.getExceptionMessage(RestoreUserApi);

  const showRestoreUserModal = useCallback(() => {
    actions.showModal(ModalNames.RESTORE_USER);
  }, []);

  const hideRestoreUserModal = useCallback(() => {
    actions.hideModal(ModalNames.RESTORE_USER);
  }, []);

  const restoreUser = useCallback(() => {
    actions.restoreUser(user.id);
  }, [user]);

  useEffect(() => {
    if (isRestoreUserApiSuccessed) {
      hideRestoreUserModal();
      navigate(Pathes.USERS);
    } else if (isRestoreUserApiFailed) {
      snackbar.enqueueSnackbar({ message: restoreUserApiExceptionMessage, variant: 'error' });
    }
  }, [isRestoreUserApiSuccessed, isRestoreUserApiFailed]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px" overflow="hidden">
        <Box overflow="hidden" mb="15px">
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
              <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
                {user.firstName} {user.lastName}
              </Typography>
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
                Created at:
              </Typography>{' '}
              {moment(user.createdAt).format('LLLL')}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
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
                Deleted at:
              </Typography>{' '}
              {moment(user.deletedAt).format('LLLL')}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>
        {isUserCreatedByCurrentUser && (
          <Box overflow="hidden">
            <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
              <Box
                sx={{
                  transform: 'translateY(100%)',
                  transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                  transitionDelay: '0.14s',
                }}
                mt="30px"
              >
                <Button
                  disabled={isRestoreUserApiProcessing}
                  onClick={showRestoreUserModal}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                >
                  Restore the user
                </Button>
              </Box>
            </ResetStyleWithAnimation>
          </Box>
        )}
      </Box>

      <Modal
        title="Restoring the user"
        body="Are you sure to restore the user?"
        isLoading={isRestoreUserApiProcessing}
        isActive={selectors.modals[ModalNames.RESTORE_USER]}
        onCancel={hideRestoreUserModal}
        onConfirm={restoreUser}
      />
    </>
  );
};

export default Details;
