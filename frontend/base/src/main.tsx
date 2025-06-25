import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router/router'

createRoot(document.getElementById('root')!).render(
    router
)
