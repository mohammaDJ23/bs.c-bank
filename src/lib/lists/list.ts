export class List<T extends any = any> {
  public list: T[];
  public page: number;
  public take: number;
  public total: number;

  constructor(arg: Partial<List> = {}) {
    this.list = arg.list || [];
    this.page = arg.page || 1;
    this.take = arg.take || 10;
    this.total = arg.total || 0;
  }
}

export interface ListParams<Filters extends Record<string, any> = Record<string, any>> {
  page?: number;
  take?: number;
  filters?: Filters;
}
