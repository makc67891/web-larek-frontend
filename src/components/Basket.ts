import { IActions, IBasketView, ICardInBasket } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Components';
import { IEvents } from './base/events';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	disableButton(value: string) {
		this._button.setAttribute('disabled', value);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this._total.textContent = `${String(total)} синапсов`;
	}
}

export class BasketItem extends Component<ICardInBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, index: number, action?: IActions) {
		super(container);

		this._index = this.container.querySelector('.basket__item-index');
		this._title = this.container.querySelector('.card__title');
		this._price = this.container.querySelector('.card__price');
		this._button = this.container.querySelector('.card__button');
		this._index.textContent = String(index + 1);

		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			}
		}
	}

	set index(value: number) {
		this._index.textContent = String(value);
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number) {
		this._price.textContent = String(value);
	}
}
