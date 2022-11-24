import type { NextApiRequest, NextApiResponse } from 'next'
import { ST } from 'next/dist/shared/lib/utils'
import { Stripe } from 'stripe'

type CommonResp = {
  ok: boolean
  message: string
}

export type Product = {
  id: number
  name: string
  price: number
  tax: number
  description: string
}

// const products: Product[] = [
//   {
//     id: 1,
//     name: 'Product 1',
//     price: 100,
//     tax: 10,
//     description: 'Product 1 description'
//   },
//   {
//     id: 2,
//     name: 'Product 2',
//     price: 200,
//     tax: 20,
//     description: 'Product 2 description'
//   },
//   {
//     id: 3,
//     name: 'Product 3',
//     price: 300,
//     tax: 30,
//     description: 'Product 3 description'
//   }
// ]

const stripeApiVer = '2022-11-15'
const maxNetworkRetries = 3

function getStripe(): Stripe {
  const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
    apiVersion: stripeApiVer,
    maxNetworkRetries,
  })
  return stripe
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stripe.Response<Stripe.ApiList<Stripe.Product>> | CommonResp>
) {
  // Only respond to GET requests
  if (req.method?.toLocaleLowerCase() === 'get') {
    // Get the products from Stripe
    const stripe = getStripe()
    const products = await stripe.products.list()
    res.status(200).json(products)

    // // Return a specific product if an id is provided
    // if (req.query.id) {
    //   // Get the id from the query string
    //   const id = parseInt(req.query.id as string)
    //   // Find the product with the id
    //   const product = products.find((product) => product.id === Number(id))
    //   // If the product is found, return it
    //   if (product) {
    //     res.status(200).json([product])
    //   } else {
    //     // If the product is not found, return a 404
    //     res.status(404).json({ ok: false, message: 'Product not found' })
    //   }
    // } else {
    //   // If no id is provided, return all products
    //   res.status(200).json(products)
    // }
  } else {
    // If the request is not a GET request, return a 405
    res.status(405).json({ ok: false, message: 'Method not allowed' })
  }
}
