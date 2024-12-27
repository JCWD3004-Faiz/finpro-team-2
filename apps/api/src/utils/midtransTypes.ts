export type CreditCard = {
    secure: boolean
}

export type CustomerDetails = {
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
}

export type TransactionDetails = {
    order_id: string,
    gross_amount: number
}

export type MidTransSnapRequest = {
    transaction_details: TransactionDetails,
    credit_card: CreditCard,
    customer_details: CustomerDetails,
    shipping_details: CustomerDetails
}