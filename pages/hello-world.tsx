import Head from "next/head"

export default function HelloWorld() {
    return (
        <div>
            <Head>
                <title>Hello World</title>
                <meta name="description" content="desc for SEO" />
            </Head>
            <h1>Hello World</h1>
        </div>
    )
}

export async function getServerSideProps(context: any) {
    try {
        const host = context.req.headers.host || 'localhost:3000'
        const protocol = /^localhost/.test(host) ? 'http:' : 'https:'
        const products = await fetch(`${protocol}//${host}/api/products`).then(res => res.json())
        return {
            props: {
                products,
            }
        }
    }
    catch (error) {
        console.log(error)
        return {
            props: {
                products: [],
            }
        }
    }
}