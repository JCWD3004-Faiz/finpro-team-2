import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary";
import axios from "axios";

export class ProfileService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async addAdress(user_id: number, address: string, city_name: string, city_id: number) {
        try {
            if (!user_id || !address || !city_name || !city_id) throw new Error("Missing required parameters.");
            const { data } = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${city_name}&key=${process.env.OPENCAGE_API_KEY}`
            );
            const { lat, lng } = data.results[0]?.geometry || {};
            if (!lat || !lng) throw new Error("No geocoding results found.");
            const existingAddresses = await this.prisma.address.findMany({
                where: { user_id },
            });
            const isDefault = existingAddresses.length === 0;
            return await this.prisma.address.create({ 
                data: { user_id, address, city_id, city_name, latitude: lat, longitude: lng, is_default: isDefault } 
            });
        } catch (error: any) {
            return { error: error.message || "An error occurred." };
        }
    }

    async getAddressesByUserId(user_id: number) {
        try {
            if (!user_id) throw new Error("Missing required parameters.");
            return await this.prisma.address.findMany({ where: { user_id } });
        } catch (error: any) {
            return { error: error.message || "An error occurred." };
        }
    }

    async changeDefaultAddress(user_id: number, new_address_id: number) {
        try {
            if (!user_id || !new_address_id) throw new Error("Missing required parameters.");
    
            // Ensure the new address exists
            const newAddress = await this.prisma.address.findUnique({
                where: { address_id: new_address_id }
            });
    
            if (!newAddress) {
                throw new Error("Address not found.");
            }
    
            // Find the current default address (if any)
            const currentDefaultAddress = await this.prisma.address.findFirst({
                where: {
                    user_id,
                    is_default: true,
                },
            });
    
            // If a default address exists, update it to set is_default to false
            if (currentDefaultAddress) {
                await this.prisma.address.update({
                    where: { address_id: currentDefaultAddress.address_id },
                    data: { is_default: false },
                });
            }
    
            // Set the new address as the default
            const updatedAddress = await this.prisma.address.update({
                where: { address_id: new_address_id },
                data: { is_default: true },
            });
    
            return updatedAddress;  // Return the updated address as confirmation
        } catch (error: any) {
            return { error: error.message || "An error occurred while changing the default address." };
        }
    }

    async updateUserProfilePic(data: { id: number; image: string }) {
        const uploadResponse = await cloudinary.uploader.upload(data.image, {
          folder: "userProfile",
        });
        return this.prisma.users.update({
          where: { user_id: data.id },
          data: {
            image: uploadResponse.secure_url,
          },
        });
    }
}
