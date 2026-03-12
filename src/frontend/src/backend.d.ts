export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ProductInput {
    name: string;
    description: string;
    image?: ExternalBlob;
    price: bigint;
}
export interface ProductUpdate {
    id: bigint;
    name: string;
    description: string;
    image?: ExternalBlob;
    price: bigint;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    image?: ExternalBlob;
    price: bigint;
    position: bigint;
}
export interface backendInterface {
    createProduct(newProduct: ProductInput): Promise<Product>;
    deleteProduct(id: bigint): Promise<void>;
    editProduct(update: ProductUpdate): Promise<void>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getSiteContent(pagename: string): Promise<string | null>;
    reorderProducts(ids: Array<bigint>): Promise<void>;
    setSiteContent(pagename: string, content: string): Promise<void>;
}
