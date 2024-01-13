import { useState, useEffect } from 'react'
import { List } from '../List/List'
import styles from './Panel.module.css'
import { Form } from '../Form/Form'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'

export function Panel() {
	const [data, setData] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(null)

	useEffect(() => {
		fetch('http://localhost:3000/words')
			.then(response => response.json())
			.then(data => {
				setData(data)
				setIsLoaded(true)
			})
	}, [])

	const handleFormSubmit = formData => {
		fetch('http://localhost:3000/words', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then(response => response.json())
			.then(response => setData(prevData => [...prevData, response]))
	}

    const handleDeleteItem = (id) => {
        fetch(`http://localhost:3000/words/${id}`, {
            method: 'DELETE',
    })
        .then((res) => {
            if(res.ok){
                setData(prevData => prevData.filter(item => item.id !== id))
            } else {
               throw new Error('Błąd podczas usuwania')
            }
        }).catch((e) => {
            setError(e.message)
            setTimeout(() => setError(null), 3000)
        })
    }

	if (!isLoaded) {
		return <p>Loading...</p>
	}

	return (
		<>
        {error && <ErrorMessage message={error}/>}

			<section className={styles.section}>
				<Form handleFormSubmit={handleFormSubmit} />
				<List data={data} onDeleteItem={handleDeleteItem}/>
			</section>
		</>
	)
}
