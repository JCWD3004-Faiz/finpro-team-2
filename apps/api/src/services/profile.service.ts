import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary";
import axios from "axios";
import * as turf from '@turf/turf';

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
            return await this.prisma.address.findMany({ where: { user_id, is_deleted:false } });
        } catch (error: any) {
            return { error: error.message || "An error occurred." };
        }
    }

    async changeDefaultAddress(user_id: number, new_address_id: number) {
        try {
            if (!user_id || !new_address_id) throw new Error("Missing required parameters.");
            const newAddress = await this.prisma.address.findUnique({where: { address_id: new_address_id }});
            if (!newAddress) {throw new Error("Address not found.")}
            const currentDefaultAddress = await this.prisma.address.findFirst({
                where: { user_id, is_default: true },
            });
            if (currentDefaultAddress) {
                await this.prisma.address.update({
                where: { address_id: currentDefaultAddress.address_id }, data: { is_default: false }});
            }
            const updatedAddress = await this.prisma.address.update({
                where: { address_id: new_address_id }, data: { is_default: true }
            });
            return updatedAddress;
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

    async getRajaOngkirCities() {
        try {
            const response = await axios.get('https://api.rajaongkir.com/starter/city/', {
                headers: { key: 'b1f603cff73c782c3462bd7a05936e46' },
            });
    
            const cities = response.data.rajaongkir.results.map((city: any) => ({
                city_id: city.city_id, city_name: `${city.type} ${city.city_name}`,
            }));
    
            return cities;
        } catch (error) {
            return { error: 'Error fetching city data' };
        }
    }

    async getUserProfile(user_id:number) {
        try {
            return await this.prisma.users.findUnique({ where: { user_id }});
        } catch (error: any) {
            return { error: error.message || "An error occurred." };
        }
    }

    async deleteAddress(user_id: number, address_id: number) {
        try {
            if (!user_id || !address_id) throw new Error("Missing required parameters.");    
            const address = await this.prisma.address.findUnique({
                where: { address_id: address_id },
            });
            if (!address) throw new Error("Address not found.");    
            const updatedAddress = await this.prisma.address.update({
                where: { address_id: address_id },
                data: { is_deleted: true },
            });
    
            return updatedAddress;
        } catch (error: any) {
            return { error: error.message || "An error occurred while deleting the address." };
        }
    }

    async getClosestStore(latitude: number, longitude: number) {
        try {
            if (!latitude || !longitude) throw new Error("Missing latitude or longitude.");
            const stores = await this.prisma.stores.findMany({
                where: { is_deleted: false },
                select: { store_id: true, store_name: true, store_location:true, latitude: true, longitude: true}
            });
            if (stores.length === 0) throw new Error("No stores found.");
            const userLocation = turf.point([longitude, latitude]);    
            let closestStore = null;
            let closestDistance = Infinity;
            stores.forEach(store => {
                const storeLocation = turf.point([Number(store.longitude), Number(store.latitude)]);    
                const distance = turf.distance(userLocation, storeLocation, { units: 'meters' });    
                if (distance < closestDistance) { closestDistance = distance; closestStore = store}
            });
            return closestStore;
        } catch (error: any) {
            return { error: error.message || "An error occurred while finding the closest store." };
        }
    }

    async getClosestStoreById(user_id: number) {
        try {
            if (!user_id) throw new Error("Missing user_id.");
    
            // Fetch the user's default address
            const userAddress = await this.prisma.address.findFirst({
                where: {
                    user_id: user_id,
                    is_default: true,
                    is_deleted: false
                }
            });
    
            if (!userAddress) throw new Error("User's default address not found.");
    
            const { latitude, longitude } = userAddress;
    
            // Fetch all stores to find the closest one
            const stores = await this.prisma.stores.findMany({
                where: { is_deleted: false },
                select: { store_id: true, store_name: true, store_location: true, latitude: true, longitude: true }
            });
    
            if (stores.length === 0) throw new Error("No stores found.");
    
            const userLocation = turf.point([Number(longitude), Number(latitude)]); // User's address location
            let closestStore = null;
            let closestDistance = Infinity;
    
            // Loop through stores and calculate the closest one
            stores.forEach(store => {
                const storeLocation = turf.point([Number(store.longitude), Number(store.latitude)]);
                const distance = turf.distance(userLocation, storeLocation, { units: 'meters' });
    
                // Update the closest store if the current one is closer
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestStore = store;
                }
            });
    
            return closestStore;
        } catch (error: any) {
            return { error: error.message || "An error occurred while finding the closest store by user_id." };
        }
    }
}
