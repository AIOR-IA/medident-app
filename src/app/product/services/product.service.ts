import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, orderBy, query, updateDoc, where, AggregateQuerySnapshot } from '@angular/fire/firestore';
import { Product } from '../interfaces/product.interface';
import { CreateProductModel } from '../interfaces/create-product.model';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public firestore = inject(Firestore);

  createProduct(product: Product) {
    const { name, price } = product;
    const newProduct = new CreateProductModel(name, price);
    const productsRef = collection(this.firestore, 'products');

    return addDoc(productsRef, { ...newProduct }).then((docRef) => {
      const productId = docRef.id;

      const productDocRef = doc(this.firestore, `products/${productId}`);
      return updateDoc(productDocRef, { idDoc: productId }).then(() => ({ ...newProduct, 'idDoc': productId }));
    });
  }

  getAllProductsObs(namePrefix = ''): Observable<Product[]> {
    let startAt = namePrefix;
    let endAt = namePrefix + '\uf8ff';
    const productsRef = collection(this.firestore, 'products');
    let q;
    if (namePrefix === '') {
      q = query(
        productsRef,
        orderBy('name'),
      );
    }
    else {
      q = query(
        productsRef,
        orderBy('name'),
        where('name', '>=', startAt),
        where('name', '<=', endAt)
      );
    }
    return collectionData(q, { idField: 'idDoc' }).pipe(map((data: any[]) => data.map(item => item as Product)));
  }

  public updateProduct(product: Product): Promise<void> {
    const docRef = doc(this.firestore, `products/${product.idDoc}`);
    return updateDoc(docRef, { ...product });
  }

  // public getTotalProductsObs(): Observable<number> {
  //   const productsRef = collection(this.firestore, 'products');
  //   const q = query(productsRef);

  //   return from(aggregateQuerySnapshot(q)).pipe(
  //     map(snapshot => snapshot.count) // Solo devuelve el número de documentos
  //   );
  // }
}
