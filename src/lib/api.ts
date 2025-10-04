const API_BASE_URL = 'http://localhost:8080';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  descriptions: Set<Map<string, Map<string, string>>>;
  price: number;
  category: string;
  tags: string[];
  quantityInStock: number;
  available: boolean;
  averageRating: number;
  numberOfReviews: number;
  localizedNames: Record<string, string>;
  imageUrls: string[];
  discountPercentage: number;
  onSale: boolean;
  saleStart?: string;
  saleEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shelf {
  id: string;
  warehouseId: string;
  xCoord: number;
  yCoord: number;
  level: number;
  available: boolean;
  status: string;
  productIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Robot {
  id: string;
  name: string;
  available: boolean;
  status: string;
  currentShelfId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const productsApi = {
  getAll: (page = 0, size = 10) =>
    fetchApi<PageResponse<Product>>(`/products?page=${page}&size=${size}`),

  getById: (id: string) =>
    fetchApi<Product>(`/products/${id}`),

  create: (product: Partial<Product>) =>
    fetchApi<boolean>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (product: Partial<Product>) =>
    fetchApi<boolean>('/products', {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  delete: (id: string) =>
    fetchApi<boolean>(`/products?id=${id}`, {
      method: 'DELETE',
    }),

  search: (keyword: string) =>
    fetchApi<Product[]>(`/search/products/name?q=${keyword}`),
};

export const shelvesApi = {
  getAll: (page = 0, size = 10) =>
    fetchApi<PageResponse<Shelf>>(`/shelves?page=${page}&size=${size}`),

  getById: (id: string) =>
    fetchApi<Shelf>(`/shelves/${id}`),

  create: (shelf: Partial<Shelf>) =>
    fetchApi<boolean>('/shelves', {
      method: 'POST',
      body: JSON.stringify(shelf),
    }),

  update: (shelf: Partial<Shelf>) =>
    fetchApi<boolean>('/shelves', {
      method: 'PUT',
      body: JSON.stringify(shelf),
    }),

  delete: (id: string) =>
    fetchApi<boolean>(`/shelves?id=${id}`, {
      method: 'DELETE',
    }),

  addProduct: (shelfId: string, productId: string) =>
    fetchApi<boolean>(`/shelves/${shelfId}/products/${productId}`, {
      method: 'POST',
    }),

  removeProduct: (shelfId: string, productId: string) =>
    fetchApi<boolean>(`/shelves/${shelfId}/products/${productId}`, {
      method: 'DELETE',
    }),

  searchProducts: (shelfId: string, keyword: string) =>
    fetchApi<Product[]>(`/shelves/${shelfId}/products/search?keyword=${keyword}`),
};

export const robotsApi = {
  getAll: (page = 0, size = 10) =>
    fetchApi<PageResponse<Robot>>(`/robots?page=${page}&size=${size}`),

  getById: (id: string) =>
    fetchApi<Robot>(`/robots/${id}`),

  create: (robot: Partial<Robot>) =>
    fetchApi<boolean>('/robots', {
      method: 'POST',
      body: JSON.stringify(robot),
    }),

  update: (robot: Partial<Robot>) =>
    fetchApi<boolean>('/robots', {
      method: 'PUT',
      body: JSON.stringify(robot),
    }),

  delete: (id: string) =>
    fetchApi<boolean>(`/robots?id=${id}`, {
      method: 'DELETE',
    }),
};
