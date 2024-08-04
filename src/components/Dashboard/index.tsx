import { AxiosResponse } from 'axios';
import { FC, Fragment, useEffect } from 'react';
import { Box, styled, Typography } from '@mui/material';
import {
  AllBillQuantitiesApi,
  AllDeletedBillQuantitiesApi,
  AllNotificationQuantitiesApi,
  DeletedBillQuantitiesApi,
  DeletedUserQuantitiesApi,
  LastYearBillsApi,
  LastYearUsersApi,
  NotificationQuantitiesApi,
  BillQuantitiesApi,
  UserQuantitiesApi,
  MostActiveUsersApi,
} from '../../apis';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import MainContainer from '../../layout/MainContainer';
import {
  AllBillQuantities,
  DeletedUserQuantities,
  LastYearBillsObj,
  LastYearReport,
  LastYearUsersObj,
  UserQuantities,
  DeletedBillQuantities,
  AllDeletedBillQuantities,
  NotificationQuantities,
  AllNotificationQuantities,
  BillQuantities,
} from '../../store';
import Skeleton from '../shared/Skeleton';
import Card from '../shared/Card';
import moment from 'moment';
import Navigation from '../../layout/Navigation';
import Chart from 'react-apexcharts';
import VerticalCarousel from '../shared/VerticalCarousel';
import CardContent from '../shared/CardContent';
import HorizonCarousel from '../shared/HorizonCarousel';
import { MostActiveUserObj } from '../../lib';

const DeviceWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const Dashboard: FC = () => {
  const request = useRequest();
  const auth = useAuth();
  const actions = useAction();
  const selectors = useSelector();
  const isCurrentAdmin = auth.isCurrentAdmin();
  const isCurrentOwner = auth.isCurrentOwner();
  const isCurrentOwnerOrAdmin = isCurrentOwner || isCurrentAdmin;
  const isInitialBillQuantitiesApiProcessing = request.isInitialApiProcessing(BillQuantitiesApi);
  const isInitialBillQuantitiesApiFailed = request.isInitialProcessingApiFailed(BillQuantitiesApi);
  const isInitialBillQuantitiesApiSuccessed = request.isInitialProcessingApiSuccessed(BillQuantitiesApi);
  const isInitialLastYearBillsApiProcessing = request.isInitialApiProcessing(LastYearBillsApi);
  const isInitialLastYearBillsApiFailed = request.isInitialProcessingApiFailed(LastYearBillsApi);
  const isInitialLastYearBillsApiSuccessed = request.isInitialProcessingApiSuccessed(LastYearBillsApi);
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
  const isInitialMostActiveUsersApiProcessing = request.isInitialApiProcessing(MostActiveUsersApi);
  const isInitialMostActiveUsersApiFailed = request.isInitialProcessingApiFailed(MostActiveUsersApi);
  const isInitialMostActiveUsersApiSuccessed = request.isInitialProcessingApiSuccessed(MostActiveUsersApi);

  useEffect(() => {
    if (isCurrentOwner) {
      Promise.allSettled<
        [
          Promise<AxiosResponse<NotificationQuantities>>,
          Promise<AxiosResponse<AllNotificationQuantities>>,
          Promise<AxiosResponse<MostActiveUserObj[]>>
        ]
      >([
        request.build(new NotificationQuantitiesApi().setInitialApi()),
        request.build(new AllNotificationQuantitiesApi().setInitialApi()),
        request.build(new MostActiveUsersApi().setInitialApi()),
      ]).then(([notificationQuantitiesResponse, allNotificationQuantitiesResponse, mostActiveUsersResponse]) => {
        if (notificationQuantitiesResponse.status === 'fulfilled')
          actions.setSpecificDetails('notificationQuantities', notificationQuantitiesResponse.value.data);

        if (allNotificationQuantitiesResponse.status === 'fulfilled')
          actions.setSpecificDetails('allNotificationQuantities', allNotificationQuantitiesResponse.value.data);

        if (mostActiveUsersResponse.status === 'fulfilled')
          actions.setSpecificDetails('mostActiveUsers', mostActiveUsersResponse.value.data);
      });
    }

    if (isCurrentOwnerOrAdmin) {
      Promise.allSettled<
        [
          Promise<AxiosResponse<UserQuantities>>,
          Promise<AxiosResponse<DeletedUserQuantities>>,
          Promise<AxiosResponse<LastYearUsersObj[]>>,
          Promise<AxiosResponse<AllBillQuantities>>,
          Promise<AxiosResponse<AllDeletedBillQuantities>>
        ]
      >([
        request.build(new UserQuantitiesApi().setInitialApi()),
        request.build(new DeletedUserQuantitiesApi().setInitialApi()),
        request.build(new LastYearUsersApi().setInitialApi()),
        request.build(new AllBillQuantitiesApi().setInitialApi()),
        request.build(new AllDeletedBillQuantitiesApi().setInitialApi()),
      ]).then(
        ([
          userQuantitiesResponse,
          deletedUserQuantitiesResponse,
          lastYearUsersResponse,
          allBillQuantitiesResponse,
          allDeletedBillQuantitiesResponse,
        ]) => {
          if (userQuantitiesResponse.status === 'fulfilled')
            actions.setSpecificDetails('userQuantities', new UserQuantities(userQuantitiesResponse.value.data));

          if (deletedUserQuantitiesResponse.status === 'fulfilled')
            actions.setSpecificDetails(
              'deletedUserQuantities',
              new DeletedUserQuantities(deletedUserQuantitiesResponse.value.data)
            );

          if (lastYearUsersResponse.status === 'fulfilled')
            actions.setSpecificDetails('lastYearUsers', lastYearUsersResponse.value.data);

          if (allBillQuantitiesResponse.status === 'fulfilled') {
            const { quantities, amount } = allBillQuantitiesResponse.value.data;
            actions.setSpecificDetails('allBillQuantities', new AllBillQuantities(amount, quantities));
          }

          if (allDeletedBillQuantitiesResponse.status === 'fulfilled') {
            const { quantities, amount } = allDeletedBillQuantitiesResponse.value.data;
            actions.setSpecificDetails('allDeletedBillQuantities', new AllDeletedBillQuantities(amount, quantities));
          }
        }
      );
    }

    Promise.allSettled<
      [
        Promise<AxiosResponse<BillQuantities>>,
        Promise<AxiosResponse<LastYearBillsObj[]>>,
        Promise<AxiosResponse<DeletedBillQuantities>>
      ]
    >([
      request.build(new BillQuantitiesApi().setInitialApi()),
      request.build(new LastYearBillsApi().setInitialApi()),
      request.build(new DeletedBillQuantitiesApi().setInitialApi()),
    ]).then(([billQuantitiesResponse, lastYearBillsResponse, deletedBillQuantitiesResponse]) => {
      if (billQuantitiesResponse.status === 'fulfilled') {
        const { quantities, amount } = billQuantitiesResponse.value.data;
        actions.setSpecificDetails('billquantities', new BillQuantities(amount, quantities));
      }

      if (lastYearBillsResponse.status === 'fulfilled')
        actions.setSpecificDetails('lastYearBills', lastYearBillsResponse.value.data);

      if (deletedBillQuantitiesResponse.status === 'fulfilled') {
        const { quantities, amount } = deletedBillQuantitiesResponse.value.data;
        actions.setSpecificDetails('deletedBillQuantities', new DeletedBillQuantities(amount, quantities));
      }
    });
  }, []);

  function getChartData() {
    let chartData: LastYearReport[] = [];

    for (let i = 0; i < selectors.specificDetails.lastYearBills.length; i++)
      chartData[i] = new LastYearReport({
        date: selectors.specificDetails.lastYearBills[i].date,
        billCounts: selectors.specificDetails.lastYearBills[i].count,
        billAmount: selectors.specificDetails.lastYearBills[i].amount,
      });

    for (let i = 0; i < chartData.length && isCurrentOwnerOrAdmin; i++)
      lastYearUsersLoop: for (let j = 0; j < selectors.specificDetails.lastYearUsers.length; j++)
        if (
          moment(new Date(chartData[i].date)).format('l') ===
          moment(selectors.specificDetails.lastYearUsers[j].date).format('l')
        ) {
          chartData[i] = Object.assign<LastYearReport, Partial<LastYearReport>>(chartData[i], {
            userCounts: selectors.specificDetails.lastYearUsers[i].count,
          });
          break lastYearUsersLoop;
        }

    return chartData;
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
            {isInitialLastYearBillsApiProcessing ? (
              <Skeleton height="429px" width="100%" />
            ) : isInitialLastYearBillsApiFailed ? (
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
              isInitialLastYearBillsApiSuccessed &&
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
            <DeviceWrapper>
              <Box width="100%" height="100%">
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
              <Box width="100%" height="100%">
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
            </DeviceWrapper>
          )}

          {isCurrentOwnerOrAdmin && (
            <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
              {isInitialAllBillQuantitiesApiProcessing || isInitialAllDeletedBillQuantitiesApiProcessing ? (
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
                isInitialAllBillQuantitiesApiSuccessed &&
                selectors.specificDetails.allBillQuantities &&
                isInitialAllDeletedBillQuantitiesApiSuccessed &&
                selectors.specificDetails.allDeletedBillQuantities && (
                  <HorizonCarousel infinity height="55px">
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
                  </HorizonCarousel>
                )
              )}
            </Box>
          )}

          {isCurrentOwner && (
            <DeviceWrapper>
              <Box width="100%" height="100%">
                <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
                  {isInitialAllNotificationQuantitiesApiProcessing || isInitialNotificationQuantitiesApiProcessing ? (
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
                          Failed to load your notification quantities.
                        </Typography>
                      </Box>
                    </Card>
                  ) : (
                    isInitialAllNotificationQuantitiesApiSuccessed &&
                    selectors.specificDetails.allNotificationQuantities &&
                    isInitialNotificationQuantitiesApiSuccessed &&
                    selectors.specificDetails.notificationQuantities && (
                      <VerticalCarousel infinity height="55px">
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
                        <Card>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  Your notification quantities:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {selectors.specificDetails.notificationQuantities.quantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </VerticalCarousel>
                    )
                  )}
                </Box>
              </Box>
              <Box width="100%" height="100%">
                <Box sx={{ width: '100%', height: '100%', minHeight: '53px' }}>
                  {isInitialMostActiveUsersApiProcessing ? (
                    <Skeleton width="100%" height="53px" />
                  ) : isInitialMostActiveUsersApiFailed ? (
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
                          Failed to load the most active users.
                        </Typography>
                      </Box>
                    </Card>
                  ) : (
                    isInitialMostActiveUsersApiSuccessed &&
                    selectors.specificDetails.mostActiveUsers.length > 0 && (
                      <VerticalCarousel infinity height="55px">
                        {selectors.specificDetails.mostActiveUsers.map((item) => (
                          <Card key={item.user.id}>
                            <CardContent>
                              <Box display="flex" gap="20px" flexDirection="column">
                                <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                  <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                    {`${item.user.firstName} ${item.user.lastName}`}:
                                  </Typography>
                                  <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                    {item.quantities}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </VerticalCarousel>
                    )
                  )}
                </Box>
              </Box>
            </DeviceWrapper>
          )}

          <Box sx={{ width: '100%', height: '100%', minHeight: '96px' }}>
            {isInitialBillQuantitiesApiProcessing ? (
              <Skeleton width="100%" height="96px" />
            ) : isInitialBillQuantitiesApiFailed ? (
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
                    Failed to load your bill quantities.
                  </Typography>
                </Box>
              </Card>
            ) : (
              isInitialBillQuantitiesApiSuccessed &&
              selectors.specificDetails.billquantities && (
                <Card>
                  <CardContent>
                    <Box display="flex" gap="20px" flexDirection="column">
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Your bill quantities:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.billquantities.quantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Your bill amounts:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.billquantities.amount}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            )}
          </Box>

          <Box sx={{ width: '100%', height: '100%', minHeight: '96px' }}>
            {isInitialDeletedBillQuantitiesApiProcessing ? (
              <Skeleton width="100%" height="96px" />
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
                    Failed to load your deleted bill quantities.
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
                          Your deleted bill quantities:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.deletedBillQuantities.quantities}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                        <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          Your deleted bill amounts:{' '}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {selectors.specificDetails.deletedBillQuantities.amount}
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
