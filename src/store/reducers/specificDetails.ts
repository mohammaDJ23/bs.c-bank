import { Bill, Consumer, User, Location, Notification, Receiver, UserStatusObj, UserWithBillInfo } from '../../lib';
import { RootActions, SetSpecificDetailsAction } from '../actions';
import { ClearState } from './clearState';

export enum SpecificDetails {
  SET_SPECIFIC_DETAILS = 'SET_SPECIFIC_DETAILS',
}

export class LastYearReport {
  public date: number;
  public billCounts: number;
  public billAmount: string;
  public userCounts: number;

  constructor({ date = 0, billCounts = 0, billAmount = '0', userCounts = 0 }: Partial<LastYearReport> = {}) {
    this.date = date;
    this.billCounts = billCounts;
    this.billAmount = billAmount;
    this.userCounts = userCounts;
  }
}

export class BillQuantities {
  constructor(public amount: string, public quantities: string) {}
}

export class DeletedBillQuantities extends BillQuantities {}

export interface LastYearBillsObj {
  count: number;
  amount: string;
  date: number;
}

export class AllBillQuantities {
  constructor(public amount: string, public quantities: string) {}
}

export class AllDeletedBillQuantities extends AllBillQuantities {}

export class NotificationQuantities {
  constructor(public quantities: string) {}
}

export class AllNotificationQuantities {
  constructor(public quantities: string) {}
}

export interface LastYearUsersObj {
  count: number;
  date: number;
}

export class UserQuantities {
  public quantities: number;
  public ownerQuantities: number;
  public adminQuantities: number;
  public userQuantities: number;

  constructor(arg: UserQuantities) {
    this.quantities = arg.quantities;
    this.ownerQuantities = arg.ownerQuantities;
    this.adminQuantities = arg.adminQuantities;
    this.userQuantities = arg.userQuantities;
  }
}

export class DeletedUserQuantities {
  public quantities: number;
  public ownerQuantities: number;
  public adminQuantities: number;
  public userQuantities: number;

  constructor(arg: DeletedUserQuantities) {
    this.quantities = arg.quantities;
    this.ownerQuantities = arg.ownerQuantities;
    this.adminQuantities = arg.adminQuantities;
    this.userQuantities = arg.userQuantities;
  }
}

export type UsersStatusType = Record<number, UserStatusObj>;

export interface SpecificDetailsState {
  user: User | null;
  userWithBillInfo: UserWithBillInfo | null;
  bill: Bill | null;
  receiver: Receiver | null;
  location: Location | null;
  consumer: Consumer | null;
  billquantities: BillQuantities | null;
  deletedBillQuantities: AllDeletedBillQuantities | null;
  lastYearBills: LastYearBillsObj[];
  lastYearUsers: LastYearUsersObj[];
  userQuantities: UserQuantities | null;
  deletedUserQuantities: DeletedUserQuantities | null;
  allBillQuantities: AllBillQuantities | null;
  allDeletedBillQuantities: AllDeletedBillQuantities | null;
  deletedUser: User | null;
  deletedBill: Bill | null;
  notification: Notification | null;
  notificationQuantities: NotificationQuantities | null;
  allNotificationQuantities: AllNotificationQuantities | null;
  usersStatus: UsersStatusType;
}

const initialState: SpecificDetailsState = {
  user: null,
  userWithBillInfo: null,
  bill: null,
  receiver: null,
  location: null,
  consumer: null,
  billquantities: null,
  deletedBillQuantities: null,
  lastYearBills: [],
  lastYearUsers: [],
  userQuantities: null,
  deletedUserQuantities: null,
  allBillQuantities: null,
  allDeletedBillQuantities: null,
  deletedUser: null,
  deletedBill: null,
  notification: null,
  notificationQuantities: null,
  allNotificationQuantities: null,
  usersStatus: {},
};

function setSpecificDetails(state: SpecificDetailsState, action: SetSpecificDetailsAction): SpecificDetailsState {
  return {
    ...state,
    [action.payload.key]: action.payload.data,
  };
}

function cleanState(state: SpecificDetailsState): SpecificDetailsState {
  return {
    ...state,
    user: null,
    userWithBillInfo: null,
    bill: null,
    receiver: null,
    location: null,
    consumer: null,
    billquantities: null,
    deletedBillQuantities: null,
    lastYearBills: [],
    lastYearUsers: [],
    userQuantities: null,
    deletedUserQuantities: null,
    allBillQuantities: null,
    allDeletedBillQuantities: null,
    deletedUser: null,
    deletedBill: null,
    notification: null,
    notificationQuantities: null,
    allNotificationQuantities: null,
  };
}

export function specificDetailsReducer(
  state: SpecificDetailsState = initialState,
  actions: RootActions
): SpecificDetailsState {
  switch (actions.type) {
    case SpecificDetails.SET_SPECIFIC_DETAILS:
      return setSpecificDetails(state, actions);

    case ClearState.CLEAR_STATE:
      return cleanState(state);

    default:
      return state;
  }
}
