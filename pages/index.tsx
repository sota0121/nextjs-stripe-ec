import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react'

class Endpoint {
  readonly host = 'localhost:3000'
  readonly protocol = 'http:'
  readonly relPathProducts = '/api/products'

  products = () => `${this.protocol}//${this.host}${this.relPathProducts}`
}

export default function Home() {
  // State
  const [products, setProducts] = useState([])

  // Effects
  useEffect(() => {
    const endpoint = new Endpoint()
    fetch(endpoint.products())
    .then(res => res.json())
    .then(data => setProducts(data))
  }, [setProducts])

  // Render
  return (
    <main>
      <Head>
        <title>Raku-Buy Modern</title>
        <meta name="description" content="Raku-Buy Modern" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <pre><code>{JSON.stringify(products, null, 2)}</code></pre>
    </main>
  )
}
