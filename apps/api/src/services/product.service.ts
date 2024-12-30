import { PrismaClient } from "@prisma/client";
import { DiscountService } from "./discount.service";
import {
  CreateProduct,
  GetProductInventoryUser,
  UpdateProduct,
} from "../models/product.models";
import {
  productSchema,
  updateProductSchema,
} from "../validators/product.validator";
import cloudinary from "../config/cloudinary";
import config from "../config/config";

const CLOUDINARY_NAME = config.CLOUDINARY_NAME as string;

export class ProductService {
  private prisma: PrismaClient;
  private readonly discountService = new DiscountService();
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createProduct(product: CreateProduct) {
    const validatedData = productSchema.parse(product);
    const placeholderImage = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/v1734509885/placeholderpic_eh2ow7.png`;
    if (validatedData.product_image.length > 4) {
      throw new Error("You cannot upload more than 4 images for a product.");
    }

    const productImages = [...validatedData.product_image];
    while (productImages.length < 4) {
      productImages.push(placeholderImage);
    }

    const createProduct = await this.prisma.products.create({
      data: {
        category_id: validatedData.category_id,
        product_name: validatedData.product_name,
        description: validatedData.description,
        price: validatedData.price,
        quantity: 0,
        updated_at: new Date(),
      },
    });

    try {
      await this.createInventoryAfterProduct(createProduct.product_id);
    } catch (error) {
      console.error("Failed to create inventory:", error);
    }

    const imageData = await Promise.all(
      productImages.map(async (image, index) => {
        let uploadResponse;

        if (image === placeholderImage) {
          uploadResponse = { secure_url: placeholderImage };
        } else {
          uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "productImages",
          });
        }
        return {
          product_id: createProduct.product_id,
          product_image: uploadResponse.secure_url,
          is_primary: index === 0,
        };
      })
    );
    await this.prisma.productImage.createMany({ data: imageData });
    return createProduct;
  }

  async createInventoryAfterProduct(product_id: number) {
    const product = await this.prisma.products.findUnique({
      where: { product_id },
    });
    if (!product) {
      throw new Error("Product not found.");
    }
    const stores = await this.prisma.stores.findMany({
      select: { store_id: true },
    });
    const inventoryData = stores.map((store) => ({
      store_id: store.store_id,
      product_id,
      stock: 50,
      user_stock: 40,
      items_sold: 0,
      discounted_price: product?.price,
      updated_at: new Date(),
    }));
    const createdInventories = this.prisma.inventories.createMany({
      data: inventoryData,
    });

    await Promise.all(
      stores.map((store) =>
        this.discountService.updateInventoriesDiscountedPrice(store.store_id)
      )
    );

    return createdInventories;
  }

  async updateProduct(product_id: number, product: UpdateProduct) {
    const productData = await this.prisma.products.findUnique({
      where: { product_id },
    });
    if (!productData) {
      throw new Error("No product with the specific product ID found");
    }
    const isPriceUpdated =
      product.hasOwnProperty("price") &&
      product.price !== undefined &&
      product.price !== productData.price.toNumber();

    const validatedData = updateProductSchema.parse(product);
    const updatedProduct = await this.prisma.products.update({
      where: { product_id },
      data: validatedData,
    });

    if (isPriceUpdated) {
      const inventories = await this.prisma.inventories.findMany({
        where: { product_id },
        select: { store_id: true, inventory_id: true },
      });

      for (const inventory of inventories) {
        await this.discountService.updateInventoriesDiscountedPrice(
          inventory.store_id, // Pass the store_id
          inventory.inventory_id // Pass the specific inventory_id
        );
      }
    }

    return updatedProduct;
  }

  async updateProductImage(image_id: number, product_image: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { image_id },
    });
    if (!image) {
      throw new Error("No product image with the specific image ID found");
    }
    const uploadResponse = await cloudinary.uploader.upload(product_image, {
      folder: "productImages",
    });
    return await this.prisma.productImage.update({
      where: { image_id },
      data: { product_image: uploadResponse.secure_url },
    });
  }
}
