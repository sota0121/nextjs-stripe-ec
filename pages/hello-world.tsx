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