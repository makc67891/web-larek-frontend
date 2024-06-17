import { IActions, ICard } from '../types';
import { cardCategory } from '../utils/constants';
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

	set title(value: string) {
		this.setText(this._title, value)
	}

	get title(): string {
    return this._title.textContent || '';
  }

	set price(value: number | null) {
		if (value) {
			this.setText(this._price, String(value) + ' синапсов')
		} else {
			this.setText(this._price, 'Бесценно')
		}
		this.disabledButton(value);
	}

	set description(value: string) {
		this.setText(this._description, value)
	}

	set category(value: string) {
		this._category.classList.add(cardCategory[value])
		this.setText(this._category, value)
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set index(value: string) {
		this.setText(this._index, value)
	}

	set buttonTitle(value: string) {
		if (this._button) {
			this.setText(this._button, value)
		}
	}
}
