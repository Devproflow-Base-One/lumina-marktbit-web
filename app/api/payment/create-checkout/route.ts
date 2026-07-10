import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { plan, billing, amount, paymentMethod } = body

    if (!plan || !billing || amount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const planPrices: Record<string, { monthly: number; yearly: number; lifetime: number }> = {
      free: { monthly: 0, yearly: 0, lifetime: 0 },
      premium: { monthly: 3, yearly: 30, lifetime: 99 },
      lifetime: { monthly: 99, yearly: 99, lifetime: 99 }
    }

    const planData = planPrices[plan]
    if (!planData) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      )
    }

    const expectedAmount = planData[billing as keyof typeof planData]
    if (amount !== expectedAmount) {
      return NextResponse.json(
        { success: false, error: 'Amount mismatch' },
        { status: 400 }
      )
    }

    if (plan === 'free' || amount === 0) {
      return NextResponse.json({
        success: true,
        message: 'Free plan activated',
        redirect: '/dashboard'
      })
    }

    switch (paymentMethod) {
      case 'stripe':
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY
        if (!stripeSecretKey) {
          return NextResponse.json(
            { success: false, error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' },
            { status: 500 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Stripe checkout placeholder - integrate Stripe SDK',
          url: `/payment/pending?plan=${plan}&billing=${billing}&method=stripe`
        })

      case 'paypal':
        const paypalClientId = process.env.PAYPAL_CLIENT_ID
        if (!paypalClientId) {
          return NextResponse.json(
            { success: false, error: 'PayPal not configured. Set PAYPAL_CLIENT_ID.' },
            { status: 500 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'PayPal checkout placeholder - integrate PayPal SDK',
          approvalUrl: `/payment/pending?plan=${plan}&billing=${billing}&method=paypal`
        })

      case 'crypto':
        const cryptoWallet = process.env.CRYPTO_WALLET_ADDRESS
        if (!cryptoWallet) {
          return NextResponse.json(
            { success: false, error: 'Crypto payment not configured. Set CRYPTO_WALLET_ADDRESS.' },
            { status: 500 }
          )
        }
        return NextResponse.json({
          success: true,
          walletAddress: cryptoWallet,
          cryptoAmount: amount,
          message: 'Send crypto to wallet address'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid payment method' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
