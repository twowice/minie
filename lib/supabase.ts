export async function getProductItems() {
   try {
      console.log('productItems API Called');

      const response = await fetch('http://localhost:3000/productItems', {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
         throw new Error(`Fail: ${response.status}`);
      }

      const data = await response.json();
      return data; // ★ 받은 데이터를 그대로 반환해야 함
   } catch (err) {
      console.error(err);
      return []; // 실패 시 빈 배열 반환
   }
}
