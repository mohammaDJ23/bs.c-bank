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
  const notificationListInfo = notificationListInstance.getFullInfo();
  const isInitialNotificationsApiProcessing = request.isInitialApiProcessing(NotificationsApi);
  const isNotificationsApiProcessing = request.isApiProcessing(NotificationsApi);

  const getNotificationList = useCallback(
    (options: Partial<NotificationsApiConstructorType> = {}) => {
      const apiData = Object.assign(
        { take: notificationListInfo.take, page: notificationListInfo.page, ...options },
        notificationListFiltersForm
      );
      const notificationsApi = new NotificationsApi<NotificationObj>(apiData);
      notificationsApi.setInitialApi(!!apiData.isInitialApi);

      request.build<[NotificationObj[], number], NotificationObj>(notificationsApi).then((response) => {
        const [list, total] = response.data;
        notificationListInstance.insertNewList({ list, total, page: apiData.page });
      });
    },
    [notificationListInfo, notificationListInstance, notificationListFiltersForm, request]
  );

  useEffect(() => {
    getNotificationList({ isInitialApi: true });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      notificationListInstance.onPageChange(newPage);

      if (notificationListInstance.isNewPageEqualToCurrentPage(newPage) || isNotificationsApiProcessing) return;

      if (!notificationListInstance.isNewPageExist(newPage)) getNotificationList({ page: newPage });
    },
    [isNotificationsApiProcessing, notificationListInstance, getNotificationList]
  );

  const notificationListFilterFormSubmition = useCallback(() => {
    notificationListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      notificationListInstance.onPageChange(newPage);
      getNotificationList({ page: newPage });
    });
  }, [notificationListFiltersFormInstance, notificationListInstance, getNotificationList]);

  return (
    <>
      {isInitialNotificationsApiProcessing || isNotificationsApiProcessing ? (
        <NotificationsSkeleton take={notificationListInfo.take} />
      ) : notificationListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {notificationListInfo.list.map((notification, index) => (
              <NotificationCard key={index} index={index} notification={notification} listInfo={notificationListInfo} />
            ))}
          </MuiList>
          <Pagination page={notificationListInfo.page} count={notificationListInfo.count} onPageChange={changePage} />
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
            onChange={(event) => notificationListFiltersFormInstance.onChange('q', event.target.value)}
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
