import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button, Autocomplete } from '@mui/material';
import Pagination from '../shared/Pagination';
import { NotificationListFilters, getTime, isoDate, UserRoles } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { NotificationsApi } from '../../apis';
import NotificationsSkeleton from '../shared/NotificationsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import NotificationCard from '../shared/NotificationCard';
import { selectNotificationsList } from '../../store/selectors';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

const List: FC = () => {
  const request = useRequest();
  const actions = useAction();
  const selectors = useSelector();
  const snackbar = useSnackbar();
  const notificationListFiltersFormInstance = useForm(NotificationListFilters);
  const notificationListFiltersForm = notificationListFiltersFormInstance.getForm();
  const isInitialNotificationsApiProcessing = request.isInitialApiProcessing(NotificationsApi);
  const isNotificationsApiProcessing = request.isApiProcessing(NotificationsApi);
  const isInitialNotificationsApiFailed = request.isInitialProcessingApiFailed(NotificationsApi);
  const isNotificationsApiFailed = request.isProcessingApiFailed(NotificationsApi);
  const initialNotificationsApiExceptionMessage = request.getInitialExceptionMessage(NotificationsApi);
  const notificationsApiExceptionMessage = request.getExceptionMessage(NotificationsApi);
  const notificationsList = selectNotificationsList(selectors);

  useEffect(() => {
    actions.getInitialNotifications({ page: 1, take: notificationsList.take });
  }, []);

  useEffect(() => {
    if (isInitialNotificationsApiFailed) {
      snackbar.enqueueSnackbar({ message: initialNotificationsApiExceptionMessage, variant: 'error' });
    } else if (isNotificationsApiFailed) {
      snackbar.enqueueSnackbar({ message: notificationsApiExceptionMessage, variant: 'error' });
    }
  }, [isInitialNotificationsApiFailed, isNotificationsApiFailed]);

  const changePage = useCallback(
    (page: number) => {
      if (notificationsList.page === page || isNotificationsApiProcessing) return;
      actions.getNotifications({
        page,
        take: notificationsList.take,
        filters: {
          q: notificationListFiltersForm.q,
          roles: notificationListFiltersForm.roles,
          fromDate: notificationListFiltersForm.fromDate,
          toDate: notificationListFiltersForm.toDate,
        },
      });
    },
    [isNotificationsApiProcessing, notificationsList, notificationListFiltersForm]
  );

  const notificationListFilterFormSubmition = useCallback(() => {
    notificationListFiltersFormInstance.onSubmit(() => {
      actions.getNotifications({
        page: 1,
        take: notificationsList.take,
        filters: {
          q: notificationListFiltersForm.q,
          roles: notificationListFiltersForm.roles,
          fromDate: notificationListFiltersForm.fromDate,
          toDate: notificationListFiltersForm.toDate,
        },
      });
    });
  }, [notificationListFiltersFormInstance, notificationsList, notificationListFiltersForm]);

  return (
    <>
      {isInitialNotificationsApiProcessing || isNotificationsApiProcessing ? (
        <NotificationsSkeleton take={notificationsList.take} />
      ) : notificationsList.total <= 0 ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {notificationsList.list.map((notification, index) => (
              <ResetStyleWithAnimation key={index} sx={{ opacity: '1', transform: 'translateY(0)' }}>
                <Box
                  sx={{
                    opacity: '0',
                    transform: 'translateY(30px)',
                    transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                    transitionDelay: `${index * 0.02}s`,
                  }}
                >
                  <NotificationCard index={index} notification={notification} list={notificationsList} />
                </Box>
              </ResetStyleWithAnimation>
            ))}
          </MuiList>
          {notificationsList.take < notificationsList.total && (
            <Pagination
              page={notificationsList.page}
              count={Math.ceil(notificationsList.total / notificationsList.take)}
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
