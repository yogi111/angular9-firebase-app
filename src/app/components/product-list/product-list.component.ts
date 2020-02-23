import { Product } from './../../shared/product';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table/';
import { ProductService } from './../../shared/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ProductData: any = [];
  displayedColumns: any[] = [
    '$key',
    'product_description',
    'product_code',
    'stock_quantity',
    'product_category',
    'price',
    'last_updated',
    'in_stock',
    'action'
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(private productApi: ProductService) {
    this.productApi.GetProductList()
      .snapshotChanges().subscribe(products => {
        products.forEach(item => {
          let a = item.payload.toJSON();
          a['$key'] = item.key;
          this.ProductData.push(a as Product)
        });
        /* Data table */
        this.dataSource = new MatTableDataSource(this.ProductData);
        /* Pagination */
        // setTimeout(() => {
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // }, 0);
      });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* Delete */
  deleteProduct(index: number, e) {
    if (window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.productApi.DeleteProduct(e.$key)
    }
  }

}
