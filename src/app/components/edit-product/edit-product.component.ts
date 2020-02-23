import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProductService } from './../../shared/product.service';
// import { FormGroup } from '@angular/forms/forms';
// import { FormBuilder } from '@angular/forms/forms';
// import { Validators } from '@angular/forms/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Language {
  name: string;
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})

export class EditProductComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  tagArray: Language[] = [];
  @ViewChild('chipList') chipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedProductCategory: string;
  editProductForm: FormGroup;
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
    this.updateProductForm();
  }

  constructor(
    public fb: FormBuilder,
    private location: Location,
    private productApi: ProductService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.productApi.GetProduct(id).valueChanges().subscribe(data => {
      this.tagArray = data.tags;
      this.editProductForm.setValue(data);
    })
  }

  /* Update form */
  updateProductForm() {
    this.editProductForm = this.fb.group({
      product_description: ['', [Validators.required]],
      stock_quantity: ['', [Validators.required]],
      product_code: ['', [Validators.required]],
      last_updated: ['', [Validators.required]],
      product_category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      in_stock: ['Yes'],
      tags: ['']
    })
  }

  /* Add language */
  add(event: MatChipInputEvent): void {
    var input: any = event.input;
    var value: any = event.value;
    // Add language
    if ((value || '').trim() && this.tagArray.length < 5) {
      this.tagArray.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove language */
  remove(language: any): void {
    const index = this.tagArray.indexOf(language);
    if (index >= 0) {
      this.tagArray.splice(index, 1);
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.editProductForm.controls[controlName].hasError(errorName);
  }

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.editProductForm.get('last_updated').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Go to previous page */
  goBack() {
    this.location.back();
  }

  /* Submit product */
  updateProduct() {
    var id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you wanna update?')) {
      this.productApi.UpdateProduct(id, this.editProductForm.value);
      this.router.navigate(['products-list']);
    }
  }

}
