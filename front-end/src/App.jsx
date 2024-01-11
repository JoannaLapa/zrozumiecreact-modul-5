import styles from "./App.module.css";
import { useState } from "react";
import { Button } from "./components/Button/Button";
import { Panel } from "./components/Panel/Panel";

function App() {
    const [isPanelShown, setIsPanelShown] = useState(false)

    const handlePanelShow = () => {
        setIsPanelShown(prevIsPanelShown => !prevIsPanelShown)
    }
    return (
        <main className={styles.main}>
        <Button onClick={handlePanelShow}>{isPanelShown ? 'Schowaj Panel' : 'Pokaz Panel'}</Button>
          {isPanelShown && <Panel />}  
        </main>
    );
}

export default App;
