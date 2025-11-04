export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  salePrice: number;
  size: string;
  hasAlcohol: boolean;
  alcoholType?: string;
  alcoholPercentage?: number;
  hasCandy: boolean;
  candyType?: string;
  stockQuantity: number;
  minStockAlert: number;
  isActive: boolean;
  preparationTime: number;
  tags: string[];
}
