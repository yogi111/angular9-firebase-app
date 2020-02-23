import { Injectable } from '@angular/core';
import { Product } from './product';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  productsRef: AngularFireList<any>;
  productRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) { }

  /* Create product */
  AddProduct(product: Product) {
    this.productsRef.push({
      product_description: product.product_description,
      stock_quantity: product.stock_quantity,
      product_code: product.product_code,
      last_updated: product.last_updated,
      product_category: product.product_category,
      in_stock: product.in_stock,
      price: product.price,
      tags: product.tags
    })
      .catch(error => {
        this.errorMgmt(error);
      })
  }

  /* Get product */
  GetProduct(id: string) {
    this.productRef = this.db.object('products-list/' + id);
    return this.productRef;
  }

  /* Get product list */
  GetProductList() {
    this.productsRef = this.db.list('products-list');
    return this.productsRef;
  }

  /* Update product */
  UpdateProduct(id, product: Product) {
    this.productRef.update({
      product_description: product.product_description,
      stock_quantity: product.stock_quantity,
      product_code: product.product_code,
      last_updated: product.last_updated,
      product_category: product.product_category,
      in_stock: product.in_stock,
      price: product.price,
      tags: product.tags
    })
      .catch(error => {
        this.errorMgmt(error);
      })
  }

  /* Delete product */
  DeleteProduct(id: string) {
    this.productRef = this.db.object('products-list/' + id);
    this.productRef.remove()
      .catch(error => {
        this.errorMgmt(error);
      })
  }

  // Error management
  private errorMgmt(error) {
    console.log(error)
  }
}