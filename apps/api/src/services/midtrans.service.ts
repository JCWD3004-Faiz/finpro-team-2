import { MidTransSnapRequest } from "../utils/midtransTypes";
import axios from "axios";
import environment from "dotenv"

environment.config()

export default class MidtransService {
    private serverKey: string
    private apiURL: string

    constructor() {
        this.serverKey = process.env.MIDTRANS_SERVER_KEY as string
        this.apiURL = process.env.MIDTRANS_API_URL as string
    }

    public async createVABankTransfer(data:MidTransSnapRequest ){
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`
        }
        try {
            const response = await axios.post(this.apiURL, data, {headers})
            return response.data
        } catch (error) {
            console.error("Error creating VA: ", error)
            throw error
        }
    }

    public async getTransactionStatus(orderId: string){
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`
        }
        try {
            const response = await axios.get(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {headers})
            return response.data
        } catch (error) {
            console.error("Error getting transaction status: ", error)
            throw error
        }
    }
}