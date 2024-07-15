import { lazy } from 'react';

interface GetDynamicPathOptions {
  [key: string]: string | number;
}

const Bill = lazy(() => import('../../pages/Bill'));
const Bills = lazy(() => import('../../pages/Bills'));
const AllBills = lazy(() => import('../../pages/AllBills'));
const Notification = lazy(() => import('../../pages/Notification'));
const Notifications = lazy(() => import('../../pages/Notifications'));
const CreateBill = lazy(() => import('../../pages/CreateBill'));
const CreateUser = lazy(() => import('../../pages/CreateUser'));
const UpdateBill = lazy(() => import('../../pages/UpdateBill'));
const UpdateUserByOwner = lazy(() => import('../../pages/UpdateUserByOwner'));
const UpdateUserByUser = lazy(() => import('../../pages/UpdateUser'));
const User = lazy(() => import('../../pages/User'));
const Users = lazy(() => import('../../pages/Users'));
const DeletedUsers = lazy(() => import('../../pages/DeletedUsers'));
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const DeletedUser = lazy(() => import('../../pages/DeletedUser'));
const DeletedBills = lazy(() => import('../../pages/DeletedBills'));
const DeletedBill = lazy(() => import('../../pages/DeletedBill'));
const Chat = lazy(() => import('../../pages/Chat'));
const Receivers = lazy(() => import('../../pages/Receivers'));
const Locations = lazy(() => import('../../pages/Locations'));
const Consumers = lazy(() => import('../../pages/Consumers'));
const Receiver = lazy(() => import('../../pages/Receiver'));
const Location = lazy(() => import('../../pages/Location'));
const Consumer = lazy(() => import('../../pages/Consumer'));
const UpdateReceiver = lazy(() => import('../../pages/UpdateReceiver'));
const UpdateLocation = lazy(() => import('../../pages/UpdateLocation'));

export enum Pathes {
  BANK = '/bank/*',
  LOGIN = '/auth/login',
  DASHBOARD = '/bank/dashboard',
  BILLS = '/bank/bills',
  ALL_BILLS = '/bank/owner/bills',
  DELETED_bILLS = '/bank/bills/deleted',
  USERS = '/bank/users',
  NOTIFICATIONS = '/bank/notifications',
  DELETED_USERS = '/bank/users/deleted',
  CREATE_BILL = '/bank/create-bill',
  CREATE_USER = '/bank/create-user',
  UPDATE_USER_BY_OWNER = '/bank/owner/update-user/:id',
  UPDATE_USER = '/bank/update-user/:id',
  UPDATE_BILL = '/bank/update-bill/:id',
  UPDATE_RECEIVER = '/bank/update-receiver/:id',
  UPDATE_LOCATION = '/bank/update-location/:id',
  UPDATE_CONSUMER = '/bank/update-consumer/:id',
  USER = '/bank/users/:id',
  BILL = '/bank/bills/:id',
  NOTIFICATION = '/bank/notifications/:id',
  DELETED_USER = '/bank/users/:id/deleted',
  DELETED_BILL = '/bank/bills/:id/deleted',
  CHAT = '/bank/chat',
  RECEIVERS = '/bank/receivers',
  RECEIVER = '/bank/receivers/:id',
  LOCATIONS = '/bank/locations',
  LOCATION = '/bank/locations/:id',
  CONSUMERS = '/bank/consumers',
  CONSUMER = '/bank/consumers/:id',
}

export const routes = [
  { title: 'Dashboard', path: Pathes.DASHBOARD, element: <Dashboard />, needAuth: true },
  { title: 'Bills', path: Pathes.BILLS, element: <Bills />, needAuth: true },
  { title: 'All bills', path: Pathes.ALL_BILLS, element: <AllBills />, needAuth: true },
  { title: 'Deleted bills', path: Pathes.DELETED_bILLS, element: <DeletedBills />, needAuth: true },
  { title: 'Users', path: Pathes.USERS, element: <Users />, needAuth: true },
  { title: 'Receivers', path: Pathes.RECEIVERS, element: <Receivers />, needAuth: true },
  { title: 'Locations', path: Pathes.LOCATIONS, element: <Locations />, needAuth: true },
  { title: 'Consumers', path: Pathes.CONSUMERS, element: <Consumers />, needAuth: true },
  { path: Pathes.CHAT, element: <Chat />, needAuth: true },
  { title: 'Deleted users', path: Pathes.DELETED_USERS, element: <DeletedUsers />, needAuth: true },
  { title: 'Notifications', path: Pathes.NOTIFICATIONS, element: <Notifications />, needAuth: true },
  { title: 'Create bill', path: Pathes.CREATE_BILL, element: <CreateBill />, needAuth: true },
  { title: 'Create user', path: Pathes.CREATE_USER, element: <CreateUser />, needAuth: true },
  { title: 'Update user by owner', path: Pathes.UPDATE_USER_BY_OWNER, element: <UpdateUserByOwner />, needAuth: true },
  { title: 'Update user', path: Pathes.UPDATE_USER, element: <UpdateUserByUser />, needAuth: true },
  { title: 'Update bill', path: Pathes.UPDATE_BILL, element: <UpdateBill />, needAuth: true },
  { title: 'Update receiver', path: Pathes.UPDATE_RECEIVER, element: <UpdateReceiver />, needAuth: true },
  { title: 'Update location', path: Pathes.UPDATE_LOCATION, element: <UpdateLocation />, needAuth: true },
  { title: 'User', path: Pathes.USER, element: <User />, needAuth: true },
  { title: 'Bill', path: Pathes.BILL, element: <Bill />, needAuth: true },
  { title: 'Receiver', path: Pathes.RECEIVER, element: <Receiver />, needAuth: true },
  { title: 'Location', path: Pathes.LOCATION, element: <Location />, needAuth: true },
  { title: 'Consumer', path: Pathes.CONSUMER, element: <Consumer />, needAuth: true },
  { title: 'Notification', path: Pathes.NOTIFICATION, element: <Notification />, needAuth: true },
  { title: 'Deleted User', path: Pathes.DELETED_USER, element: <DeletedUser />, needAuth: true },
  { title: 'Deleted Bill', path: Pathes.DELETED_BILL, element: <DeletedBill />, needAuth: true },
];

export function getDynamicPath(path: Pathes, options: GetDynamicPathOptions): string {
  let dynamicQuery = '';
  let newPath: string | Pathes = path;

  for (const key in options) {
    dynamicQuery = `:${key}`;
    if (path.includes(dynamicQuery)) {
      newPath = newPath.replace(dynamicQuery, options[key].toString());
    } else {
      continue;
    }
  }

  return newPath;
}
