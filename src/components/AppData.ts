import { IAppData, IContactForm, IDeliveryForm, IOrder, IProduct } from "../types";
import { Model } from "./base/Model";

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

export class AppData extends Model<IAppData> {
  catalog: IProduct[];
	basket: IProduct[] = [];
	preview: string | null;
	formErrors: FormErrors = {};
  order: IOrder = {
		payment: 'online',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.events.emit('items:changed');
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.events.emit('preview:changed', item);
	}

	addToBasket(item: IProduct) {
		if (this.basket.indexOf(item) < 0) {
			this.basket.push(item);
			this.updateBasket();
		}
	}

	updateBasket() {
		this.events.emit('counter:changed', this.basket);
		this.events.emit('basket:changed', this.basket);
	}

	getReturnItems(): IProduct[] {
		return this.basket;
	}

  clearBasket() {
		this.basket = [];
		this.updateBasket();
	}

	removeFromBasket(id: string) {
		this.basket = this.basket.filter((it) => it.id != id);
		this.events.emit('basket:changed');
	}

	getBasketTotal() {
		return this.basket.reduce((sum, item) => sum + item.price, 0);
	}

	setDeliveryField(field: keyof IDeliveryForm, value: string) {
		this.order[field] = value;
		if (this.validateDelivery()) {
			this.events.emit('delivery:ready', this.order);
		}
	}

	setContactField(field: keyof IContactForm, value: string) {
		this.order[field] = value;
		if (this.validateContact()) {
			this.events.emit('contact:ready', this.order);
		}
	}

  validateDelivery() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder() {
		this.order = {
			payment: 'online',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}
}