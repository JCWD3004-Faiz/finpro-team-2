export type TransactionDetails = {
    order_id: string,
    gross_amount: number
}

export type CreditCard = {
    secure: boolean
}

export type CustomerDetails = {
    first_name: string,
    email: string,
    billing_address: {
      address: string,
      city: string,
      country_code: string
    },
    shipping_address: {
        first_name: string,
        address: string,
        city: string,
        country_code: string
    },
}

export type MidTransSnapRequest = {
    transaction_details: TransactionDetails,
    credit_card: CreditCard,
    customer_details: CustomerDetails,
}