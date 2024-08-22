import { AxiosResponse } from 'axios';
import { FC, useEffect, useRef } from 'react';
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
  MostActiveConsumersApi,
  MostActiveLocationsApi,
  MostActiveReceiversApi,
  Request,
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
  RootState,
} from '../../store';
import Skeleton from '../shared/Skeleton';
import Card from '../shared/Card';
import moment from 'moment';
import Navigation from '../../layout/Navigation';
import CardContent from '../shared/CardContent';
import HorizonCarousel from '../shared/HorizonCarousel';
import { MostActiveConsumerObj, MostActiveLocationObj, MostActiveReceiverObj, MostActiveUserObj } from '../../lib';
import { v4 as uuid } from 'uuid';
import {
  initialProcessingApiLoading,
  setSpecificDetails,
  initialProcessingApiError,
  initialProcessingApiSuccess,
  getMostActiveReceivers,
} from '../../store/actions';
import { useDispatch } from '../../hooks/useDispatch';

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
  const dispatch = useDispatch();
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
  const isInitialMostActiveConsumersApiProcessing = request.isInitialApiProcessing(MostActiveConsumersApi);
  const isInitialMostActiveConsumersApiFailed = request.isInitialProcessingApiFailed(MostActiveConsumersApi);
  const isInitialMostActiveConsumersApiSuccessed = request.isInitialProcessingApiSuccessed(MostActiveConsumersApi);
  const isInitialMostActiveLocationsApiProcessing = request.isInitialApiProcessing(MostActiveLocationsApi);
  const isInitialMostActiveLocationsApiFailed = request.isInitialProcessingApiFailed(MostActiveLocationsApi);
  const isInitialMostActiveLocationsApiSuccessed = request.isInitialProcessingApiSuccessed(MostActiveLocationsApi);
  const isInitialMostActiveReceiversApiProcessing = request.isInitialApiProcessing(MostActiveReceiversApi);
  const isInitialMostActiveReceiversApiFailed = request.isInitialProcessingApiFailed(MostActiveReceiversApi);
  const isInitialMostActiveReceiversApiSuccessed = request.isInitialProcessingApiSuccessed(MostActiveReceiversApi);

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

    dispatch(getMostActiveReceivers());

    Promise.allSettled<
      [
        Promise<AxiosResponse<BillQuantities>>,
        Promise<AxiosResponse<LastYearBillsObj[]>>,
        Promise<AxiosResponse<DeletedBillQuantities>>,
        Promise<AxiosResponse<MostActiveConsumerObj[]>>,
        Promise<AxiosResponse<MostActiveLocationObj[]>>
        // Promise<AxiosResponse<MostActiveReceiverObj[]>>
      ]
    >([
      request.build(new BillQuantitiesApi().setInitialApi()),
      request.build(new LastYearBillsApi().setInitialApi()),
      request.build(new DeletedBillQuantitiesApi().setInitialApi()),
      request.build(new MostActiveConsumersApi().setInitialApi()),
      request.build(new MostActiveLocationsApi().setInitialApi()),
      // request.build(new MostActiveReceiversApi().setInitialApi()),
    ]).then(
      ([
        billQuantitiesResponse,
        lastYearBillsResponse,
        deletedBillQuantitiesResponse,
        mostActiveConsumersResponse,
        mostActiveLocationsResponse,
        // mostActiveReceiversResponse,
      ]) => {
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

        if (mostActiveConsumersResponse.status === 'fulfilled')
          actions.setSpecificDetails('mostActiveConsumers', mostActiveConsumersResponse.value.data);

        if (mostActiveLocationsResponse.status === 'fulfilled')
          actions.setSpecificDetails('mostActiveLocations', mostActiveLocationsResponse.value.data);

        // if (mostActiveReceiversResponse.status === 'fulfilled')
        //   actions.setSpecificDetails('mostActiveReceivers', mostActiveReceiversResponse.value.data);
      }
    );
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

  const lastYearChartElIdRef = useRef(uuid());
  useEffect(() => {
    if (chartData.length > 0) {
      const el = document.getElementById(lastYearChartElIdRef.current) as HTMLDivElement | null;
      if (el) {
        const chart = echarts.init(el);
        const series = [
          {
            name: 'Bills',
            data: chartData.map((item) => item.billCounts),
            type: 'line',
            showSymbol: false,
            smooth: true,
            areaStyle: {},
          },
        ];

        if (isCurrentOwnerOrAdmin) {
          series.push({
            name: 'Users',
            data: chartData.map((item) => item.userCounts),
            type: 'line',
            showSymbol: false,
            smooth: true,
            areaStyle: {},
          });
        }

        chart.setOption({
          legend: {
            data: ['Bills', 'Users'],
          },
          grid: {
            top: '30px',
            left: '60px',
            right: '40px',
            bottom: '90px',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
            formatter: (
              params: echarts.EChartOption.Tooltip.Format | echarts.EChartOption.Tooltip.Format[],
              ticket: string,
              callback: (ticket: string, html: string) => void
            ) => {
              const [first, second] = params as echarts.EChartOption.Tooltip.Format[];
              return `
                <div>
                  <p style="margin-bottom: 8px; font-weight: bold;">${moment(
                    new Date(+(first.axisValue as string))
                  ).format('L')}</p>
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px;">
                    <span style="border-radius: 50%; background-color: ${
                      first.color
                    }; width: 15px; height: 15px;"></span>
                    <span>${first.data}</span>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                    <span style="border-radius: 50%; background-color: ${
                      second.color
                    }; width: 15px; height: 15px;"></span>
                    <span>${second.data}</span>
                  </div>
                </div>
              `;
            },
          },
          color: ['#20a0ff', '#ffd320'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.map((item) => item.date),
            axisLabel: {
              show: true,
              formatter: (label: string) => {
                return moment(new Date(+label)).format('L');
              },
            },
            axisPointer: {
              show: true,
              label: {
                formatter: (label: any) => {
                  return moment(new Date(+label.value)).format('L');
                },
              },
            },
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            axisPointer: {
              show: true,
              label: {
                formatter: (label: any) => {
                  return parseInt(label.value);
                },
              },
            },
            axisLabel: { show: true },
          },
          series,
          dataZoom: [
            {
              show: true,
              filterMode: 'filter',
              type: 'slider',
              start: 0,
              end: 100,
              bottom: '20px',
              // @ts-ignore
              showDataShadow: false,
              labelFormatter: (label: number, value: string) => {
                return moment(new Date(+value)).format('L');
              },
            },
            {
              type: 'inside',
              start: 0,
              end: 100,
            },
          ],
        });

        const onResize = () => {
          chart.resize();
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }
    }
  }, [chartData]);

  const consumersChartElIdRef = useRef(uuid());
  useEffect(() => {
    if (selectors.specificDetails.mostActiveConsumers.length > 0) {
      const el = document.getElementById(consumersChartElIdRef.current) as HTMLDivElement | null;
      if (el) {
        const chart = echarts.init(el);
        chart.setOption({
          title: {
            text: 'Most active consumers',
            left: 'center',
            textStyle: { fontSize: 14, fontWeight: 700 },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)',
          },
          series: [
            {
              type: 'pie',
              radius: [20, 110],
              center: ['50%', '55%'],
              itemStyle: {
                borderRadius: 5,
              },
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
              data: selectors.specificDetails.mostActiveConsumers.map((item) => ({
                value: item.quantities,
                name: item.consumer.name,
              })),
            },
          ],
        });

        const onResize = () => {
          chart.resize();
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }
    }
  }, [selectors.specificDetails.mostActiveConsumers]);

  const receiversChartElIdRef = useRef(uuid());
  useEffect(() => {
    if (selectors.specificDetails.mostActiveReceivers.length > 0) {
      const el = document.getElementById(receiversChartElIdRef.current) as HTMLDivElement | null;
      if (el) {
        const chart = echarts.init(el);
        chart.setOption({
          title: {
            text: 'Most active receivers',
            left: 'center',
            textStyle: { fontSize: 14, fontWeight: 700 },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)',
          },
          series: [
            {
              type: 'pie',
              radius: [20, 110],
              center: ['50%', '55%'],
              itemStyle: {
                borderRadius: 5,
              },
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
              data: selectors.specificDetails.mostActiveReceivers.map((item) => ({
                value: item.quantities,
                name: item.receiver.name,
              })),
            },
          ],
        });

        const onResize = () => {
          chart.resize();
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }
    }
  }, [selectors.specificDetails.mostActiveReceivers]);

  const locationsChartElIdRef = useRef(uuid());
  useEffect(() => {
    if (selectors.specificDetails.mostActiveLocations.length > 0) {
      const el = document.getElementById(locationsChartElIdRef.current) as HTMLDivElement | null;
      if (el) {
        const chart = echarts.init(el);
        chart.setOption({
          title: {
            text: 'Most active Locations',
            left: 'center',
            textStyle: { fontSize: 14, fontWeight: 700 },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)',
          },
          series: [
            {
              type: 'pie',
              radius: [20, 110],
              center: ['50%', '55%'],
              itemStyle: {
                borderRadius: 5,
              },
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
              data: selectors.specificDetails.mostActiveLocations.map((item) => ({
                value: item.quantities,
                name: item.location.name,
              })),
            },
          ],
        });

        const onResize = () => {
          chart.resize();
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }
    }
  }, [selectors.specificDetails.mostActiveLocations]);

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
                  <CardContent
                    style={{ position: 'relative', height: '429px', overflow: 'hidden' }}
                    id={lastYearChartElIdRef.current}
                  ></CardContent>
                </Card>
              )
            )}
          </Box>

          <DeviceWrapper>
            <Box sx={{ width: '100%', height: '100%', minHeight: '350px' }}>
              {isInitialMostActiveConsumersApiProcessing ? (
                <Skeleton height="350px" width="100%" />
              ) : isInitialMostActiveConsumersApiFailed ? (
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
                      Failed to load the most active consumers chart.
                    </Typography>
                  </Box>
                </Card>
              ) : isInitialMostActiveConsumersApiSuccessed &&
                selectors.specificDetails.mostActiveConsumers.length > 0 ? (
                <Card>
                  <CardContent
                    style={{ position: 'relative', height: '350px', overflow: 'hidden' }}
                    id={consumersChartElIdRef.current}
                  ></CardContent>
                </Card>
              ) : (
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
                      sx={{ wordBreak: 'break-word' }}
                    >
                      No consumers exist.
                    </Typography>
                  </Box>
                </Card>
              )}
            </Box>
            <Box sx={{ width: '100%', height: '100%', minHeight: '350px' }}>
              {isInitialMostActiveReceiversApiProcessing ? (
                <Skeleton height="350px" width="100%" />
              ) : isInitialMostActiveReceiversApiFailed ? (
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
                      Failed to load the most active receivers chart.
                    </Typography>
                  </Box>
                </Card>
              ) : isInitialMostActiveReceiversApiSuccessed &&
                selectors.specificDetails.mostActiveReceivers.length > 0 ? (
                <Card>
                  <CardContent
                    style={{ position: 'relative', height: '350px', overflow: 'hidden' }}
                    id={receiversChartElIdRef.current}
                  ></CardContent>
                </Card>
              ) : (
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
                      sx={{ wordBreak: 'break-word' }}
                    >
                      No receivers exist.
                    </Typography>
                  </Box>
                </Card>
              )}
            </Box>
            <Box sx={{ width: '100%', height: '100%', minHeight: '350px' }}>
              {isInitialMostActiveLocationsApiProcessing ? (
                <Skeleton height="350px" width="100%" />
              ) : isInitialMostActiveLocationsApiFailed ? (
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
                      Failed to load the most active locations chart.
                    </Typography>
                  </Box>
                </Card>
              ) : isInitialMostActiveLocationsApiSuccessed &&
                selectors.specificDetails.mostActiveLocations.length > 0 ? (
                <Card>
                  <CardContent
                    style={{ position: 'relative', height: '350px', overflow: 'hidden' }}
                    id={locationsChartElIdRef.current}
                  ></CardContent>
                </Card>
              ) : (
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
                      sx={{ wordBreak: 'break-word' }}
                    >
                      No locations exist.
                    </Typography>
                  </Box>
                </Card>
              )}
            </Box>
          </DeviceWrapper>

          {isCurrentOwner && (
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
                    <HorizonCarousel infinity height="53px">
                      {selectors.specificDetails.mostActiveUsers.map((item) => (
                        <Card key={item.user.id}>
                          <CardContent>
                            <Box display="flex" gap="20px" flexDirection="column">
                              <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                                <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                  {item.user.firstName} {item.user.lastName}:{' '}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                  {item.quantities}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </HorizonCarousel>
                  )
                )}
              </Box>
            </Box>
          )}

          <DeviceWrapper>
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
                      Failed to load bill quantities.
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
                            Bill quantities:{' '}
                          </Typography>
                          <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                            {selectors.specificDetails.billquantities.quantities}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                          <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Bill amounts:{' '}
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
                      Failed to load deleted bill quantities.
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
                        <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                          <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Deleted bill amounts:{' '}
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
          </DeviceWrapper>

          {isCurrentOwnerOrAdmin && (
            <DeviceWrapper>
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
                        Failed to load the all bill quantities.
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
                          <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                            <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                              All bill amounts:{' '}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                              {selectors.specificDetails.allBillQuantities.amount}
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
                        Failed to load all deleted bill quantities.
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
                          <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                            <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                              All deleted bill amounts:{' '}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                              {selectors.specificDetails.allDeletedBillQuantities.amount}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  )
                )}
              </Box>
            </DeviceWrapper>
          )}

          {isCurrentOwnerOrAdmin && (
            <DeviceWrapper>
              <Box width="100%" height="100%">
                <Box sx={{ width: '100%', height: '100%', minHeight: '178px' }}>
                  {isInitialUserQuantitiesApiProcessing ? (
                    <Skeleton width="100%" height="178px" />
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
                            <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                              <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Owners:{' '}
                              </Typography>
                              <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                {selectors.specificDetails.userQuantities.ownerQuantities}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                              <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Admins:{' '}
                              </Typography>
                              <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                {selectors.specificDetails.userQuantities.adminQuantities}
                              </Typography>
                            </Box>
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
                    )
                  )}
                </Box>
              </Box>
              <Box width="100%" height="100%">
                <Box sx={{ width: '100%', height: '100%', minHeight: '178px' }}>
                  {isInitialDeletedUserQuantitiesApiProcessing ? (
                    <Skeleton width="100%" height="178px" />
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
                            <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                              <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Deleted Owners:{' '}
                              </Typography>
                              <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                {selectors.specificDetails.deletedUserQuantities.ownerQuantities}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                              <Typography whiteSpace="nowrap" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Deleted Admins:{' '}
                              </Typography>
                              <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                                {selectors.specificDetails.deletedUserQuantities.adminQuantities}
                              </Typography>
                            </Box>
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
                    )
                  )}
                </Box>
              </Box>
            </DeviceWrapper>
          )}

          {isCurrentOwner && (
            <DeviceWrapper>
              <Box width="100%" height="100%">
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
              </Box>
              <Box width="100%" height="100%">
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
                          Failed to load all notification quantities.
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
              </Box>
            </DeviceWrapper>
          )}
        </Box>
      </MainContainer>
    </Navigation>
  );
};

export default Dashboard;
