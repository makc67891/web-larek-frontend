export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ICard extends IProduct{
  index?: string;
  buttonTitle? : string;
}

export interface ICardInBasket {
	index: number;
	title: string;
	price: number | null;
}

export interface IAppData {
  catalog: IProduct[];
  basket: IProduct[];
  preview: string | null;
  delivery: IDeliveryForm | null;
  contact: IContactForm | null;
  order: IOrder | null;
}

export interface IPage{
  counter: number;
  catalog: HTMLElement[];
}

export interface IModalData {
	content: HTMLElement;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export interface IDeliveryForm {
  payment: string;
  address: string;
}

export interface IContactForm {
  email: string;
  phone: string;
}

export interface IOrder extends IDeliveryForm, IContactForm {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export interface IApi {
	getProductList: () => Promise<IProduct[]>;
  getProductItem: (id: string) => Promise<IProduct>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>
}