import styles from './App.module.css'
import { useState, useCallback } from 'react'
import { Button } from './components/Button/Button'
import { Panel } from './components/Panel/Panel'
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage'

function App() {
	const [isPanelShown, setIsPanelShown] = useState(false)
	const [error, setError] = useState(null)

	const handlePanelShow = () => {
		setIsPanelShown(prevIsPanelShown => !prevIsPanelShown)
	}

	const handleError = useCallback(e => {
		setError(e.message)
		setTimeout(() => {
			setError(null)
		}, 3000)
	}, [])

	console.log(error)
	return (
		<main className={styles.main}>
			{error && <ErrorMessage>{error}</ErrorMessage>}

			<Button onClick={handlePanelShow}>{isPanelShown ? 'Schowaj Panel' : 'Pokaz Panel'}</Button>
			{isPanelShown && <Panel onError={handleError} />}
		</main>
	)
}

export default App
