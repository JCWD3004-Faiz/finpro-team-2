import { PrismaClient } from "@prisma/client";
import { CreateProduct } from "../models/product.models";
import { productSchema } from "../validators/product.validator";
import cloudinary from "../config/cloudinary";

export class ProductService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createProduct(product: CreateProduct) {
    const validatedData = productSchema.parse(product);
    if (validatedData.product_image.length > 4) {
      throw new Error("You cannot upload more than 4 images for a product.");
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

    if (validatedData.product_image && validatedData.product_image.length > 0) {
      const imageData = await Promise.all(
        validatedData.product_image.map(async (image, index) => {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "productImages",
          });
          return {
            product_id: createProduct.product_id,
            product_image: uploadResponse.secure_url,
            is_primary: index === 0,
          };
        })
      );
      await this.prisma.productImage.createMany({
        data: imageData,
      });
    }
    return createProduct;
  }
}
