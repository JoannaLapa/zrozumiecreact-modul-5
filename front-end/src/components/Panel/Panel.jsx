import { useState, useEffect } from 'react'
import { List } from '../List/List'
import styles from './Panel.module.css'
import { Form } from '../Form/Form'
import { FilterButton } from '../FilterButton/FilterButton'
import { getCategoryInfo } from '../../utils/getCategoryInfo'
import { Info } from '../Info/Info'
const url = 'http://localhost:3000/words1'

export function Panel({ onError }) {
	const [data, setData] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState(null)
	
	useEffect(() => {
		let isCancelled = false
		const params = selectedCategory ? `?category=${selectedCategory}` : ''
		fetch(`${url}${params}`)
			.then(response => {
				if (response.ok) {
					return response.json()
				}

				throw new Error('Błąd podczas ładowania danych')
			})
			.then(data => {
				if (!isCancelled) {
					setData(data)
					setIsLoaded(true)
				}
			})
			.catch(onError)

		return () => {
			isCancelled = true
		}
	}, [selectedCategory, onError])

	const categoryInfo = getCategoryInfo(selectedCategory)

	const handleFormSubmit = formData => {
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then(response => response.json())
			.then(response => {
				if (!selectedCategory || selectedCategory === response.category) {
					setData(prevData => [...prevData, response])
				}
			})
	}

	const handleDeleteItem = id => {
		fetch(`${url}/${id}`, {
			method: 'DELETE',
		})
			.then(res => {
				if (res.ok) {
					setData(prevData => prevData.filter(item => item.id !== id))
				} else {
					throw new Error('Błąd podczas usuwania')
				}
			})
			.catch(onError)
	}

	if (!isLoaded) {
		return <p>Loading...</p>
	}

	const handleFilterClick = category => {
		setSelectedCategory(category)
	}

	return (
		<section className={styles.section}>
			<Info>{categoryInfo}</Info>
			<Form handleFormSubmit={handleFormSubmit} />
			<div className={styles.filters}>
				<FilterButton active={selectedCategory === null} onClick={() => handleFilterClick(null)}>
					Wszystkie
				</FilterButton>
				<FilterButton active={selectedCategory === 'noun'} onClick={() => handleFilterClick('noun')}>
					Rzeczowniki
				</FilterButton>
				<FilterButton active={selectedCategory === 'verb'} onClick={() => handleFilterClick('verb')}>
					Czasowniki
				</FilterButton>
			</div>
			<List data={data} onDeleteItem={handleDeleteItem} />
		</section>
	)
}
