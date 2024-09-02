import { FC, useCallback, useEffect } from 'react';
import { List as MuiList, Box, TextField, Button, Autocomplete } from '@mui/material';
import { isoDate, getTime, UserRoles, DeletedUserListFilters, listScrollTop } from '../../lib';
import Pagination from '../shared/Pagination';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { DeletedUserApi, DeletedUsersApi } from '../../apis';
import Filter from '../shared/Filter';
import EmptyList from './EmptyList';
import { ModalNames } from '../../store';
import UserCard from '../shared/UserCard';
import UserSkeleton from '../shared/UsersSkeleton';
import { selectDeletedUsersList } from '../../store/selectors';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

const List: FC = () => {
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const deletedUserListFiltersFormInstance = useForm(DeletedUserListFilters);
  const deletedUserListFiltersForm = deletedUserListFiltersFormInstance.getForm();
  const isInitialDeletedUsersApiProcessing = request.isInitialApiProcessing(DeletedUsersApi);
  const isInitialDeletedUsersApiFailed = request.isInitialProcessingApiFailed(DeletedUsersApi);
  const initialDeletedUsersExceptionMessage = request.getInitialExceptionMessage(DeletedUsersApi);
  const isDeletedUsersApiProcessing = request.isApiProcessing(DeletedUsersApi);
  const isDeletedUsersApiFailed = request.isProcessingApiFailed(DeletedUsersApi);
  const deletedUsersApiExceptionMessage = request.getExceptionMessage(DeletedUserApi);
  const deletedUsersList = selectDeletedUsersList(selectors);

  useEffect(() => {
    actions.getInitialDeletedUsers({ page: 1, take: deletedUsersList.take });
  }, []);

  useEffect(() => {
    if (isInitialDeletedUsersApiFailed) {
      snackbar.enqueueSnackbar({ message: initialDeletedUsersExceptionMessage, variant: 'error' });
    } else if (isDeletedUsersApiFailed) {
      snackbar.enqueueSnackbar({ message: deletedUsersApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialDeletedUsersApiFailed, isDeletedUsersApiFailed]);

  const changePage = useCallback(
    (page: number) => {
      if (deletedUsersList.page === page || isDeletedUsersApiProcessing) return;
      listScrollTop();
      actions.getDeletedUsers({
        page,
        take: deletedUsersList.take,
        filters: {
          q: deletedUserListFiltersForm.q.trim(),
          roles: deletedUserListFiltersForm.roles,
          fromDate: deletedUserListFiltersForm.fromDate,
          toDate: deletedUserListFiltersForm.toDate,
          deletedDate: deletedUserListFiltersForm.deletedDate,
        },
      });
    },
    [isDeletedUsersApiProcessing, deletedUsersList, deletedUserListFiltersForm]
  );

  const userListFilterFormSubmition = useCallback(() => {
    deletedUserListFiltersFormInstance.onSubmit(() => {
      actions.getDeletedUsers({
        page: 1,
        take: deletedUsersList.take,
        filters: {
          q: deletedUserListFiltersForm.q.trim(),
          roles: deletedUserListFiltersForm.roles,
          fromDate: deletedUserListFiltersForm.fromDate,
          toDate: deletedUserListFiltersForm.toDate,
          deletedDate: deletedUserListFiltersForm.deletedDate,
        },
      });
    });
  }, [deletedUserListFiltersFormInstance, deletedUsersList, deletedUserListFiltersForm]);

  return (
    <>
      {isInitialDeletedUsersApiProcessing || isDeletedUsersApiProcessing ? (
        <UserSkeleton take={deletedUsersList.take} />
      ) : deletedUsersList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {deletedUsersList.list.map((user, index) => (
              <ResetStyleWithAnimation key={index} sx={{ opacity: '1', transform: 'translateY(0)' }}>
                <Box
                  sx={{
                    opacity: '0',
                    transform: 'translateY(30px)',
                    transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                    transitionDelay: `${index * 0.02}s`,
                  }}
                >
                  <UserCard index={index} user={user} list={deletedUsersList} />
                </Box>
              </ResetStyleWithAnimation>
            ))}
          </MuiList>
          {deletedUsersList.take < deletedUsersList.total && (
            <Pagination
              page={deletedUsersList.page}
              count={Math.ceil(deletedUsersList.total / deletedUsersList.take)}
              onPageChange={changePage}
            />
          )}
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
            id="_bank-service-deleted-user-filters-form-search"
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
