import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import { ProductService } from './../../shared/product.service';
// import { FormGroup } from '@angular/forms/forms';
// import { FormBuilder } from '@angular/forms/forms';
// import { Validators } from '@angular/forms/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Language {
  name: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  tagArray: Language[] = [];
  @ViewChild('chipList') chipList;
  @ViewChild('resetProductForm') myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedProductCategory: string;
  productForm: FormGroup;
  ProductCategory: any = [
    'Electronic Devices',
    'Electronic Accessories',
    'TV & Home Appliances',
    'Health & Beauty',
    'Babies & Toys',
    'Groceries & Pets',
    'Home & Living',
    'Womens Fashion',
    'Mens Fashion',
    'Fashion Accessories',
    'Sports & Lifestyle',
    'Automotive & Auto Accesories'
  ];

  ngOnInit() {
    this.productApi.GetProductList();
    this.submitProductForm();
  }

  constructor(
    public fb: FormBuilder,
    private productApi: ProductService
  ) { }

  /* Remove dynamic tags */
  remove(language: Language): void {
    const index = this.tagArray.indexOf(language);
    if (index >= 0) {
      this.tagArray.splice(index, 1);
    }
  }

  /* Reactive product form */
  submitProductForm() {
    this.productForm = this.fb.group({
      product_description: ['', [Validators.required]],
      stock_quantity: ['', [Validators.required]],
      product_code: ['', [Validators.required]],
      last_updated: ['', [Validators.required]],
      product_category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      in_stock: ['Yes'],
      tags: [this.tagArray]
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.productForm.controls[controlName].hasError(errorName);
  }

  /* Add dynamic tags */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.tagArray.length < 5) {
      this.tagArray.push({ name: value.trim() })
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.productForm.get('last_updated').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Reset form */
  resetForm() {
    this.tagArray = [];
    this.productForm.reset();
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.controls[key].setErrors(null)
    });
  }

  /* Submit product */
  submitProduct() {
    if (this.productForm.valid) {
      this.productApi.AddProduct(this.productForm.value)
      this.resetForm();
    }
  }

}