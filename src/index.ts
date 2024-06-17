import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { EventEmitter, IEvents } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import { Basket, BasketItem } from './components/Basket';
import { AppData } from './components/AppData';
import { IContactForm, IDeliveryForm, IOrder, IProduct } from './types';
import { Success } from './components/Success';
import { ContactForm, DeliveryForm } from './components/Order';

const events: IEvents = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Шаблоны верстки
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Глобальные контейнеры
const page = new Page(document.querySelector('#page'), events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contact = new ContactForm(cloneTemplate(contactTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(deliveryTemplate), events, {
	onClick: (event: Event) => events.emit('payment:toggle', event.target),
});

// Модель данных
const appData = new AppData({}, events);

// Получение списка продуктов с сервера
api
	.getProductList()
	.then((data) => appData.setCatalog(data))
	.catch((err) => console.log(err));

// Обновление каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Установить выбранный товар
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

// Показ выбранного товара
events.on('preview:changed', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('product:toggle', item);
			card.buttonTitle =
				appData.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины';
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			category: item.category,
			buttonTitle:
				appData.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины',
		}),
	});
});

// Переключение
events.on('product:toggle', (item: IProduct) => {
	if (appData.basket.indexOf(item) < 0) {
		events.emit('product:add', item);
	} else {
		events.emit('product:delete', item);
	}
});

// Добавление товара в корзину
events.on('product:add', (item: IProduct) => {
	appData.addToBasket(item);
});

// Удаления товара из корзины
events.on('product:delete', (item: IProduct) =>
	appData.removeFromBasket(item.id)
);

// Обновление корзины
events.on('basket:changed', () => {
	let total = 0;
	page.counter = appData.getReturnItems().length;
	basket.items = appData.getReturnItems().map((item, index) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), index, {
			onClick: () => {
				appData.removeFromBasket(item.id);
				basket.total = appData.getBasketTotal();
			},
		});
		total = total + item.price;
		return card.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = total;
	appData.order.total = total;
});

// Обновление счетчика
events.on('counter:changed', () => {
	page.counter = appData.basket.length;
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

//Открытие формы доставки
events.on('order:open', () => {
	modal.render({
		content: delivery.render({
			payment: appData.order.payment,
			address: appData.order.address,
			valid: appData.validateDelivery(),
			errors: [],
		}),
	});
	appData.order.items = appData.basket.map((item) => item.id);
});

// Смена способа оплаты заказа
events.on('payment:toggle', (target: HTMLElement) => {
	if (!target.classList.contains('button_alt-active')) {
		delivery.toggleButtons();
		appData.order.payment = target.getAttribute('name');
	}
});

// Изменение состояния валидации форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	delivery.valid = !payment && !address;
	contact.valid = !email && !phone;
	delivery.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменение полей доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IDeliveryForm; value: string }) => {
		appData.setDeliveryField(data.field, data.value);
	}
);

// Изменение полей контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

// Событие заполненности формы доставки
events.on('delivery:ready', () => {
	delivery.valid = true;
});

// Событие заполненности формы контактов
events.on('contact:ready', () => {
	contact.valid = true;
});

// Событие перехода к форме контактов
events.on('order:submit', () => {
	modal.render({
		content: contact.render({
			email: appData.order.email,
			phone: appData.order.phone,
			valid: appData.validateContact(),
			errors: [],
		}),
	});
});

// Оформление заказа
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			appData.clearBasket();
			appData.clearOrder();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.total = result.total.toString();

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Открытие модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Закрытие модального окна
events.on('modal:close', () => {
	page.locked = false;
});
