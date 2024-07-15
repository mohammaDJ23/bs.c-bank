import {
  BillObj,
  DeletedUserObj,
  LocationObj,
  NotificationObj,
  ReceiverObj,
  UserObj,
  UserStatusObj,
  UserWithBillInfoObj,
} from '../../lib';
import { RootActions, SetSpecificDetailsAction } from '../actions';
import { ClearState } from './clearState';

export enum SpecificDetails {
  SET_SPECIFIC_DETAILS = 'SET_SPECIFIC_DETAILS',
}

export class LastWeekReport {
  public date: number;
  public billCounts: number;
  public billAmount: string;
  public userCounts: number;

  constructor({ date = 0, billCounts = 0, billAmount = '0', userCounts = 0 }: Partial<LastWeekReport> = {}) {
    this.date = date;
    this.billCounts = billCounts;
    this.billAmount = billAmount;
    this.userCounts = userCounts;
  }
}

export class TotalAmount {
  constructor(
    public totalAmount: string,
    public quantities: string,
    public dateLessTotalAmount: string,
    public dateLessQuantities: string
  ) {}
}

export interface LastWeekBillsObj {
  count: number;
  amount: string;
  date: number;
}

export class AllBillQuantities {
  constructor(public quantities: string, public amount: string) {}
}

export class AllDeletedBillQuantities {
  constructor(public quantities: string, public amount: string) {}
}

export class DeletedBillQuantities {
  constructor(public quantities: string, public amount: string) {}
}

export class NotificationQuantities {
  constructor(public quantities: string) {}
}

export class AllNotificationQuantities {
  constructor(public quantities: string) {}
}

export interface LastWeekUsersObj {
  count: number;
  date: number;
}

export class PeriodAmountFilter {
  constructor(public start: number, public end: number) {}
}

export class BillDates {
  constructor(public start: number, public end: number) {}
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
  user: UserObj | null;
  userWithBillInfo: UserWithBillInfoObj | null;
  bill: BillObj | null;
  receiver: ReceiverObj | null;
  location: LocationObj | null;
  totalAmount: TotalAmount | null;
  periodAmountFilter: PeriodAmountFilter | null;
  lastWeekBills: LastWeekBillsObj[];
  lastWeekUsers: LastWeekUsersObj[];
  billDates: BillDates | null;
  userQuantities: UserQuantities | null;
  deletedUserQuantities: DeletedUserQuantities | null;
  allBillQuantities: AllBillQuantities | null;
  deletedBillQuantities: DeletedBillQuantities | null;
  allDeletedBillQuantities: AllDeletedBillQuantities | null;
  deletedUser: DeletedUserObj | null;
  deletedBill: BillObj | null;
  notification: NotificationObj | null;
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
  totalAmount: null,
  periodAmountFilter: null,
  lastWeekBills: [],
  lastWeekUsers: [],
  billDates: null,
  userQuantities: null,
  deletedUserQuantities: null,
  allBillQuantities: null,
  allDeletedBillQuantities: null,
  deletedBillQuantities: null,
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
    totalAmount: null,
    periodAmountFilter: null,
    lastWeekBills: [],
    lastWeekUsers: [],
    billDates: null,
    userQuantities: null,
    deletedUserQuantities: null,
    allBillQuantities: null,
    allDeletedBillQuantities: null,
    deletedBillQuantities: null,
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
