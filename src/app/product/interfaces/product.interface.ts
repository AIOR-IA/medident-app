import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
export interface Product {
  name: string;
  price: number;
  createdAt?: Date;
  idDoc?: string;
}

export interface PaginatedProducts {
  products: Product[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
}
