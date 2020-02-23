export interface Product {
    $key: string;
    product_description: string;
    stock_quantity: number;
    product_code: string;
    last_updated: Date;
    product_category: string;
    in_stock: string;
    price: number;
    tags: Array<string>;
}
