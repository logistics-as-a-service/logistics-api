export default class PaginatedResponse {
  data: any;
  page: number;
  pageSize: number;
  totalRecord: number;
  isFirst: boolean;
  isLast: boolean;

  constructor(payload: any, page: number, pageSize: number) {
    this.data = payload.data;
    this.page = page;
    this.pageSize = pageSize;
    this.totalRecord = payload.total;
    this.isFirst = page == 1 ? true : false;
    this.isLast = page * pageSize >= this.totalRecord ? true : false;
  }
}
