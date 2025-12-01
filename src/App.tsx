import Routes from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {


  return (
    <>
      <Routes />
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
    </>
  )
}

export default App
