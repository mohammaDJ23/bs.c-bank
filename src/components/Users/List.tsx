import { FC, useCallback, useEffect } from 'react';
import { List as MuiList, Box, TextField, Button, Autocomplete } from '@mui/material';
import { UserObj, UserListFilters, isoDate, getTime, UserRoles, UserList, ListAsObjectType, ListObj } from '../../lib';
import Pagination from '../shared/Pagination';
import { useAction, useAuth, useForm, usePaginationList, useRequest, useSelector } from '../../hooks';
import { UsersApi, UsersApiConstructorType } from '../../apis';
import Filter from '../shared/Filter';
import EmptyList from './EmptyList';
import { ModalNames, UsersStatusType } from '../../store';
import UserSkeleton from '../shared/UsersSkeleton';
import UserCard from '../shared/UserCard';

const List: FC = () => {
  const selectors = useSelector();
  const actions = useAction();
  const request = useRequest();
  const auth = useAuth();
  const isCurrentOwner = auth.isCurrentOwner();
  const userListInstance = usePaginationList(UserList);
  const userListFiltersFormInstance = useForm(UserListFilters);
  const userListFiltersForm = userListFiltersFormInstance.getForm();
  const isInitialUsersApiProcessing = request.isInitialApiProcessing(UsersApi);
  const isUsersApiProcessing = request.isApiProcessing(UsersApi);

  useEffect(() => {
    if (selectors.userServiceSocket.connection && isCurrentOwner) {
      selectors.userServiceSocket.connection.on('users-status', (data: UsersStatusType) => {
        const usersStatus = Object.assign({}, selectors.specificDetails.usersStatus, data);
        actions.setSpecificDetails('usersStatus', usersStatus);
      });

      selectors.userServiceSocket.connection.on('user-status', (data: UsersStatusType) => {
        const userListAsObject = userListInstance.getListAsObject();
        const [id] = Object.keys(data);
        if (userListAsObject[id]) {
          const usersStatus = Object.assign({}, selectors.specificDetails.usersStatus, data);
          actions.setSpecificDetails('usersStatus', usersStatus);
        }
      });

      return () => {
        selectors.userServiceSocket.connection!.removeListener('users-status');
        selectors.userServiceSocket.connection!.removeListener('user-status');
      };
    }
  }, [selectors.userServiceSocket.connection, selectors.specificDetails.usersStatus, isCurrentOwner]);

  const getUsersListApi = useCallback(
    (options: Partial<UsersApiConstructorType> = {}) => {
      return new UsersApi({
        take: userListInstance.getTake(),
        page: userListInstance.getPage(),
        filters: {
          q: userListFiltersForm.q,
          roles: userListFiltersForm.roles,
          fromDate: userListFiltersForm.fromDate,
          toDate: userListFiltersForm.toDate,
        },
        ...options,
      });
    },
    [userListFiltersForm]
  );

  const getUsersList = useCallback(
    (api: UsersApi) => {
      request.build<[UserObj[], number]>(api).then((response) => {
        const [list, total] = response.data;
        const listAsObject = list.reduce((acc, val) => {
          acc[val.id] = val;
          return acc;
        }, {} as ListAsObjectType<UserObj>);
        userListInstance.updateAndConcatList(list, api.api.params.page);
        userListInstance.updateListAsObject(listAsObject);
        userListInstance.updatePage(api.api.params.page);
        userListInstance.updateTotal(total);

        if (selectors.userServiceSocket.connection && isCurrentOwner) {
          selectors.userServiceSocket.connection.emit('users-status', { ids: list.map((user) => user.id) });
        }
      });
    },
    [userListInstance, userListFiltersForm, request, selectors.userServiceSocket.connection]
  );

  useEffect(() => {
    const api = getUsersListApi();
    api.setInitialApi();
    getUsersList(api);
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      userListInstance.updatePage(newPage);

      if (userListInstance.isNewPageEqualToCurrentPage(newPage) || isUsersApiProcessing) return;

      if (!userListInstance.isNewPageExist(newPage)) {
        const api = getUsersListApi({ page: newPage });
        getUsersList(api);
      }
    },
    [userListInstance, isUsersApiProcessing, getUsersList]
  );

  const userListFilterFormSubmition = useCallback(() => {
    userListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      userListInstance.updatePage(newPage);
      const api = getUsersListApi({ page: newPage });
      getUsersList(api);
    });
  }, [userListFiltersFormInstance, userListInstance, getUsersList]);

  return (
    <>
      {isInitialUsersApiProcessing || isUsersApiProcessing ? (
        <UserSkeleton take={userListInstance.getTake()} />
      ) : userListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {userListInstance.getList().map((user, index) => (
              <UserCard key={index} index={index} user={user} listInstance={userListInstance} />
            ))}
          </MuiList>
          <Pagination page={userListInstance.getPage()} count={userListInstance.getCount()} onPageChange={changePage} />
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
