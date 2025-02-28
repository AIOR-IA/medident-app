import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, orderBy, query, updateDoc, where, getDocs, startAfter, getCountFromServer, onSnapshot, limit, DocumentSnapshot, QueryDocumentSnapshot, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { PaginatedProducts, Product } from '../interfaces/product.interface';
import { CreateProductModel } from '../interfaces/create-product.model';
import { BehaviorSubject, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() {
    this.getTotalProducts();
  }
  private lastVisible: DocumentSnapshot | null = null;
  public firestore = inject(Firestore);
  private totalProductsSubject = new BehaviorSubject<number>(0);
  totalProducts$ = this.totalProductsSubject.asObservable();

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

  // getAllProductsObs(namePrefix = ''): Observable<Product[]> {
  //   let startAt = namePrefix;
  //   let endAt = namePrefix + '\uf8ff';
  //   const productsRef = collection(this.firestore, 'products');
  //   let q;
  //   if (namePrefix === '') {
  //     q = query(
  //       productsRef,
  //       orderBy('name'),
  //     );
  //   }
  //   else {
  //     q = query(
  //       productsRef,
  //       orderBy('name'),
  //       where('name', '>=', startAt),
  //       where('name', '<=', endAt)
  //     );
  //   }
  //   return collectionData(q, { idField: 'idDoc' }).pipe(map((data: any[]) => data.map(item => item as Product)));
  // }

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

  private async getTotalProducts() {
    const productsRef = collection(this.firestore, 'products');

    // Obtener el conteo inicial del servidor (para evitar una lectura vacía al inicio)
    const initialCount = await getCountFromServer(productsRef);
    this.totalProductsSubject.next(initialCount.data().count);

    // Suscribirse a cambios en la colección
    onSnapshot(productsRef, async () => {
      const updatedCount = await getCountFromServer(productsRef);
      this.totalProductsSubject.next(updatedCount.data().count);
    });
  }

  // getAllProductsObs(pageIndex: number, pageSize: number, name = ''): Observable<Product[]> {
  //   console.log({ pageIndex, pageSize, name });

  //   const productsRef = collection(this.firestore, 'products');
  //   let q;

  //   if (pageIndex === 0) {
  //     // Primera página: Obtener los primeros `pageSize` documentos
  //     q = query(productsRef, orderBy('name'), limit(pageSize));
  //   } else {
  //     // Si hay más páginas, continuar desde el último documento visible
  //     if (!this.lastVisible) {
  //       console.warn('lastVisible es null, no se puede paginar.');
  //       return of([]); // Evita hacer una consulta inválida
  //     }
  //     q = query(productsRef, orderBy('name'), startAfter(this.lastVisible), limit(pageSize));
  //   }

  //   return from(getDocs(q)).pipe(
  //     map((snapshot) => {
  //       if (!snapshot.empty) {
  //         this.lastVisible = snapshot.docs[snapshot.docs.length - 1]; // Guardar el último documento para la paginación
  //       }
  //       return snapshot.docs.map(doc => ({ idDoc: doc.id, ...(doc.data() as object) } as Product));
  //     })
  //   );
  // }

  getAllProductsObs(
    pageIndex = 0,
    pageSize = 10, // Default page size
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    namePrefix = ""
  ): Observable<PaginatedProducts> {

    const productsRef = collection(this.firestore, "products");
    let q = query(
      productsRef,
      orderBy("name"),
      limit(pageSize) // Limit the number of results per page
    );

    // Apply pagination if not the first page and lastDoc is provided
    if (pageIndex > 0 && lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    // Apply name filtering if provided
    if (namePrefix !== "") {
      q = query(
        q,
        where("name", ">=", namePrefix),
        where("name", "<=", namePrefix + "\uf8ff")
      );
    }


    return from(getDocs(q)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        const products = snapshot.docs.map((doc) => ({
          idDoc: doc.id,
          name: doc.data()['name'],
          price: doc.data()['price'],
          createdAt: doc.data()['createdAt'],
        }) as Product);

        const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;

        return { products, lastDoc }; // Return an object with products and lastDoc
      })
    );
  }

  async countProductsByPrefix(prefix: string): Promise<number> {
    // Definir el rango de búsqueda utilizando el prefijo
    const startAt = prefix;
    const endAt = prefix + '\uf8ff';

    // Referencia a la colección 'products'
    const productsRef = collection(this.firestore, 'products');

    // Crear la consulta con filtros de rango
    const q = query(
      productsRef,
      where('name', '>=', startAt),
      where('name', '<=', endAt)
    );

    try {
      // Obtener el conteo de documentos desde el servidor
      const snapshot = await getCountFromServer(q);
      // Retornar el conteo de documentos
      return snapshot.data().count;
    } catch (error) {
      return 0;
    }
  }
}
