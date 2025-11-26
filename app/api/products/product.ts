export interface Product {
   id: number;
   title: string;
   category: string;
   price: number;
   gender: string;
   is_discounted: boolean;
   discount_amount: number;
   skincare: string;
   use: string;
   type: string;
   style: string;
   image: string;
   description?: string;
   skin_type?: string;
   brand: string;
   detail_image: string;
   volume?: string;
   created_at?: string;
   usage?: string;
   ingredient?: string;
   num?: number;
   checked?: boolean;
}

export interface FilterBarProps {
   category: string;
   list: Product[];
   onDataFiltered: (data: Product[]) => void;
}

export interface QnaItem {
   id: number;
   product_id: number;
   user_id: string;
   content: string;
   answer: string | null;
   product?: string;
   type?: string;
   created_at: string;
}
