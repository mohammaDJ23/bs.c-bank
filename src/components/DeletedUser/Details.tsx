import { Box, Typography, Button } from '@mui/material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { FC, useCallback } from 'react';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import { RestoreUserApi } from '../../apis';
import { User, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { useNavigate } from 'react-router-dom';

interface DetailsImporation {
  user: User;
}

const Details: FC<DetailsImporation> = ({ user }) => {
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const auth = useAuth();
  const isUserCreatedByCurrentUser = auth.isUserCreatedByCurrentUser(user);
  const isRestoreUserApiProcessing = request.isApiProcessing(RestoreUserApi);

  const showRestoreUserModal = useCallback(() => {
    actions.showModal(ModalNames.RESTORE_USER);
  }, []);

  const hideRestoreUserModal = useCallback(() => {
    actions.hideModal(ModalNames.RESTORE_USER);
  }, []);

  const restoreUser = useCallback(() => {
    request.build(new RestoreUserApi(user.id)).then((response) => {
      navigate(Pathes.USERS);
    });
  }, [user]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
            {user.firstName} {user.lastName}
          </Typography>
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
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Created at:
          </Typography>{' '}
          {moment(user.createdAt).format('LLLL')}
        </Typography>
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Deleted at:
          </Typography>{' '}
          {moment(user.deletedAt).format('LLLL')}
        </Typography>
        {isUserCreatedByCurrentUser && (
          <Box mt="30px">
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
