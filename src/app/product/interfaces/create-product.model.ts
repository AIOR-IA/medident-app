

export class CreateProductModel {
  public name: string;
  public price: number;
  public createdAt: Date;
  public idDoc?: string;

  constructor(name: string, price:number, ) {
    this.name = name.toLowerCase();
    this.price = price;
    this.createdAt = new Date();

  }
}
