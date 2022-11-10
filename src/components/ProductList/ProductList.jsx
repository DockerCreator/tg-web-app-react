import React, { useState, useCallback } from 'react'
import { useTelegram } from '../../hooks/useTelegram'
import ProductItem from '../ProductItem/ProductItem'
import './ProductList.css'

const products = [
	{ id: '1', title: 'Джинсы', price: 5000, description: 'Синие' },
	{ id: '2', title: 'Куртка', price: 9000, description: 'красная' },
	{ id: '3', title: 'Трусы', price: 300, description: 'желтые' },
	{ id: '4', title: 'Серега', price: 6200, description: 'чорт' },
	{ id: '5', title: 'Футболка', price: 500, description: 'голубая' },
	{ id: '6', title: 'Майка', price: 200, description: 'белая' },
	{ id: '7', title: 'Тапки', price: 700, description: 'черные' },
	{ id: '8', title: 'Перчатки', price: 11, description: 'бумажные' },
]

const getTotalPrice = (items = []) => {
	return items.reduce((acc, item) => {
		return (acc += item.price)
	}, 0)
}

const ProductList = () => {
	const [addedItems, setAddedItems] = useState([])
	const { tg } = useTelegram()

	const onSendData = useCallback(() => {
		const data = {
			products: addedItems,
			totalPrice: getTotalPrice(addedItems),
		}
		fetch('https://localhost:8000', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(data),
		})
	}, [])

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData)
		return () => {
			tg.offEvent('mainButtonClicked', onSendData)
		}
	}, [onSendData])

	const onAdd = product => {
		const alreadyAdded = addedItems.find(item => item.id === product.id)
		let newItems = []

		if (alreadyAdded) {
			newItems = addedItems.filter(item => item.id !== product.id)
		} else {
			newItems = [...addedItems, product]
		}

		setAddedItems(newItems)

		if (newItems.length === 0) {
			tg.MainButton.hide()
		} else {
			tg.MainButton.show()
			tg.MainButton.setParams({
				text: 'Купить ${getTotalPrice(newItems)}',
			})
		}
	}
	return (
		<div className={'list'}>
			{products.map(item => (
				<ProductItem product={item} onAdd={onAdd} className={'item'} />
			))}
		</div>
	)
}

export default ProductList
