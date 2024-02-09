import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button, Autocomplete } from '@mui/material';
import Pagination from '../shared/Pagination';
import { NotificationList, NotificationObj, NotificationListFilters, getTime, isoDate, UserRoles } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { NotificationsApiConstructorType, NotificationsApi } from '../../apis';
import NotificationsSkeleton from '../shared/NotificationsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import NotificationCard from '../shared/NotificationCard';

const List: FC = () => {
  const request = useRequest();
  const notificationListInstance = usePaginationList(NotificationList);
  const notificationListFiltersFormInstance = useForm(NotificationListFilters);
  const notificationListFiltersForm = notificationListFiltersFormInstance.getForm();
  const isInitialNotificationsApiProcessing = request.isInitialApiProcessing(NotificationsApi);
  const isNotificationsApiProcessing = request.isApiProcessing(NotificationsApi);

  const getNotificationsApi = useCallback(
    (options: Partial<NotificationsApiConstructorType> = {}) => {
      return new NotificationsApi({
        take: notificationListInstance.getTake(),
        page: notificationListInstance.getPage(),
        filters: {
          q: notificationListFiltersForm.q,
          roles: notificationListFiltersForm.roles,
          fromDate: notificationListFiltersForm.fromDate,
          toDate: notificationListFiltersForm.toDate,
        },
        ...options,
      });
    },
    [notificationListFiltersForm]
  );

  const getNotificationList = useCallback(
    (api: NotificationsApi) => {
      request.build<[NotificationObj[], number], NotificationObj>(api).then((response) => {
        const [list, total] = response.data;
        notificationListInstance.updateAndConcatList(list, api.api.params.page);
        notificationListInstance.updatePage(api.api.params.page);
        notificationListInstance.updateTotal(total);
      });
    },
    [notificationListInstance, notificationListFiltersForm, request]
  );

  useEffect(() => {
    const api = getNotificationsApi();
    api.setInitialApi();
    getNotificationList(api);
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      notificationListInstance.updatePage(newPage);

      if (notificationListInstance.isNewPageEqualToCurrentPage(newPage) || isNotificationsApiProcessing) return;

      if (!notificationListInstance.isNewPageExist(newPage)) {
        const api = getNotificationsApi({ page: newPage });
        getNotificationList(api);
      }
    },
    [isNotificationsApiProcessing, notificationListInstance, getNotificationList]
  );

  const notificationListFilterFormSubmition = useCallback(() => {
    notificationListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      notificationListInstance.updatePage(newPage);
      const api = getNotificationsApi({ page: newPage });
      getNotificationList(api);
    });
  }, [notificationListFiltersFormInstance, notificationListInstance, getNotificationList]);

  return (
    <>
      {isInitialNotificationsApiProcessing || isNotificationsApiProcessing ? (
        <NotificationsSkeleton take={notificationListInstance.getTake()} />
      ) : notificationListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {notificationListInstance.getList().map((notification, index) => (
              <NotificationCard
                key={index}
                index={index}
                notification={notification}
                listInstance={notificationListInstance}
              />
            ))}
          </MuiList>
          {notificationListInstance.getTotal() > notificationListInstance.getTake() && (
            <Pagination
              page={notificationListInstance.getPage()}
              count={notificationListInstance.getCount()}
              onPageChange={changePage}
            />
          )}
        </>
      )}

      <Filter name={ModalNames.NOTIFICATION_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={(event) => {
            event.preventDefault();
            notificationListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={notificationListFiltersForm.q}
            onChange={(event) => notificationListFiltersFormInstance.onChange('q', event.target.value.trim())}
            helperText={notificationListFiltersFormInstance.getInputErrorMessage('q')}
            error={notificationListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="first name, last name, device description"
            disabled={isNotificationsApiProcessing}
          />
          <Autocomplete
            multiple
            id="size-small-standard-multi"
            size="small"
            options={Object.values(UserRoles)}
            getOptionLabel={(option: (typeof notificationListFiltersForm.roles)[number]) => option}
            onChange={(event, value) => notificationListFiltersFormInstance.onChange('roles', value)}
            value={notificationListFiltersForm.roles}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Roles"
                variant="standard"
                type="text"
                error={notificationListFiltersFormInstance.isInputInValid('roles')}
                helperText={notificationListFiltersFormInstance.getInputErrorMessage('roles')}
                name="roles"
              />
            )}
            disabled={isNotificationsApiProcessing}
          />
          <TextField
            label="From date"
            type="date"
            variant="standard"
            value={notificationListFiltersForm.fromDate ? isoDate(notificationListFiltersForm.fromDate) : ''}
            onChange={(event) => notificationListFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
            helperText={notificationListFiltersFormInstance.getInputErrorMessage('fromDate')}
            error={notificationListFiltersFormInstance.isInputInValid('fromDate')}
            InputLabelProps={{ shrink: true }}
            name="fromDate"
            disabled={isNotificationsApiProcessing}
          />
          <TextField
            label="To date"
            type="date"
            variant="standard"
            value={notificationListFiltersForm.toDate ? isoDate(notificationListFiltersForm.toDate) : ''}
            onChange={(event) => notificationListFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
            helperText={notificationListFiltersFormInstance.getInputErrorMessage('toDate')}
            error={notificationListFiltersFormInstance.isInputInValid('toDate')}
            InputLabelProps={{ shrink: true }}
            name="toDate"
            disabled={isNotificationsApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isNotificationsApiProcessing || !notificationListFiltersFormInstance.isFormValid()}
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
              onClick={() => notificationListFiltersFormInstance.resetForm()}
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
