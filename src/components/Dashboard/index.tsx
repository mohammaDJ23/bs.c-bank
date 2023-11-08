import { AxiosResponse } from 'axios';
import { FC, useEffect, useRef, useState } from 'react';
import { Box, CardContent, Typography, Slider, Input, styled } from '@mui/material';
import { DateRange } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import {
  BillQuantitiesApi,
  DeletedUserQuantitiesApi,
  LastWeekBillsApi,
  LastWeekUsersApi,
  PeriodAmountApi,
  TotalAmountApi,
  UserQuantitiesApi,
} from '../../apis';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import MainContainer from '../../layout/MainContainer';
import { debounce, getTime } from '../../lib';
import {
  BillDates,
  BillQuantities,
  DeletedUserQuantities,
  LastWeekBillsObj,
  LastWeekReport,
  LastWeekUsersObj,
  PeriodAmountFilter,
  TotalAmount,
  UserQuantities,
} from '../../store';
import Skeleton from '../shared/Skeleton';
import Card from '../shared/Card';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';
import Chart from 'react-apexcharts';

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
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const { isOwner, isAdmin } = useAuth();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isUserAdmin = isAdmin();
  const isUserOwner = isOwner();
  const isUserOwnerOrAdmin = isUserOwner || isUserAdmin;
  const { enqueueSnackbar } = useSnackbar();
  const isInitialTotalAmountApiProcessing = isInitialApiProcessing(TotalAmountApi);
  const isInitialLastWeekBillsApiProcessing = isInitialApiProcessing(LastWeekBillsApi);
  const isPeriodAmountApiProcessing = isApiProcessing(PeriodAmountApi);
  const isInitialUserQuantitiesApiProcessing = isInitialApiProcessing(UserQuantitiesApi);
  const isInitialDeletedUserQuantitiesApiProcessing = isInitialApiProcessing(DeletedUserQuantitiesApi);
  const isInitialBillQuantitiesApiProcessing = isInitialApiProcessing(BillQuantitiesApi);
  const halfSecDebounce = useRef(debounce());

  useEffect(() => {
    if (isUserOwnerOrAdmin) {
      Promise.allSettled<
        [
          Promise<AxiosResponse<UserQuantities>>,
          Promise<AxiosResponse<DeletedUserQuantities>>,
          Promise<AxiosResponse<LastWeekUsersObj[]>>,
          Promise<AxiosResponse<BillQuantities>>
        ]
      >([
        request(new UserQuantitiesApi().setInitialApi()),
        request(new DeletedUserQuantitiesApi().setInitialApi()),
        request(new LastWeekUsersApi().setInitialApi()),
        request(new BillQuantitiesApi().setInitialApi()),
      ]).then(
        ([userQuantitiesResponse, deletedUserQuantitiesResponse, lastWeekUsersResponse, billQuantitiesResponse]) => {
          if (userQuantitiesResponse.status === 'fulfilled')
            setSpecificDetails('userQuantities', new UserQuantities(userQuantitiesResponse.value.data));

          if (deletedUserQuantitiesResponse.status === 'fulfilled')
            setSpecificDetails(
              'deletedUserQuantities',
              new DeletedUserQuantities(deletedUserQuantitiesResponse.value.data)
            );

          if (lastWeekUsersResponse.status === 'fulfilled')
            setSpecificDetails('lastWeekUsers', lastWeekUsersResponse.value.data);

          if (billQuantitiesResponse.status === 'fulfilled') {
            const { quantities, amount } = billQuantitiesResponse.value.data;
            setSpecificDetails('billQuantities', new BillQuantities(quantities, amount));
          }
        }
      );
    }

    Promise.allSettled<[Promise<AxiosResponse<TotalAmount & BillDates>>, Promise<AxiosResponse<LastWeekBillsObj[]>>]>([
      request(new TotalAmountApi().setInitialApi()),
      request(new LastWeekBillsApi().setInitialApi()),
    ]).then(([totalAmountResponse, lastWeekBillsResponse]) => {
      if (totalAmountResponse.status === 'fulfilled') {
        const { start, end, totalAmount, quantities } = totalAmountResponse.value.data;
        setSpecificDetails('totalAmount', new TotalAmount(totalAmount, quantities));
        setSpecificDetails('billDates', new BillDates(start, end));
        setSpecificDetails('periodAmountFilter', new PeriodAmountFilter(start, end));
      }

      if (lastWeekBillsResponse.status === 'fulfilled')
        setSpecificDetails('lastWeekBills', lastWeekBillsResponse.value.data);
    });
  }, []);

  function getNewDateValue(value: string) {
    let newDate = getTime(value);
    const billDates = specificDetails.billDates as BillDates;
    const startDate = billDates.start;
    const endDate = billDates.end;
    if (newDate < startDate) {
      enqueueSnackbar({
        message: `The minimum date is equal to ${moment(startDate).format('ll')}`,
        variant: 'warning',
        autoHideDuration: 7000,
      });
      newDate = startDate;
    } else if (newDate > endDate) {
      enqueueSnackbar({
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

    for (let i = 0; i < specificDetails.lastWeekBills.length; i++)
      chartData[i] = new LastWeekReport({
        date: moment(specificDetails.lastWeekBills[i].date).format('l'),
        billCounts: specificDetails.lastWeekBills[i].count,
        billAmount: specificDetails.lastWeekBills[i].amount,
      });

    for (let i = 0; i < chartData.length && isUserOwnerOrAdmin; i++)
      lastWeekUsersLoop: for (let j = 0; j < specificDetails.lastWeekUsers.length; j++)
        if (
          moment(new Date(chartData[i].date)).format('l') === moment(specificDetails.lastWeekUsers[j].date).format('l')
        ) {
          chartData[i] = Object.assign<LastWeekReport, Partial<LastWeekReport>>(chartData[i], {
            userCounts: specificDetails.lastWeekUsers[i].count,
          });
          break lastWeekUsersLoop;
        }

    return chartData;
  }

  function getNewTotalAmount(
    previousPeriodAmountFilter: PeriodAmountFilter,
    newPeriodAmountFilter: PeriodAmountFilter
  ) {
    request<TotalAmount, PeriodAmountFilter>(new PeriodAmountApi(newPeriodAmountFilter))
      .then((response) => {
        const { totalAmount, quantities } = response.data;
        setSpecificDetails('totalAmount', new TotalAmount(totalAmount, quantities));
      })
      .catch((err) => setSpecificDetails('periodAmountFilter', previousPeriodAmountFilter));
  }

  function changeStartDate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const previousPeriodAmountFilter = specificDetails.periodAmountFilter!;
    const newPeriodAmountFilter = new PeriodAmountFilter(
      getNewDateValue(event.target.value),
      previousPeriodAmountFilter.end
    );
    setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    halfSecDebounce.current(() => getNewTotalAmount(previousPeriodAmountFilter, newPeriodAmountFilter));
  }

  function changeSlider(evnet: Event, value: number | number[]) {
    let [start, end] = value as number[];
    const BillDates = specificDetails.billDates as BillDates;
    const remiderOfEndDates = BillDates.end - end;

    if (remiderOfEndDates < defaultSliderStep) {
      end = BillDates.end;
      setSliderStep(defaultSliderStep + remiderOfEndDates);
    } else setSliderStep(defaultSliderStep);

    const previousPeriodAmountFilter = specificDetails.periodAmountFilter!;
    const newPeriodAmountFilter = new PeriodAmountFilter(getTime(start), getTime(end));
    setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    halfSecDebounce.current(() => getNewTotalAmount(previousPeriodAmountFilter, newPeriodAmountFilter));
  }

  function changeEndDate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const previousPeriodAmountFilter = specificDetails.periodAmountFilter!;
    const newPeriodAmountFilter = new PeriodAmountFilter(
      previousPeriodAmountFilter.start,
      getNewDateValue(event.target.value)
    );
    setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    halfSecDebounce.current(() => getNewTotalAmount(previousPeriodAmountFilter, newPeriodAmountFilter));
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
          gap="16px"
        >
          {isInitialLastWeekBillsApiProcessing ? (
            <Skeleton height="440px" width="100%" />
          ) : (
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

                    if (isUserOwnerOrAdmin) {
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
                            curve: 'smooth',
                          },
                          xaxis: {
                            type: 'category',
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

          {isUserOwnerOrAdmin &&
            (isInitialUserQuantitiesApiProcessing ? (
              <Skeleton width="100%" height="196px" />
            ) : (
              specificDetails.userQuantities && (
                <Card>
                  <CardContent>
                    <Box display="flex" gap="20px" flexDirection="column">
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Total Users:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.userQuantities.quantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Owners:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.userQuantities.ownerQuantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Admins:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.userQuantities.adminQuantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Users:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.userQuantities.userQuantities}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            ))}

          {isUserOwnerOrAdmin &&
            (isInitialDeletedUserQuantitiesApiProcessing ? (
              <Skeleton width="100%" height="196px" />
            ) : (
              specificDetails.deletedUserQuantities && (
                <Card>
                  <CardContent>
                    <Box display="flex" gap="20px" flexDirection="column">
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Total Deleted Users:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.deletedUserQuantities.quantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Deleted Owners:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.deletedUserQuantities.ownerQuantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Deleted Admins:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.deletedUserQuantities.adminQuantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Deleted Users:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.deletedUserQuantities.userQuantities}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            ))}

          {isUserOwnerOrAdmin &&
            (isInitialBillQuantitiesApiProcessing ? (
              <Skeleton width="100%" height="64px" />
            ) : (
              specificDetails.billQuantities && (
                <Card>
                  <CardContent>
                    <Box display="flex" gap="20px" flexDirection="column">
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Total bill quantities of the users:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {specificDetails.billQuantities.quantities}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            ))}

          {isInitialTotalAmountApiProcessing ? (
            <Skeleton width="100%" height="128px" />
          ) : (
            specificDetails.totalAmount &&
            specificDetails.periodAmountFilter &&
            specificDetails.billDates && (
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="center" flexDirection="column" gap="20px">
                    {specificDetails.billDates.start > 0 &&
                      specificDetails.billDates.end > 0 &&
                      specificDetails.billDates.end - specificDetails.billDates.start > getOneDayDate() &&
                      (() => {
                        const slider = (
                          <Slider
                            disabled={isPeriodAmountApiProcessing}
                            value={[specificDetails.periodAmountFilter.start, specificDetails.periodAmountFilter.end]}
                            step={sliderStep}
                            min={specificDetails.billDates.start}
                            max={specificDetails.billDates.end}
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
                                  {moment(specificDetails.periodAmountFilter.start).format('ll')}
                                </Typography>
                                <DateRange fontSize="small" sx={{ color: grey[600] }} />
                              </Box>
                              <Input
                                disabled={isPeriodAmountApiProcessing}
                                type="date"
                                value={moment(specificDetails.periodAmountFilter.start).format('YYYY-MM-DD')}
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
                                  {moment(specificDetails.periodAmountFilter.end).format('ll')}
                                </Typography>
                                <DateRange fontSize="small" sx={{ color: grey[600] }} />
                              </Box>
                              <Input
                                disabled={isPeriodAmountApiProcessing}
                                type="date"
                                value={moment(specificDetails.periodAmountFilter.end).format('YYYY-MM-DD')}
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
                        Total bill quantities:{' '}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                        {specificDetails.totalAmount.quantities}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                      <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                        Total bill Amount:{' '}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                        {specificDetails.totalAmount.totalAmount}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )
          )}
        </Box>
      </MainContainer>
    </Navigation>
  );
};

export default Dashboard;
