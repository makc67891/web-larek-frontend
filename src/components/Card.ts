import { IActions, ICard } from '../types';
import { Component } from './base/Components';

export class Card extends Component<ICard> {
	protected _id: string;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _index?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _buttonTitle: string;

	constructor(protected container: HTMLElement, actions?: IActions) {
		super(container);

		this._title = this.container.querySelector('.card__title');
		this._price = this.container.querySelector('.card__price');
		this._description = this.container.querySelector('.card__text');
		this._category = this.container.querySelector('.card__category');
		this._image = this.container.querySelector('.card__image');
		this._index = this.container.querySelector('.basket__item-index');
		this._button = this.container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	disabledButton(value: number | null) {
		if (!value) {
			if (this._button) {
				this._button.disabled = true;
			}
		}
	}

	set id(id: string) {
		this._id = id;
	}

	get id(): string {
		return this._id;
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	set price(price: number | null) {
		if (price) {
			this._price.textContent = String(price) + ' синапсов';
		} else {
			this._price.textContent = 'Бесценно';
		}
		this.disabledButton(price);
	}

	set description(description: string) {
		if (this._description) this._description.textContent = description;
	}

	set category(category: string) {
		if (this._category) this._category.textContent = category;
	}

	set image(image: string) {
		this.setImage(this._image, image, this.title);
	}

	set index(value: string) {
		this._index.textContent = value;
	}

	set buttonTitle(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
}
