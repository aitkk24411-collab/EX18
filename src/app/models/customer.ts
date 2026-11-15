export interface ICustomer {
  Id: string;
  Name: string;
  Email: string;
  Age: number;
  Image: string;
}

export interface ICustomerGroup {
  CustomerTypeId: number;
  // Giữ nguyên tên trường theo đề bài.
  CustomterTypeName: string;
  Customers: ICustomer[];
}
