import { AxiosResponse } from 'axios';
import { FC, useEffect, useRef, useState } from 'react';
import { Box, Typography, Slider, Input, styled } from '@mui/material';
import { DateRange } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import {
  AllBillQuantitiesApi,
  AllDeletedBillQuantitiesApi,
  AllNotificationQuantitiesApi,
  DeletedBillQuantitiesApi,
  DeletedUserQuantitiesApi,
  LastWeekBillsApi,
  LastWeekUsersApi,
  NotificationQuantitiesApi,
  PeriodAmountApi,
  TotalAmountApi,
  UserQuantitiesApi,
} from '../../apis';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import MainContainer from '../../layout/MainContainer';
import { debounce, getTime } from '../../lib';
import {
  BillDates,
  AllBillQuantities,
  DeletedUserQuantities,
  LastWeekBillsObj,
  LastWeekReport,
  LastWeekUsersObj,
  PeriodAmountFilter,
  TotalAmount,
  UserQuantities,
  DeletedBillQuantities,
  AllDeletedBillQuantities,
  NotificationQuantities,
  AllNotificationQuantities,
} from '../../store';
import Skeleton from '../shared/Skeleton';
import Card from '../shared/Card';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';
import Chart from 'react-apexcharts';
import VerticalCarousel from '../shared/VerticalCarousel';
import CardContent from '../shared/CardContent';
import HorizonCarousel from '../shared/HorizonCarousel';

const LargSliderWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'block',
    width: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const SmallSliderWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    width: '100%',
    padding: '0 8px',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

function getOneDayDate() {
  return 1 * 24 * 60 * 60 * 1000;
}

function getDefaultSliderStep() {
  return getOneDayDate();
}

const Dashboard: FC = () => {
  const defaultSliderStep = getDefaultSliderStep();
  const [sliderStep, setSliderStep] = useState(defaultSliderStep);
  const [totalAmountHeight, setTotalAmountHeight] = useState<string>('');
  const request = useRequest();
  const auth = useAuth();
  const actions = useAction();
  const selectors = useSelector();
  const isCurrentAdmin = auth.isCurrentAdmin();
  const isCurrentOwner = auth.isCurrentOwner();
  const isCurrentOwnerOrAdmin = isCurrentOwner || isCurrentAdmin;
  const snackbar = useSnackbar();
  const isInitialTotalAmountApiProcessing = request.isInitialApiProcessing(TotalAmountApi);
  const isInitialTotalAmountApiFailed = request.isInitialProcessingApiFailed(TotalAmountApi);
  const isInitialTotalAmountApiSuccessed = request.isInitialProcessingApiSuccessed(TotalAmountApi);
  const isInitialLastWeekBillsApiProcessing = request.isInitialApiProcessing(LastWeekBillsApi);
  const isInitialLastWeekBillsApiFailed = request.isInitialProcessingApiFailed(LastWeekBillsApi);
  const isInitialLastWeekBillsApiSuccessed = request.isInitialProcessingApiSuccessed(LastWeekBillsApi);
  const isPeriodAmountApiProcessing = request.isApiProcessing(PeriodAmountApi);
  const isInitialUserQuantitiesApiProcessing = request.isInitialApiProcessing(UserQuantitiesApi);
  const isInitialUserQuantitiesApiFailed = request.isInitialProcessingApiFailed(UserQuantitiesApi);
  const isInitialUserQuantitiesApiSuccessed = request.isInitialProcessingApiSuccessed(UserQuantitiesApi);
  const isInitialDeletedUserQuantitiesApiProcessing = request.isInitialApiProcessing(DeletedUserQuantitiesApi);
  const isInitialDeletedUserQuantitiesApiFailed = request.isInitialProcessingApiFailed(DeletedUserQuantitiesApi);
  const isInitialDeletedUserQuantitiesApiSuccessed = request.isInitialProcessingApiSuccessed(DeletedUserQuantitiesApi);
  const isInitialAllBillQuantitiesApiProcessing = request.isInitialApiProcessing(AllBillQuantitiesApi);
  const isInitialAllBillQuantitiesApiFailed = request.isInitialProcessingApiFailed(AllBillQuantitiesApi);
  const isInitialAllBillQuantitiesApiSuccessed = request.isInitialProcessingApiSuccessed(AllBillQuantitiesApi);
  const isInitialDeletedBillQuantitiesApiProcessing = request.isInitialApiProcessing(DeletedBillQuantitiesApi);
  const isInitialDeletedBillQuantitiesApiFailed = request.isInitialProcessingApiFailed(DeletedBillQuantitiesApi);
  const isInitialDeletedBillQuantitiesApiSuccessed = request.isInitialProcessingApiSuccessed(DeletedBillQuantitiesApi);
  const isInitialAllDeletedBillQuantitiesApiProcessing = request.isInitialApiProcessing(AllDeletedBillQuantitiesApi);
  const isInitialAllDeletedBillQuantitiesApiFailed = request.isInitialProcessingApiFailed(AllDeletedBillQuantitiesApi);
  const isInitialAllDeletedBillQuantitiesApiSuccessed =
    request.isInitialProcessingApiSuccessed(AllDeletedBillQuantitiesApi);
  const isInitialNotificationQuantitiesApiProcessing = request.isInitialApiProcessing(NotificationQuantitiesApi);
  const isInitialNotificationQuantitiesApiFailed = request.isInitialProcessingApiFailed(NotificationQuantitiesApi);
  const isInitialNotificationQuantitiesApiSuccessed =
    request.isInitialProcessingApiSuccessed(NotificationQuantitiesApi);
  const isInitialAllNotificationQuantitiesApiProcessing = request.isInitialApiProcessing(AllNotificationQuantitiesApi);
  const isInitialAllNotificationQuantitiesApiFailed =
    request.isInitialProcessingApiFailed(AllNotificationQuantitiesApi);
  const isInitialAllNotificationQuantitiesApiSuccessed =
    request.isInitialProcessingApiSuccessed(AllNotificationQuantitiesApi);
  const halfSecDebounce = useRef(debounce());

  useEffect(() => {
    if (isCurrentOwner) {
      Promise.allSettled<
        [Promise<AxiosResponse<NotificationQuantities>>, Promise<AxiosResponse<AllNotificationQuantities>>]
      >([
        request.build(new NotificationQuantitiesApi().setInitialApi()),
        request.build(new AllNotificationQuantitiesApi().setInitialApi()),
      ]).then(([notificationQuantitiesResponse, allNotificationQuantitiesResponse]) => {
        if (notificationQuantitiesResponse.status === 'fulfilled')
          actions.setSpecificDetails('notificationQuantities', notificationQuantitiesResponse.value.data);

        if (allNotificationQuantitiesResponse.status === 'fulfilled')
          actions.setSpecificDetails('allNotificationQuantities', allNotificationQuantitiesResponse.value.data);
      });
    }

    if (isCurrentOwnerOrAdmin) {
      Promise.allSettled<
        [
          Promise<AxiosResponse<UserQuantities>>,
          Promise<AxiosResponse<DeletedUserQuantities>>,
          Promise<AxiosResponse<LastWeekUsersObj[]>>,
          Promise<AxiosResponse<AllBillQuantities>>,
          Promise<AxiosResponse<AllDeletedBillQuantities>>
        ]
      >([
        request.build(new UserQuantitiesApi().setInitialApi()),
        request.build(new DeletedUserQuantitiesApi().setInitialApi()),
        request.build(new LastWeekUsersApi().setInitialApi()),
        request.build(new AllBillQuantitiesApi().setInitialApi()),
        request.build(new AllDeletedBillQuantitiesApi().setInitialApi()),
      ]).then(
        ([
          userQuantitiesResponse,
          deletedUserQuantitiesResponse,
          lastWeekUsersResponse,
          billQuantitiesResponse,
          allDeletedBillQuantitiesResponse,
        ]) => {
          if (userQuantitiesResponse.status === 'fulfilled')
            actions.setSpecificDetails('userQuantities', new UserQuantities(userQuantitiesResponse.value.data));

          if (deletedUserQuantitiesResponse.status === 'fulfilled')
            actions.setSpecificDetails(
              'deletedUserQuantities',
              new DeletedUserQuantities(deletedUserQuantitiesResponse.value.data)
            );

          if (lastWeekUsersResponse.status === 'fulfilled')
            actions.setSpecificDetails('lastWeekUsers', lastWeekUsersResponse.value.data);

          if (billQuantitiesResponse.status === 'fulfilled') {
            const { quantities, amount } = billQuantitiesResponse.value.data;
            actions.setSpecificDetails('allBillQuantities', new AllBillQuantities(quantities, amount));
          }

          if (allDeletedBillQuantitiesResponse.status === 'fulfilled')
            actions.setSpecificDetails('allDeletedBillQuantities', allDeletedBillQuantitiesResponse.value.data);
        }
      );
    }

    Promise.allSettled<
      [
        Promise<AxiosResponse<TotalAmount & BillDates>>,
        Promise<AxiosResponse<LastWeekBillsObj[]>>,
        Promise<AxiosResponse<DeletedBillQuantities>>
      ]
    >([
      request.build(new TotalAmountApi().setInitialApi()),
      request.build(new LastWeekBillsApi().setInitialApi()),
      request.build(new DeletedBillQuantitiesApi().setInitialApi()),
    ]).then(([totalAmountResponse, lastWeekBillsResponse, deletedBillQuantitiesResponse]) => {
      if (totalAmountResponse.status === 'fulfilled') {
        const { start, end, totalAmount, quantities, dateLessQuantities, dateLessTotalAmount } =
          totalAmountResponse.value.data;
        actions.setSpecificDetails(
          'totalAmount',
          new TotalAmount(totalAmount, quantities, dateLessTotalAmount, dateLessQuantities)
        );
        actions.setSpecificDetails('billDates', new BillDates(start, end));
        actions.setSpecificDetails('periodAmountFilter', new PeriodAmountFilter(start, end));
      }

      if (lastWeekBillsResponse.status === 'fulfilled')
        actions.setSpecificDetails('lastWeekBills', lastWeekBillsResponse.value.data);

      if (deletedBillQuantitiesResponse.status === 'fulfilled')
        actions.setSpecificDetails('deletedBillQuantities', deletedBillQuantitiesResponse.value.data);
    });
  }, []);

  function getNewDateValue(value: string) {
    let newDate = getTime(value);
    const billDates = selectors.specificDetails.billDates as BillDates;
    const startDate = billDates.start;
    const endDate = billDates.end;
    if (newDate < startDate) {
      snackbar.enqueueSnackbar({
        message: `The minimum date is equal to ${moment(startDate).format('ll')}`,
        variant: 'warning',
        autoHideDuration: 7000,
      });
      newDate = startDate;
    } else if (newDate > endDate) {
      snackbar.enqueueSnackbar({
        message: `The maximum date is equal to ${moment(endDate).format('ll')}`,
        variant: 'warning',
        autoHideDuration: 7000,
      });
      newDate = endDate;
    }
    return newDate;
  }

  function getChartData() {
    let chartData: LastWeekReport[] = [];

    for (let i = 0; i < selectors.specificDetails.lastWeekBills.length; i++)
      chartData[i] = new LastWeekReport({
        date: selectors.specificDetails.lastWeekBills[i].date,
        billCounts: selectors.specificDetails.lastWeekBills[i].count,
        billAmount: selectors.specificDetails.lastWeekBills[i].amount,
      });

    for (let i = 0; i < chartData.length && isCurrentOwnerOrAdmin; i++)
      lastWeekUsersLoop: for (let j = 0; j < selectors.specificDetails.lastWeekUsers.length; j++)
        if (
          moment(new Date(chartData[i].date)).format('l') ===
          moment(selectors.specificDetails.lastWeekUsers[j].date).format('l')
        ) {
          chartData[i] = Object.assign<LastWeekReport, Partial<LastWeekReport>>(chartData[i], {
            userCounts: selectors.specificDetails.lastWeekUsers[i].count,
          });
          break lastWeekUsersLoop;
        }

    return chartData;
  }

  function getNewTotalAmount(
    previousPeriodAmountFilter: PeriodAmountFilter,
    previousTotalAmount: TotalAmount,
    newPeriodAmountFilter: PeriodAmountFilter
  ) {
    request
      .build<TotalAmount, PeriodAmountFilter>(new PeriodAmountApi(newPeriodAmountFilter))
      .then((response) => {
        const { totalAmount, quantities } = response.data;
        actions.setSpecificDetails(
          'totalAmount',
          new TotalAmount(
            totalAmount,
            quantities,
            previousTotalAmount.dateLessTotalAmount,
            previousTotalAmount.dateLessQuantities
          )
        );
      })
      .catch((err) => actions.setSpecificDetails('periodAmountFilter', previousPeriodAmountFilter));
  }

  function changeStartDate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const previousPeriodAmountFilter = selectors.specificDetails.periodAmountFilter!;
    const previousTotalAmount = selectors.specificDetails.totalAmount!;
    const newPeriodAmountFilter = new PeriodAmountFilter(
      getNewDateValue(event.target.value),
      previousPeriodAmountFilter.end
    );
    actions.setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    halfSecDebounce.current(() =>
      getNewTotalAmount(previousPeriodAmountFilter, previousTotalAmount, newPeriodAmountFilter)
    );
  }

  function changeSlider(evnet: Event, value: number | number[]) {
    let [start, end] = value as number[];
    const BillDates = selectors.specificDetails.billDates as BillDates;
    const remiderOfEndDates = BillDates.end - end;

    if (remiderOfEndDates < defaultSliderStep) {
      end = BillDates.end;
      setSliderStep(defaultSliderStep + remiderOfEndDates);
    } else setSliderStep(defaultSliderStep);

    const previousPeriodAmountFilter = selectors.specificDetails.periodAmountFilter!;
    const previousTotalAmount = selectors.specificDetails.totalAmount!;
    const newPeriodAmountFilter = new PeriodAmountFilter(getTime(start), getTime(end));
    actions.setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    halfSecDebounce.current(() =>
      getNewTotalAmount(previousPeriodAmountFilter, previousTotalAmount, newPeriodAmountFilter)
    );
  }

  function changeEndDate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const previousPeriodAmountFilter = selectors.specificDetails.periodAmountFilter!;
    const previousTotalAmount = selectors.specificDetails.totalAmount!;
    const newPeriodAmountFilter = new PeriodAmountFilter(
      previousPeriodAmountFilter.start,
      getNewDateValue(event.target.value)
    );
    actions.setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    halfSecDebounce.current(() =>
      getNewTotalAmount(previousPeriodAmountFilter, previousTotalAmount, newPeriodAmountFilter)
    );
  }

  const chartData = getChartData();

  return (
    <Navigation>
      <MainContainer>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="12px"
        >
          <Box sx={{ width: '100%', height: '100%', minHeight: '429px' }}>
            {isInitialLastWeekBillsApiProcessing ? (
              <Skeleton height="429px" width="100%" />
            ) : isInitialLastWeekBillsApiFailed ? (
              <Card style={{ height: '100%', minHeight: 'inherit' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 'inherit',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    fontSize={'14px'}
                    textAlign={'center'}
                    fontWeight={'500'}
                    color={'#d00000'}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    Failed to load the chart.
                  </Typography>
                </Box>
              </Card>
            ) : (
              isInitialLastWeekBillsApiSuccessed &&
              chartData.length > 0 && (
                <Card>
                  <CardContent>
                    {(() => {
                      const series = [
                        {
                          name: 'Bills',
                          data: chartData.map((item) => item.billCounts),
                        },
                      ];

                      if (isCurrentOwnerOrAdmin) {
                        series.push({
                          name: 'Users',
                          data: chartData.map((item) => item.userCounts),
                        });
                      }

                      return (
                        <Chart
                          options={{
                            chart: {
                              height: 380,
                              type: 'area',
                            },
                            dataLabels: {
                              enabled: false,
                            },
                            stroke: {
                              curve: 'straight',
                            },
                            xaxis: {
                              type: 'datetime',
                              categories: chartData.map((item) => item.date),
                            },
                            tooltip: {
                              x: {
                                format: 'dd/MM/yy',
                              },
                            },
                          }}
                          series={series}
                          type="area"
                          height={380}
                        />
                      );
                    })()}
                  </CardContent>
                </Card>
              )
            )}
          </Box>

          {isCurrentOwnerOrAdmin && (
            <Box width="100%" height="100%" display="flex" alignItems="center" gap="12px">
              <Box flexBasis="50%" flexGrow="1">
                <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
                  {isInitialUserQuantitiesApiProcessing ? (
                    <Skeleton width="100%" height="53px" />
                  ) : isInitialUserQuantitiesApiFailed ? (
                    <Card style={{ height: '100%', minHeight: 'inherit' }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: 'inherit',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          fontSize={'14px'}
                          textAlign={'center'}
                          fontWeight={'500'}
                          color={'#d00000'}
                          sx={{ wordBreak: 'break-word' }}
                        >
                          Failed to load the user quantities.
                        </Typography>
                      </Box>
                    </Card>
                  ) : (
                    isInitialUserQuantitiesApiSuccessed &&
                    selectors.specificDetails.userQuantities && (
                      <HorizonCarousel infinity height="55px">
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Total Users:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.userQuantities.quantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Owners:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.userQuantities.ownerQuantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Admins:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.userQuantities.adminQuantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Users:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.userQuantities.userQuantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </HorizonCarousel>
                    )
                  )}
                </Box>
              </Box>
              <Box flexBasis="50%" flexGrow="1">
                <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
                  {isInitialDeletedUserQuantitiesApiProcessing ? (
                    <Skeleton width="100%" height="53px" />
                  ) : isInitialDeletedUserQuantitiesApiFailed ? (
                    <Card style={{ height: '100%', minHeight: 'inherit' }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: 'inherit',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          fontSize={'14px'}
                          textAlign={'center'}
                          fontWeight={'500'}
                          color={'#d00000'}
                          sx={{ wordBreak: 'break-word' }}
                        >
                          Failed to load the deleted user quantities.
                        </Typography>
                      </Box>
                    </Card>
                  ) : (
                    isInitialDeletedUserQuantitiesApiSuccessed &&
                    selectors.specificDetails.deletedUserQuantities && (
                      <HorizonCarousel infinity height="55px">
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Total Deleted Users:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.deletedUserQuantities.quantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Deleted Owners:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.deletedUserQuantities.ownerQuantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Deleted Admins:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.deletedUserQuantities.adminQuantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Deleted Users:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.deletedUserQuantities.userQuantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </HorizonCarousel>
                    )
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {isCurrentOwnerOrAdmin && (
            <HorizonCarousel infinity height="55px">
              <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
                {isInitialAllBillQuantitiesApiProcessing ? (
                  <Skeleton width="100%" height="53px" />
                ) : isInitialAllBillQuantitiesApiFailed ? (
                  <Card style={{ height: '100%', minHeight: 'inherit' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: 'inherit',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        fontSize={'14px'}
                        textAlign={'center'}
                        fontWeight={'500'}
                        color={'#d00000'}
                        sx={{ wordBreak: 'break-word' }}
                      >
                        Failed to load the bill quantities.
                      </Typography>
                    </Box>
                  </Card>
                ) : (
                  isInitialAllBillQuantitiesApiSuccessed &&
                  selectors.specificDetails.allBillQuantities && (
                    <Card>
                      <CardContent>
                        <Box display="flex" gap="20px" flexDirection="column">
                          <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                            <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                              All bill quantities:{' '}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                              {selectors.specificDetails.allBillQuantities.quantities}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  )
                )}
              </Box>
              <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
                {isInitialAllDeletedBillQuantitiesApiProcessing ? (
                  <Skeleton width="100%" height="53px" />
                ) : isInitialAllDeletedBillQuantitiesApiFailed ? (
                  <Card style={{ height: '100%', minHeight: 'inherit' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: 'inherit',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        fontSize={'14px'}
                        textAlign={'center'}
                        fontWeight={'500'}
                        color={'#d00000'}
                        sx={{ wordBreak: 'break-word' }}
                      >
                        Failed to load the all deleted bill quantities.
                      </Typography>
                    </Box>
                  </Card>
                ) : (
                  isInitialAllDeletedBillQuantitiesApiSuccessed &&
                  selectors.specificDetails.allDeletedBillQuantities && (
                    <Card>
                      <CardContent>
                        <Box display="flex" gap="20px" flexDirection="column">
                          <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                            <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                              All deleted bill quantities:{' '}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                              {selectors.specificDetails.allDeletedBillQuantities.quantities}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  )
                )}
              </Box>
            </HorizonCarousel>
          )}

          {isCurrentOwner && (
            <Box width="100%" height="100%" display="flex" alignItems="center" gap="12px">
              <Box flexBasis="50%" flexGrow="1">
                <HorizonCarousel height="55px" infinity>
                  <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
                    {isInitialAllNotificationQuantitiesApiProcessing ? (
                      <Skeleton width="100%" height="53px" />
                    ) : isInitialAllNotificationQuantitiesApiFailed ? (
                      <Card style={{ height: '100%', minHeight: 'inherit' }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            minHeight: 'inherit',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            fontSize={'14px'}
                            textAlign={'center'}
                            fontWeight={'500'}
                            color={'#d00000'}
                            sx={{ wordBreak: 'break-word' }}
                          >
                            Failed to load the all notification quantities.
                          </Typography>
                        </Box>
                      </Card>
                    ) : (
                      isInitialAllNotificationQuantitiesApiSuccessed &&
                      selectors.specificDetails.allNotificationQuantities && (
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  All notification quantities:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.allNotificationQuantities.quantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </Box>
                  <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
                    {isInitialNotificationQuantitiesApiProcessing ? (
                      <Skeleton width="100%" height="53px" />
                    ) : isInitialNotificationQuantitiesApiFailed ? (
                      <Card style={{ height: '100%', minHeight: 'inherit' }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            minHeight: 'inherit',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            fontSize={'14px'}
                            textAlign={'center'}
                            fontWeight={'500'}
                            color={'#d00000'}
                            sx={{ wordBreak: 'break-word' }}
                          >
                            Failed to load the notification quantities.
                          </Typography>
                        </Box>
                      </Card>
                    ) : (
                      isInitialNotificationQuantitiesApiSuccessed &&
                      selectors.specificDetails.notificationQuantities && (
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Notification quantities:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.notificationQuantities.quantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </Box>
                </HorizonCarousel>
              </Box>
              <Box flexBasis="50%" flexGrow="1"></Box>
            </Box>
          )}

          <Box sx={{ width: '100%', height: '100%', minHeight: totalAmountHeight || '322.5px' }}>
            {isInitialTotalAmountApiProcessing ? (
              <Skeleton width="100%" height="322.5px" />
            ) : isInitialTotalAmountApiFailed ? (
              <Card style={{ height: '100%', minHeight: 'inherit' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 'inherit',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    fontSize={'14px'}
                    textAlign={'center'}
                    fontWeight={'500'}
                    color={'#d00000'}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    Failed to load the total amount of the bills and quantities.
                  </Typography>
                </Box>
              </Card>
            ) : (
              isInitialTotalAmountApiSuccessed &&
              selectors.specificDetails.totalAmount &&
              selectors.specificDetails.periodAmountFilter &&
              selectors.specificDetails.billDates && (
                <Card
                  ref={(ref) => {
                    if (ref) {
                      setTotalAmountHeight(window.getComputedStyle(ref).getPropertyValue('height'));
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="center" flexDirection="column" gap="20px">
                      {selectors.specificDetails.billDates.start > 0 &&
                        selectors.specificDetails.billDates.end > 0 &&
                        selectors.specificDetails.billDates.end - selectors.specificDetails.billDates.start >
                          getOneDayDate() &&
                        (() => {
                          const slider = (
                            <Slider
                              disabled={isPeriodAmountApiProcessing}
                              value={[
                                selectors.specificDetails.periodAmountFilter.start,
                                selectors.specificDetails.periodAmountFilter.end,
                              ]}
                              step={sliderStep}
                              min={selectors.specificDetails.billDates.start}
                              max={selectors.specificDetails.billDates.end}
                              onChange={changeSlider}
                              valueLabelDisplay="off"
                            />
                          );

                          return (
                            <Box>
                              <SmallSliderWrapper>{slider}</SmallSliderWrapper>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                gap="30px"
                                position="relative"
                              >
                                <Box display="flex" alignItems="center" gap="5px">
                                  <Typography fontSize="10px" whiteSpace="nowrap" color="rgba(0, 0, 0, 0.6)">
                                    {moment(selectors.specificDetails.periodAmountFilter.start).format('ll')}
                                  </Typography>
                                  <DateRange fontSize="small" sx={{ color: grey[600] }} />
                                </Box>
                                <Input
                                  disabled={isPeriodAmountApiProcessing}
                                  type="date"
                                  value={moment(selectors.specificDetails.periodAmountFilter.start).format(
                                    'YYYY-MM-DD'
                                  )}
                                  onChange={changeStartDate}
                                  sx={{
                                    position: 'absolute',
                                    top: '7px',
                                    left: '-57px',
                                    opacity: '0',
                                  }}
                                />
                                <LargSliderWrapper>{slider}</LargSliderWrapper>
                                <Box display="flex" alignItems="center" gap="5px">
                                  <Typography fontSize="10px" whiteSpace="nowrap" color="rgba(0, 0, 0, 0.6)">
                                    {moment(selectors.specificDetails.periodAmountFilter.end).format('ll')}
                                  </Typography>
                                  <DateRange fontSize="small" sx={{ color: grey[600] }} />
                                </Box>
                                <Input
                                  disabled={isPeriodAmountApiProcessing}
                                  type="date"
                                  value={moment(selectors.specificDetails.periodAmountFilter.end).format('YYYY-MM-DD')}
                                  onChange={changeEndDate}
                                  sx={{
                                    position: 'absolute',
                                    top: '7px',
                                    right: '0px',
                                    opacity: '0',
                                    width: '20px',
                                  }}
                                />
                              </Box>
                            </Box>
                          );
                        })()}
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Bill quantities:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.totalAmount.quantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Bill amounts:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.totalAmount.totalAmount}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Date-less bill quantities:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.totalAmount.dateLessQuantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Date-less bill amounts:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.totalAmount.dateLessTotalAmount}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Quantities:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {Number(selectors.specificDetails.totalAmount.quantities) +
                            Number(selectors.specificDetails.totalAmount.dateLessQuantities)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Amounts:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {Number(selectors.specificDetails.totalAmount.dateLessTotalAmount) +
                            Number(selectors.specificDetails.totalAmount.totalAmount)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            )}
          </Box>

          <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
            {isInitialDeletedBillQuantitiesApiProcessing ? (
              <Skeleton width="100%" height="53px" />
            ) : isInitialDeletedBillQuantitiesApiFailed ? (
              <Card style={{ height: '100%', minHeight: 'inherit' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 'inherit',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    fontSize={'14px'}
                    textAlign={'center'}
                    fontWeight={'500'}
                    color={'#d00000'}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    Failed to load the deleted bill quantities.
                  </Typography>
                </Box>
              </Card>
            ) : (
              isInitialDeletedBillQuantitiesApiSuccessed &&
              selectors.specificDetails.deletedBillQuantities && (
                <Card>
                  <CardContent>
                    <Box display="flex" gap="20px" flexDirection="column">
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Deleted bill quantities:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.deletedBillQuantities.quantities}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            )}
          </Box>
        </Box>
      </MainContainer>
    </Navigation>
  );
};

export default Dashboard;
