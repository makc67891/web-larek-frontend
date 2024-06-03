import { IEvents } from '../components/base/events';

export type TCardId = Pick<ICard, 'id'>;

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number | null;
	items: TCardId[];
}

export interface ICardsData {
	cards: ICard[];
	preview: string | null;
	events: IEvents;
	getCard(cardId: string): ICard;
}

export interface IBasketData {
	basketCards: TCardId[];
	events: IEvents;
	getTotalPrice(prices: number[]): number;
	resetBasket(): void;
}

export interface IPage {
	basket: HTMLElement;
	gallery: HTMLUListElement;
	render(card: HTMLElement[]): void;
}

export interface IModal {
	modal: HTMLElement;
	events: IEvents;
	addContent(elem: HTMLElement): void;
	openModal(): void;
	closeModal(): void;
}

export interface IModalWithForm extends IModal {
	form: HTMLFormElement;
	submitButton: HTMLButtonElement;
	inputs: NodeListOf<HTMLInputElement>;
	errors: Record<string, HTMLElement>;
	setValid(isValid: boolean): string;
  getInputValues(): Record<string, string>;
  setErrors(data: { field: string, value: string, validInformation: string }): void;
  showInputError (field: string, errorMessage: string): void;
  hideInputError (field: string): void;
  closeModal (): void
}

export interface IModalWithBasket extends IModal {
  productList: HTMLUListElement;
  totalPrice: HTMLElement;
  submitButton: HTMLButtonElement;
}

export interface IModalConfirm extends IModal {
  totalPrice: HTMLElement;
  submitButton: HTMLButtonElement;
}