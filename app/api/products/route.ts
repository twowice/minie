// app/api/products/route.ts
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. 모든 제품 목록 가져오기
export async function GET() {
   const { data: products, error } = await supabase.from('products').select('*');

   if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
   }

   return NextResponse.json({ products });
}

// 2. 새 제품 생성하기
export async function POST(request: Request) {
   const productData = await request.json();

   const { data, error } = await supabase.from('products').insert([productData]).select(); // 새로 생성된 데이터를 반환받음

   if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
   }

   return NextResponse.json({ product: data[0] }, { status: 201 });
}
