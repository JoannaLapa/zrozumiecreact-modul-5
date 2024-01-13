import { useState, useEffect } from 'react'
import { List } from '../List/List'
import styles from './Panel.module.css'
import { Form } from '../Form/Form'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import { FilterButton } from '../FilterButton/FilterButton'

const url = 'http://localhost:3000/words'

export function Panel() {
	const [data, setData] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)

	useEffect(() => {
		const params = selectedCategory ? `?category=${selectedCategory}` : ''
		fetch(`${url}${params}`)
			.then(response => response.json())
			.then(data => {
				setData(data)
				setIsLoaded(true)
			})
	}, [selectedCategory])

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
			.catch(e => {
				setError(e.message)
				setTimeout(() => setError(null), 3000)
			})
	}

	if (!isLoaded) {
		return <p>Loading...</p>
	}

	const handleFilterClick = category => {
		setSelectedCategory(category)
	}

	return (
		<>
			{error && <ErrorMessage message={error} />}

			<section className={styles.section}>
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
		</>
	)
}
