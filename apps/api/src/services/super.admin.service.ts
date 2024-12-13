import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { User } from "../models/admin.models";
import { adminRegisterSchema } from "../validators/admin.register.validator";
import axios from "axios";



export class SuperAdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async registerAdmin(data: User) {
    const validatedData = adminRegisterSchema.parse(data);
    const hashedPassword = await bcrypt.hash(validatedData.password_hash, 10);
    return this.prisma.users.create({
      data: {
        username: data.username,
        email: validatedData.email,
        password_hash: hashedPassword,
        role: data.role,
      },
    });
  }

  async getAllStoreAdmins() {
    try {
      const storeAdmins = await this.prisma.users.findMany({
        where: { role: 'STORE_ADMIN' },
        include: { Store: { select: { store_name: true } } },
      });
      return storeAdmins.map(admin => ({
        user_id: admin.user_id, username: admin.username, email: admin.email,
        store_name: admin.Store ? admin.Store.store_name : "Unassigned",
      }));
    } catch (error) {
      console.error("Error fetching store admins: ", error);
      throw new Error("Unable to fetch store admins.");
    }
  }

  async assignStoreAdmin(store_id: number, user_id: number) {
    try {
      const user = await this.prisma.users.findUnique({ where: { user_id } });
      if (!user || user.role !== 'STORE_ADMIN') throw new Error("Only users with the 'STORE_ADMIN' role can be assigned to a store.");
      const [currentStore, existingAdminStore] = await Promise.all([
        this.prisma.stores.findUnique({ where: { store_id } }),
        this.prisma.stores.findUnique({ where: { user_id } }),
      ]);
      if (existingAdminStore && existingAdminStore.store_id !== store_id) {
        await this.prisma.stores.update({ where: { store_id: existingAdminStore.store_id }, data: { user_id: null } });
      }
      if (currentStore?.user_id) {
        await this.prisma.users.update({ where: { user_id: currentStore.user_id }, data: { is_verified: false } });
      }
      await Promise.all([
        this.prisma.stores.update({ where: { store_id }, data: { user_id } }),
        this.prisma.users.update({ where: { user_id }, data: { is_verified: true } })
      ]);
      return { store: currentStore, user };
    } catch (error) {
      console.error("Error assigning store admin:", error);
      throw new Error("Unable to assign store admin.");
    }
  }

  async deleteStoreAdmin(user_id: number) {
    try {
      const user = await this.prisma.users.findUnique({ where: { user_id } });
      if (!user || user.role!== 'STORE_ADMIN') return {error: "Only users with the 'STORE_ADMIN' role can be deleted."};
      if (user.is_verified === true ) return {error: "Assigned store admins cannot be deleted"};
      await this.prisma.users.delete({ where: { user_id } });
      return { message: "Store admin deleted successfully." };
    } catch (error) {
      console.error("Error deleting store admin:", error);
      throw new Error("Unable to delete store admin.");
    }
  }

  async createStore(store_name: string, store_location: string, city_id: number){
    try {
    const { data } = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${store_location}&key=${process.env.OPENCAGE_API_KEY}`
    );
    const { lat, lng } = data.results[0]?.geometry || {};
    if (!lat || !lng) return {error: "No geocoding results found."};
      const store = await this.prisma.stores.create({
        data: { store_name, store_location, city_id, latitude:lat, longitude:lng },
      });
      return store;
    } catch (error) {
      console.error("Error creating store:", error);
      throw new Error("Unable to create store.");
    }
  }

  async getAllStores() {
    return this.prisma.stores.findMany({
      where: { is_deleted: false },
    });
  }

  async updateStore(store_id: number, store_name: string, store_location: string, city_id: number) {
    try {
      let latitude, longitude;
      if (store_location) {
        const { data } = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${store_location}&key=${process.env.OPENCAGE_API_KEY}`
        );
        const geoData = data.results[0]?.geometry;
        latitude = geoData?.lat;
        longitude = geoData?.lng;
        if (!latitude || !longitude) return { error: "No geocoding results found." };
      }
      return await this.prisma.stores.update({
        where: { store_id },
        data: { store_name, store_location, city_id, latitude, longitude },
      });
    } catch (error) {
      console.error("Error updating store:", error);
      throw new Error("Unable to update store.");
    }
  }

  async deleteStore(store_id: number) {
    try {
      const store = await this.prisma.stores.findUnique({ where: { store_id } });
      if (!store) return { error: "Store not found." };
      if (store.user_id) {
        await this.prisma.users.update({
          where: { user_id: store.user_id }, data: { is_verified: false },
        });
      }
      const updatedStore = await this.prisma.stores.update({
        where: { store_id }, data: { is_deleted: true, user_id: null },
      });
      return updatedStore;
    } catch (error) {
      console.error("Error deleting store:", error);
      throw new Error("Unable to delete store.");
    }
  }
  
}
