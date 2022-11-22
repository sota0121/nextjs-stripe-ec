import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Container } from 'react-bootstrap'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='#home'>
            Hello EC
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Component {...pageProps} />
    </>
  )
}
