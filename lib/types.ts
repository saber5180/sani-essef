export type Unit = "m2" | "piece" | "carton" | "request";

export type StockStatus = "available" | "limited" | "out" | "on_request";

export type ImageAsset = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

export type ProductVariant = {
  id: string;
  name: string;
  finish: string | null;
  price: number | null;
};

export type Spec = {
  label: string;
  value: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  reference: string | null;
  categoryId: string;
  subcategoryId: string;
  brand: string | null;
  material: string | null;
  finish: string | null;
  color: string | null;
  format: string | null;
  originCountry: string | null;
  madeIn: string | null;
  style: string | null;
  usage: string | null;
  price: number | null;
  oldPrice: number | null;
  discount: number | null;
  currency: "TND";
  unit: Unit | null;
  stock: number | null;
  stockStatus: StockStatus;
  featured: boolean;
  newProduct: boolean;
  promotion: boolean;
  bestSeller: boolean;
  limitedStock: boolean;
  calculatorEnabled: boolean;
  lossPercent: number;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  images: ImageAsset[];
  variants: ProductVariant[];
  technical: Spec[];
  extraInfo: string;
  views: number;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "admin" | "customer";
  createdAt: string;
};

export type Customer = {
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  governorate: string;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  productId: string | null;
  name: string;
  reference: string | null;
  unit: string | null;
  quantity: number;
  unitPrice: number | null;
  lineTotal: number | null;
  image: string | null;
};

export type Order = {
  id: string;
  customerId: string;
  userId: string | null;
  mode: "delivery" | "pickup" | "quote";
  contactWhatsapp: boolean;
  comment: string;
  status: "new" | "confirmed" | "done" | "cancelled";
  total: number | null;
  currency: "TND";
  items: OrderItem[];
  createdAt: string;
};

export type Quote = {
  id: string;
  name: string;
  phone: string;
  email: string;
  productName: string;
  quantity: string;
  surface: string;
  message: string;
  imageUrl: string | null;
  status: "new" | "in_progress" | "done";
  createdAt: string;
};

export type Review = {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  room: string;
  image: string;
  productIds: string[];
  published: boolean;
  sortOrder: number;
  createdAt: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  active: boolean;
  sortOrder: number;
};

export type Settings = {
  phone: string;
  phoneTel: string;
  gsm: string;
  gsmTel: string;
  whatsapp: string;
  address: string;
  hours: string;
  days: string;
  slogan: string;
  facebook: string;
  instagram: string;
  email: string;
};

export type Database = {
  users: User[];
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  customers: Customer[];
  orders: Order[];
  quotes: Quote[];
  reviews: Review[];
  messages: ContactMessage[];
  projects: Project[];
  banners: Banner[];
  settings: Settings;
};
