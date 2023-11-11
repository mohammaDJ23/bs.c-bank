import { FC, useCallback, useEffect } from 'react';
import { List as MuiList, Box, TextField, Button, Autocomplete } from '@mui/material';
import { UserObj, isoDate, getTime, UserRoles, DeletedUserListFilters, DeletedUserList } from '../../lib';
import Pagination from '../shared/Pagination';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { DeletedUsersApi, DeletedUsersApiConstructorType } from '../../apis';
import Filter from '../shared/Filter';
import EmptyList from './EmptyList';
import { ModalNames } from '../../store';
import UserCard from '../shared/UserCard';
import UserSkeleton from '../shared/UsersSkeleton';

const List: FC = () => {
  const request = useRequest();
  const deletedUserListInstance = usePaginationList(DeletedUserList);
  const deletedUserListFiltersFormInstance = useForm(DeletedUserListFilters);
  const deletedUserListFiltersForm = deletedUserListFiltersFormInstance.getForm();
  const deletedUserListInfo = deletedUserListInstance.getFullInfo();
  const isInitialDeletedUsersApiProcessing = request.isInitialApiProcessing(DeletedUsersApi);
  const isDeletedUsersApiProcessing = request.isApiProcessing(DeletedUsersApi);

  const getDeletedUsersApi = useCallback(
    (options: Partial<DeletedUsersApiConstructorType> = {}) => {
      return new DeletedUsersApi({
        take: deletedUserListInfo.take,
        page: deletedUserListInfo.page,
        filters: {
          q: deletedUserListFiltersForm.q,
          roles: deletedUserListFiltersForm.roles,
          fromDate: deletedUserListFiltersForm.fromDate,
          toDate: deletedUserListFiltersForm.toDate,
          deletedDate: deletedUserListFiltersForm.deletedDate,
        },
        ...options,
      });
    },
    [deletedUserListInfo, deletedUserListFiltersForm]
  );

  const getDeletedUsersList = useCallback(
    (api: DeletedUsersApi) => {
      request.build<[UserObj[], number]>(api).then((response) => {
        const [list, total] = response.data;
        deletedUserListInstance.insertNewList({ total, list, page: api.api.params.page });
      });
    },
    [deletedUserListInfo, deletedUserListInstance, deletedUserListFiltersForm, request]
  );

  useEffect(() => {
    const api = getDeletedUsersApi();
    api.setInitialApi();
    getDeletedUsersList(api);
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      deletedUserListInstance.onPageChange(newPage);

      if (deletedUserListInstance.isNewPageEqualToCurrentPage(newPage) || isDeletedUsersApiProcessing) return;

      if (!deletedUserListInstance.isNewPageExist(newPage)) {
        const api = getDeletedUsersApi({ page: newPage });
        getDeletedUsersList(api);
      }
    },
    [deletedUserListInstance, isDeletedUsersApiProcessing, getDeletedUsersList]
  );

  const userListFilterFormSubmition = useCallback(() => {
    deletedUserListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      deletedUserListInstance.onPageChange(newPage);
      const api = getDeletedUsersApi({ page: newPage });
      getDeletedUsersList(api);
    });
  }, [deletedUserListFiltersFormInstance, deletedUserListInstance, getDeletedUsersList]);

  return (
    <>
      {isInitialDeletedUsersApiProcessing || isDeletedUsersApiProcessing ? (
        <UserSkeleton take={deletedUserListInfo.take} />
      ) : deletedUserListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {deletedUserListInfo.list.map((user, index) => (
              <UserCard key={index} index={index} user={user} listInfo={deletedUserListInfo} />
            ))}
          </MuiList>
          <Pagination page={deletedUserListInfo.page} count={deletedUserListInfo.count} onPageChange={changePage} />
        </>
      )}

      <Filter name={ModalNames.DELETED_USER_FILTERS}>
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
            value={deletedUserListFiltersForm.q}
            onChange={(event) => deletedUserListFiltersFormInstance.onChange('q', event.target.value)}
            helperText={deletedUserListFiltersFormInstance.getInputErrorMessage('q')}
            error={deletedUserListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="first name, last name, phone"
            disabled={isDeletedUsersApiProcessing}
          />
          <Autocomplete
            multiple
            id="size-small-standard-multi"
            size="small"
            options={Object.values(UserRoles)}
            getOptionLabel={(option: (typeof deletedUserListFiltersForm.roles)[number]) => option}
            onChange={(event, value) => deletedUserListFiltersFormInstance.onChange('roles', value)}
            value={deletedUserListFiltersForm.roles}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Roles"
                variant="standard"
                type="text"
                error={deletedUserListFiltersFormInstance.isInputInValid('roles')}
                helperText={deletedUserListFiltersFormInstance.getInputErrorMessage('roles')}
                name="roles"
              />
            )}
            disabled={isDeletedUsersApiProcessing}
          />

          <TextField
            label="From date"
            type="date"
            variant="standard"
            value={deletedUserListFiltersForm.fromDate ? isoDate(deletedUserListFiltersForm.fromDate) : ''}
            onChange={(event) => deletedUserListFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
            helperText={deletedUserListFiltersFormInstance.getInputErrorMessage('fromDate')}
            error={deletedUserListFiltersFormInstance.isInputInValid('fromDate')}
            InputLabelProps={{ shrink: true }}
            name="fromDate"
            disabled={isDeletedUsersApiProcessing}
          />
          <TextField
            label="To date"
            type="date"
            variant="standard"
            value={deletedUserListFiltersForm.toDate ? isoDate(deletedUserListFiltersForm.toDate) : ''}
            onChange={(event) => deletedUserListFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
            helperText={deletedUserListFiltersFormInstance.getInputErrorMessage('toDate')}
            error={deletedUserListFiltersFormInstance.isInputInValid('toDate')}
            InputLabelProps={{ shrink: true }}
            name="toDate"
            disabled={isDeletedUsersApiProcessing}
          />
          <TextField
            label="Deleted date"
            type="date"
            variant="standard"
            value={deletedUserListFiltersForm.deletedDate ? isoDate(deletedUserListFiltersForm.deletedDate) : ''}
            onChange={(event) =>
              deletedUserListFiltersFormInstance.onChange('deletedDate', getTime(event.target.value))
            }
            helperText={deletedUserListFiltersFormInstance.getInputErrorMessage('deletedDate')}
            error={deletedUserListFiltersFormInstance.isInputInValid('deletedDate')}
            InputLabelProps={{ shrink: true }}
            name="deletedDate"
            disabled={isDeletedUsersApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isDeletedUsersApiProcessing || !deletedUserListFiltersFormInstance.isFormValid()}
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
              onClick={() => deletedUserListFiltersFormInstance.resetForm()}
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
