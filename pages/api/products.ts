import type { NextApiRequest, NextApiResponse } from 'next'
import { ST } from 'next/dist/shared/lib/utils'
import { Stripe } from 'stripe'

type CommonResp = {
  ok: boolean
  message: string
}

type RespPrice = {
  id: Stripe.Price['id']
  currency: Stripe.Price['currency']
  transform_quantity: Stripe.Price['transform_quantity']
  unit_amount: Stripe.Price['unit_amount']
}

export type RespProduct = {
  id: Stripe.Product['id']
  description: Stripe.Product['description']
  name: Stripe.Product['name']
  images: Stripe.Product['images']
  unit_label: Stripe.Product['unit_label']
  prices: RespPrice[]
}


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

    // Return empty list if no products found
    if (!products.data || products.data.length === 0) {
      res.status(200).json({ ok: true, message: 'No products found' })
    }

    // Return the products
    const response = await Promise.all(products.data.map(async (product, i) => {
      const prices = await stripe.prices.list({
        product: product.id,
      })
      const respProduct: RespProduct = {
        id: product.id,
        description: product.description,
        name: product.name,
        images: product.images,
        unit_label: product.unit_label,
        prices: prices.data.map(price => ({
          id: price.id,
          currency: price.currency,
          transform_quantity: price.transform_quantity,
          unit_amount: price.unit_amount,
        })),
      }
      return respProduct
    }))
    res.status(200).json(response)

  } else {
    // If the request is not a GET request, return a 405
    res.status(405).json({ ok: false, message: 'Method not allowed' })
  }
}
