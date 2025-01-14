import { Container } from 'semantic-ui-react'
import './styles.css'
import NavBar from './Navbar'
import { observer } from 'mobx-react-lite'
import { Outlet, useLocation } from 'react-router-dom'
import HomePage from '../../features/Home/HomePage'

function App() {
  const location = useLocation();
  
  return (
    <>
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  )
}

export default observer(App);
