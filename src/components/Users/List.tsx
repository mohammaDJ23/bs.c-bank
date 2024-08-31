import { FC, useCallback, useEffect } from 'react';
import { List as MuiList, Box, TextField, Button, Autocomplete } from '@mui/material';
import { UserListFilters, isoDate, getTime, UserRoles, listScrollTop } from '../../lib';
import Pagination from '../shared/Pagination';
import { useAction, useAuth, useForm, useRequest, useSelector } from '../../hooks';
import { UsersApi } from '../../apis';
import Filter from '../shared/Filter';
import EmptyList from './EmptyList';
import { ModalNames, UsersStatusType } from '../../store';
import UserSkeleton from '../shared/UsersSkeleton';
import UserCard from '../shared/UserCard';
import { selectUsersList } from '../../store/selectors';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

const List: FC = () => {
  const selectors = useSelector();
  const actions = useAction();
  const request = useRequest();
  const snackbar = useSnackbar();
  const auth = useAuth();
  const isCurrentOwner = auth.isCurrentOwner();
  const userListFiltersFormInstance = useForm(UserListFilters);
  const userListFiltersForm = userListFiltersFormInstance.getForm();
  const isInitialUsersApiProcessing = request.isInitialApiProcessing(UsersApi);
  const isUsersApiProcessing = request.isApiProcessing(UsersApi);
  const isInitialUsersApiFailed = request.isInitialProcessingApiFailed(UsersApi);
  const initialUsersApiExceptionMessage = request.getInitialExceptionMessage(UsersApi);
  const isUsersApiFailed = request.isProcessingApiFailed(UsersApi);
  const usersApiExceptionMessage = request.getExceptionMessage(UsersApi);
  const usersList = selectUsersList(selectors);

  useEffect(() => {
    if (selectors.userServiceSocket.connection && isCurrentOwner) {
      selectors.userServiceSocket.connection.on('users-status', (data: UsersStatusType) => {
        const usersStatus = Object.assign({}, selectors.specificDetails.usersStatus, data);
        actions.setSpecificDetails('usersStatus', usersStatus);
      });

      selectors.userServiceSocket.connection.on('user-status', (data: UsersStatusType) => {
        const [id] = Object.keys(data);
        if (usersList.list.find((user) => user.id === +id)) {
          const usersStatus = Object.assign({}, selectors.specificDetails.usersStatus, data);
          actions.setSpecificDetails('usersStatus', usersStatus);
        }
      });

      return () => {
        selectors.userServiceSocket.connection!.removeListener('users-status');
        selectors.userServiceSocket.connection!.removeListener('user-status');
      };
    }
  }, [selectors.userServiceSocket.connection, selectors.specificDetails.usersStatus, isCurrentOwner, usersList]);

  useEffect(() => {
    actions.getInitialUsers({ page: 1, take: usersList.take });
  }, []);

  useEffect(() => {
    if (isInitialUsersApiFailed) {
      snackbar.enqueueSnackbar({ message: initialUsersApiExceptionMessage, variant: 'error' });
    } else if (isUsersApiFailed) {
      snackbar.enqueueSnackbar({ message: usersApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialUsersApiFailed, isUsersApiFailed]);

  useEffect(() => {
    if (selectors.userServiceSocket.connection && isCurrentOwner) {
      selectors.userServiceSocket.connection.emit('users-status', {
        ids: usersList.list.map((user) => user.id),
      });
    }
  }, [usersList, selectors.userServiceSocket.connection]);

  const changePage = useCallback(
    (page: number) => {
      if (usersList.page === page || isUsersApiProcessing) return;
      listScrollTop();
      actions.getUsers({
        page,
        take: usersList.take,
        filters: {
          q: userListFiltersForm.q,
          roles: userListFiltersForm.roles,
          fromDate: userListFiltersForm.fromDate,
          toDate: userListFiltersForm.toDate,
        },
      });
    },
    [usersList, isUsersApiProcessing, userListFiltersForm]
  );

  const userListFilterFormSubmition = useCallback(() => {
    userListFiltersFormInstance.onSubmit(() => {
      actions.getUsers({
        page: 1,
        take: usersList.take,
        filters: {
          q: userListFiltersForm.q,
          roles: userListFiltersForm.roles,
          fromDate: userListFiltersForm.fromDate,
          toDate: userListFiltersForm.toDate,
        },
      });
    });
  }, [userListFiltersFormInstance, userListFiltersForm, usersList]);

  return (
    <>
      {isInitialUsersApiProcessing || isUsersApiProcessing ? (
        <UserSkeleton take={usersList.take} />
      ) : usersList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {usersList.list.map((user, index) => (
              <ResetStyleWithAnimation key={index} sx={{ opacity: '1', transform: 'translateY(0)' }}>
                <Box
                  sx={{
                    opacity: '0',
                    transform: 'translateY(30px)',
                    transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                    transitionDelay: `${index * 0.02}s`,
                  }}
                >
                  <UserCard index={index} user={user} list={usersList} />
                </Box>
              </ResetStyleWithAnimation>
            ))}
          </MuiList>
          {usersList.take < usersList.total && (
            <Pagination
              page={usersList.page}
              count={Math.ceil(usersList.total / usersList.take)}
              onPageChange={changePage}
            />
          )}
        </>
      )}

      <Filter name={ModalNames.USER_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            userListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={userListFiltersForm.q}
            onChange={(event) => userListFiltersFormInstance.onChange('q', event.target.value.trim())}
            helperText={userListFiltersFormInstance.getInputErrorMessage('q')}
            error={userListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="first name, last name, phone"
            disabled={isUsersApiProcessing}
          />
          <Autocomplete
            multiple
            id="size-small-standard-multi"
            size="small"
            options={Object.values(UserRoles)}
            getOptionLabel={(option: (typeof userListFiltersForm.roles)[number]) => option}
            onChange={(event, value) => userListFiltersFormInstance.onChange('roles', value)}
            value={userListFiltersForm.roles}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Roles"
                variant="standard"
                type="text"
                error={userListFiltersFormInstance.isInputInValid('roles')}
                helperText={userListFiltersFormInstance.getInputErrorMessage('roles')}
                name="roles"
              />
            )}
            disabled={isUsersApiProcessing}
          />

          <TextField
            label="From date"
            type="date"
            variant="standard"
            value={userListFiltersForm.fromDate ? isoDate(userListFiltersForm.fromDate) : ''}
            onChange={(event) => userListFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
            helperText={userListFiltersFormInstance.getInputErrorMessage('fromDate')}
            error={userListFiltersFormInstance.isInputInValid('fromDate')}
            InputLabelProps={{ shrink: true }}
            name="fromDate"
            disabled={isUsersApiProcessing}
          />
          <TextField
            label="To date"
            type="date"
            variant="standard"
            value={userListFiltersForm.toDate ? isoDate(userListFiltersForm.toDate) : ''}
            onChange={(event) => userListFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
            helperText={userListFiltersFormInstance.getInputErrorMessage('toDate')}
            error={userListFiltersFormInstance.isInputInValid('toDate')}
            InputLabelProps={{ shrink: true }}
            name="toDate"
            disabled={isUsersApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isUsersApiProcessing || !userListFiltersFormInstance.isFormValid()}
              variant="contained"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}
            >
              Filter
            </Button>
            <Button
              disabled={false}
              variant="outlined"
              size="small"
              type="button"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => userListFiltersFormInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Filter>
    </>
  );
};

export default List;
