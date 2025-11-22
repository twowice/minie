'use client';
import TypeBadge from '@/components/Badge';
import ReviewChart from '@/components/ReviewChart';

import { useCart } from '@/contexts/ShoppingCartContext';
import { getDiscountRate } from '@/utils/calculator/discountRateCalculator';
import {
   Accordion,
   Box,
   Button,
   CloseButton,
   Container,
   Dialog,
   Flex,
   HStack,
   IconButton,
   Image,
   RadioGroup,
   Spacer,
   Tabs,
   Text,
   Textarea,
   useDisclosure,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai';
import { FaRegHeart } from 'react-icons/fa6';

export default function ShoppingDetail() {
   const router = useRouter();
   const { id } = useParams();
   // 👇 buyNow 함수 가져오기
   const { addToCart, toggleLike, isLiked, buyNow } = useCart();

   const { open, onOpen, onClose } = useDisclosure();

   const [productAsk, setProductAsk] = useState(true);
   const [orderAsk, setOrderAsk] = useState(false);
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);

   const comments = [
      { userid: 'A', rating: 5, content: '좋아요' },
      { userid: 'B', rating: 4, content: '괜찮아요' },
      { userid: 'C', rating: 3, content: '보통이에요' },
   ];

   const [rating, setRating] = useState(0);
   const [quantity, setQuantity] = useState(1);
   const [like, setLike] = useState(false);

   const [reviewSummary, setReviewSummary] = useState({
      totalCount: 0,
      rating: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
   });

   const fullStars = Math.floor(reviewSummary.rating);
   const hasHalfStar = (reviewSummary.rating * 10) % 10 >= 5;
   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

   const reviews = [
      {
         value: 'info',
         title: '상품문의',
         subtitle: '구매확정 문의',
         status: '답변완료',
         userid: '따가운 볼',
         date: '2025.10.23',
         product: '타임 리페어 인텐시브 크림',
         content: `이벤트 응모할려고 오늘 아침에 상품 구매를 했는데 구매확정 상태여야 응모가 가능하더라구요...`,
         commenttitle: '답변.',
         comment: `안녕하세요 고객님...`,
         commentdate: '2025.10.23',
      },
      {
         value: 'productdetail',
         title: '상품문의',
         subtitle: '기존 제품과의 차이',
         status: '답변 대기중',
         userid: '불타는 스킨',
         date: '2025.10.23',
         product: '타임 리페어 인텐시브 크림',
         content: '기존의 수딩 미스트 토너를 잘 사용하고있는데요...',
         commenttitle: '',
         comment: '',
      },
   ];

   // 👇 [NaN 방지] 안전한 숫자 변환 함수
   const safeNumber = (val: any) => {
      if (!val) return 0;
      // 문자열에 포함된 콤마(,) 제거 후 숫자로 변환
      const str = String(val).replace(/,/g, ''); // 콤마 제거
      const num = Number(String(val).replace(/[^0-9.-]+/g, ''));
      return isNaN(num) ? 0 : num;
   };

   const createCartItem = () => {
      if (!product) return null;

      // 가격과 할인을 미리 숫자로 정제
      const cleanPrice = safeNumber(product.price);
      const cleanDiscount = safeNumber(product.discount_amount ?? product.discount);

      return {
         id: product.id,
         title: product.name,
         name: product.name,
         brand: product.brand,
         image: product.image,

         // 👇 무조건 숫자로 들어감
         price: cleanPrice,

         // 👇 할인 필드명 통일 (Context가 알아먹을 수 있게 다 넣어줌)
         discount: cleanDiscount,
         discountAmount: cleanDiscount,
         discount_amount: cleanDiscount,

         quantity: quantity,
         checked: true, // 바로 구매는 무조건 체크
      };
   };

   useEffect(() => {
      if (!id) return;
      setLoading(true);

      fetch(`/api/products/${id}`)
         .then(async res => {
            const text = await res.text();
            try {
               return text ? JSON.parse(text) : null;
            } catch (e) {
               console.error('JSON Parsing Error:', e);
               return null;
            }
         })
         .then(data => {
            if (Array.isArray(data)) {
               setProduct(data[0]);
            } else if (data && data.data) {
               setProduct(data.data);
            } else if (data) {
               setProduct(data);
            }
         })
         .catch(err => console.error('데이터 로딩 실패', err))
         .finally(() => setLoading(false));

      if (comments.length > 0) {
         const total = comments.reduce((acc, comment) => acc + comment.rating, 0);
         setRating((total / comments.length).toFixed(1));
      }
   }, [id]);

   useEffect(() => {
      if (product) {
         const isAlreadyLiked = isLiked(product.id);
         setLike(isAlreadyLiked);
      }
   }, [product, isLiked]);

   if (loading)
      return (
         <Box p={10} textAlign={'center'}>
            로딩중...
         </Box>
      );
   if (!product)
      return (
         <Box p={10} textAlign={'center'}>
            상품정보가 존재하지 않습니다.
         </Box>
      );

   const increase = () => setQuantity(prev => prev + 1);
   const decrease = () => setQuantity(prev => Math.max(1, prev - 1));

   const handleQna = () => {
      setProductAsk(true);
      setOrderAsk(false);
      onOpen();
   };

   const handleSaveQna = () => {
      onClose();
   };

   const handleCancelQna = () => {
      onClose();
   };

   const handleCartClick = e => {
      e.preventDefault();
      e.stopPropagation();
      const item = createCartItem();
      if (item) {
         addToCart(item);
         if (confirm('장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?')) {
            router.push('/mypage/cart');
         }
      }
   };

   const handleLikeClick = e => {
      e.preventDefault();
      e.stopPropagation();
      if (!product) return;
      const item = createCartItem();
      if (item) {
         toggleLike(item);
         if (!like) alert('좋아요에 담겼습니다.');
      }
      setLike(prev => !prev);
   };

   const handleBuyClick = (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      if (!product) return;

      const item = createCartItem();
      if (!item) return;

      buyNow(item);
      router.push('/payment');
   };
   return (
      <Container maxW={'7xl'}>
         <Box>
            <Flex gap={'40px'} paddingBottom={'40px'} borderBottom={'1px solid rgba(204,204,204,0.8)'}>
               <Box maxW={'540px'} maxH={'540px'} w={'50%'}>
                  <Image
                     src={`/${encodeURI(product.image)}`}
                     alt={product.name}
                     w={'100%'}
                     h={'100%'}
                     objectFit={'cover'}
                  />
               </Box>
               <Flex direction={'column'} gap={'16px'} flex={1}>
                  <Flex justifyContent={'space-between'} alignItems={'center'} color={'black'}>
                     <Text fontSize={'24px'} fontWeight={'700'}>
                        {product.brand}
                     </Text>
                     <Button
                        aria-label="like"
                        bgColor={'white'}
                        p={2}
                        borderRadius="50%"
                        onClick={handleLikeClick}
                        border="1px solid #eee"
                     >
                        <FaRegHeart color={like ? '#FA6D6D' : '#cccccc'} size={18} />
                     </Button>
                  </Flex>
                  <Text fontSize={'24px'} color={'rgba(0,0,0,0.6)'} fontWeight={'500'}>
                     {product.name}
                  </Text>

                  <Spacer />
                  <Flex gap={'8px'} alignItems={'center'}>
                     {product.discount_amount > 0 && (
                        <HStack fontSize={'16px'} fontWeight={'500'} gap={'4px'}>
                           <Text color={'#FA6D6D'}>{getDiscountRate(product.price, product.discount_amount)}%</Text>
                           <Text color={'rgba(0,0,0,0.6)'} textDecoration={'line-through'}>
                              {Number(product.price).toLocaleString()}원
                           </Text>
                        </HStack>
                     )}
                     <Text fontSize={'36px'} color={'#FA6D6D'} fontWeight={'500'}>
                        {(Number(product.price) - (Number(product.discount_amount) || 0)).toLocaleString()}원
                     </Text>
                  </Flex>

                  <Flex gap={'8px'} w={'100%'} borderBottom={'1px solid #cccccc'} paddingBottom={'20px'}>
                     {product.skincare && <TypeBadge typeName={product.skincare} />}
                     {product.type && <TypeBadge typeName={product.type} />}
                     {product.mytype && <TypeBadge typeName={product.mytype} />}
                     {product.use && <TypeBadge typeName={product.use} />}
                  </Flex>

                  <Flex
                     justifyContent={'space-between'}
                     p={'8px 16px'}
                     color={'rgba(0,0,0,0.7)'}
                     border={'1px solid rgb(204,204,204)'}
                     bgColor={'rgba(204,204,204,0.5)'}
                     borderRadius={'5px'}
                     alignItems={'center'}
                  >
                     <Text>구매수량</Text>
                     <Flex alignItems={'center'} gap={'8px'}>
                        <Button
                           aria-label="decrease"
                           display={'flex'}
                           alignItems={'center'}
                           justifyContent={'end'}
                           bgColor={'transparent'}
                           _hover={{ opacity: 0.7 }}
                           onClick={decrease}
                           disabled={quantity <= 1}
                           p={0}
                           minW={'auto'}
                        >
                           <AiFillMinusCircle size={24} color={quantity === 1 ? '#CCCCCC' : 'black'} />
                        </Button>

                        <Text w={'30px'} textAlign={'center'} fontWeight="bold">
                           {quantity}
                        </Text>

                        <Button
                           aria-label="increase"
                           display={'flex'}
                           alignItems={'center'}
                           bgColor={'transparent'}
                           justifyContent={'end'}
                           _hover={{ opacity: 0.4 }}
                           onClick={increase}
                           p={0}
                           minW={'auto'}
                        >
                           <AiFillPlusCircle size={24} color={'black'} />
                        </Button>
                     </Flex>
                  </Flex>

                  <Flex
                     justifyContent={'space-between'}
                     paddingBottom={'20px'}
                     borderBottom={'1px solid #FA6D6D'}
                     fontSize={'36px'}
                     color={'#FA6D6D'}
                  >
                     <Text>상품금액 합계</Text>
                     <Text>{((product.price - (product.discount_amount || 0)) * quantity).toLocaleString()}원</Text>
                  </Flex>
                  <HStack gap={'20px'} w={'100%'}>
                     <Button
                        border={'1px solid #cccccc'}
                        bgColor={'white'}
                        flex={1}
                        color={'black'}
                        onClick={handleCartClick}
                        h={'50px'}
                     >
                        장바구니
                     </Button>
                     <Button
                        bgColor={'#FA6D6D'}
                        color={'white'}
                        flex={1}
                        onClick={handleBuyClick}
                        h={'50px'}
                        _hover={{ bgColor: '#e05d5d' }}
                     >
                        바로 구매
                     </Button>
                  </HStack>
               </Flex>
            </Flex>
         </Box>
         {/* 나머지 탭 및 리뷰 부분 기존 유지 */}
         <Flex color={'black'} gap={'8px'}>
            <HStack alignContent={'flex-end'} padding={'20px 0'}>
               <Text fontSize={'20px'} fontWeight={'700'} color={'rgba(0,0,0,0.7)'}>
                  고객 리뷰
               </Text>
               <HStack h="42px" py="5px" paddingTop="10px">
                  <Text fontSize="16px" color="black" paddingRight="10px">
                     <Text as="span" fontSize="32px" fontWeight="bold" color="black">
                        {(reviewSummary.rating ?? 0).toFixed(1)}
                     </Text>{' '}
                     점
                  </Text>
                  <HStack>
                     {Array(fullStars)
                        .fill(0)
                        .map((_, i) => (
                           <Text key={`full-${i}`} color="yellow.400" fontSize="32px">
                              ★
                           </Text>
                        ))}
                     {hasHalfStar && (
                        <Box
                           width="32px"
                           height="32px"
                           position="relative"
                           display="flex"
                           alignItems="center"
                           justifyContent="center"
                        >
                           <Text color="gray.300" fontSize="32px">
                              ★
                           </Text>
                           <Text
                              color="yellow.400"
                              fontSize="32px"
                              position="absolute"
                              top="0"
                              left="0"
                              width="50%"
                              overflow="hidden"
                              lineHeight="1"
                           >
                              ★
                           </Text>
                        </Box>
                     )}
                     {Array(emptyStars)
                        .fill(0)
                        .map((_, i) => (
                           <Text key={`empty-${i}`} color="gray.300" fontSize="32px">
                              ★
                           </Text>
                        ))}
                  </HStack>
               </HStack>
            </HStack>
         </Flex>
         <Tabs.Root
            defaultValue={'productDetail'}
            color={'rgba(0,0,0,0.3)'}
            fontSize={'16px'}
            variant={'plain'}
            textAlign={'center'}
         >
            <Tabs.List justifyContent={'center'} display={'flex'} alignItems={'center'} w={'100%'}>
               <Box position={'absolute'} bottom={0} left={0} w={'100%'} h={'1px'} bgColor={'#cccccc'} zIndex={0} />
               <Tabs.Trigger
                  value="productDetail"
                  flex={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                  _selected={{ color: '#FA6D6D', bottom: '0px' }}
                  _hover={{ color: '#FA6D6D', opacity: 0.7 }}
                  zIndex={1}
               >
                  상품설명
               </Tabs.Trigger>
               <Tabs.Trigger
                  value="payInfo"
                  flex={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                  _hover={{ color: '#FA6D6D', opacity: 0.7 }}
                  _selected={{ color: '#FA6D6D', bottom: '0px' }}
                  zIndex={1}
               >
                  구매정보
               </Tabs.Trigger>
               <Tabs.Trigger
                  value="review"
                  flex={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                  _hover={{ color: '#FA6D6D', opacity: 0.7 }}
                  _selected={{ color: '#FA6D6D', bottom: '0px' }}
                  zIndex={1}
               >
                  리뷰
               </Tabs.Trigger>
               <Tabs.Trigger
                  value="QnA"
                  flex={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                  _hover={{ color: '#FA6D6D', opacity: 0.7 }}
                  _selected={{ color: '#FA6D6D', bottom: '0px' }}
                  zIndex={1}
               >
                  Q & A
               </Tabs.Trigger>
               <Tabs.Indicator bgColor={'#FA6D6D'} h={'1px'} bottom={'0'} zIndex={2} boxShadow={'none'} />
            </Tabs.List>
            <Tabs.Content value="productDetail">
               <Image src={`/${encodeURI(product.image)}`} w={'100%'} alt="" p={'40px 0 20px 0 '} />
            </Tabs.Content>
            <Tabs.Content value="payInfo">
               <Box pb={'20px'}>
                  <Text fontSize={'24px'} fontWeight={'700'} color={'black'} textAlign={'left'} p={'20px 0 20px 0'}>
                     상품정보 제공고시
                  </Text>
                  <Box
                     fontSize={'16px'}
                     borderTop={'1px solid #cccccc'}
                     borderBottom={'1px solid #cccccc'}
                     color={'black'}
                  >
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           제품명
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           {product.name}
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           내용물의 용량 또는 중량
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           {product.volume || '200ml(상세참조)'}
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           제품 주요 사양
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           {product.skin_type || '모든 피부용'} / {product.gender}
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           제조번호 및 사용기간
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           별도 표기 / {product.created_at?.split('T')[0]} 이후 제조
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           사용방법
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           {product.usage ||
                              `사용 전 가볍게 흔들어 준 후, 눈을 감고 얼굴 전체에 고르게 분사하여 흡수 시켜줍니다. 피부에 건조함이 느껴질 때 수시로 뿌려줍니다.`}
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Box p={'10px 20px'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           <Text fontWeight={'700'}>식품의약품안전처 심사 필 유무</Text>
                           <Text fontWeight={'700'}>(기능성 화장품)</Text>
                        </Box>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           해당없음
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           화장품법에 따라 기재해야 하는 모든 성분
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           {product.ingredient || `정제수, 글리세린...`}
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           사용할 때 주의사항
                        </Text>
                        <Box p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           ※사용 전에 반드시 사용법 및 사용할 때의 주의사항을 숙지 하신 후 사용하십시오...
                        </Box>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           제조국
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           대한민국
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           화장품제조업자
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           코스맥스(주)
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           화장품책임판매업자
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           동국제약주식회사
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'} borderBottom={'1px solid #cccccc'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           품질보증기준
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           본 상품에 이상이 있을 경우, 공정거래위원회 고시 ‘소비자분쟁해결기준’에 의해 보상해드립니다
                        </Text>
                     </Flex>
                     <Flex textAlign={'left'}>
                        <Text p={'10px 20px'} fontWeight={'700'} bgColor={'rgba(204,204,204,0.8)'} w={'300px'}>
                           소비자 상담실
                        </Text>
                        <Text p={'10px 20px'} bgColor={'rgba(204,204,204,0.3)'} w={'100%'}>
                           000-000-0000(수신자부담)
                        </Text>
                     </Flex>
                  </Box>
               </Box>
            </Tabs.Content>
            <Tabs.Content value="review">
               <ReviewChart productId={id} onSummaryChange={summary => setReviewSummary(summary)} />
            </Tabs.Content>
            <Tabs.Content value="QnA">
               <Box mb={'32px'}>
                  <HStack
                     p={'20px 0'}
                     color={'black'}
                     justifyContent={'space-between'}
                     alignItems={'center'}
                     borderBottom={'1px solid #cccccc'}
                  >
                     <Text fontSize={'24px'} fontWeight={'700'}>
                        상품 문의
                     </Text>
                     <Flex gap={'16px'} alignItems={'center'}>
                        <Text fontSize={'16px'}>
                           <strong>{reviews.length}</strong> 개의 문의
                        </Text>
                        <Button
                           bgColor={'white'}
                           border={'1px solid rgba(0,0,0,0.2)'}
                           color={'black'}
                           borderRadius={'4px'}
                           w={'80px'}
                           h={'40px'}
                           fontSize={'16px'}
                           onClick={handleQna}
                        >
                           상품문의
                        </Button>
                     </Flex>
                  </HStack>
                  <Accordion.Root mt={'10px'} collapsible w={'100%'} p={0}>
                     {reviews.map((item, index) => (
                        <Accordion.Item
                           key={index}
                           value={item.value}
                           p={'16px 32px'}
                           borderBottom={'1px solid #cccccc'}
                        >
                           <Flex justifyContent={'flex-end'}>
                              <Button border={'1px solid #cccccc'} w={'100px'} p={'0'} fontSize={'12px'} h={'30px'}>
                                 답변
                              </Button>
                           </Flex>
                           <Accordion.ItemTrigger justifyContent={'space-between'} w={'100%'} borderRadius={0}>
                              <Flex direction={'column'} gap={'8px'} w={'100%'}>
                                 <Flex justifyContent={'space-between'}>
                                    <Text color={'#5c5c5c'} fontSize={'16px'}>
                                       {item.title}
                                    </Text>
                                 </Flex>
                                 <Text color={'black'} fontSize={'20px'}>
                                    {item.subtitle}
                                 </Text>
                                 <Flex gap={'10px'} color={'#5c5c5c'} fontSize={'12px'} fontWeight={'500'}>
                                    <Text w={'80px'}>{item.status}</Text>
                                    <Text color={'black'}>{item.userid}</Text>
                                    <Text>{item.date}</Text>
                                 </Flex>
                              </Flex>
                              <Accordion.ItemIndicator color={'black'} />
                           </Accordion.ItemTrigger>
                           <Accordion.ItemContent
                              bgColor={'rgba(204,204,204,0.5)'}
                              borderRadius={0}
                              color={'#A9A9A9'}
                              p={0}
                           >
                              <Accordion.ItemBody
                                 textAlign={'left'}
                                 p={'16px 32px'}
                                 borderBottom={'1px solid #cccccc'}
                                 borderTop={'1px solid #cccccc'}
                              >
                                 <Text mb={'8px'}>{item.product}</Text>
                                 <Text color={'#5C5C5C'} whiteSpace="pre-line">
                                    {item.content}
                                 </Text>
                              </Accordion.ItemBody>
                              {(item.comment || item.commenttitle) && (
                                 <Accordion.ItemBody
                                    textAlign={'left'}
                                    p={'16px 32px'}
                                    borderBottom={'1px solid #cccccc'}
                                 >
                                    <Text mb={'8px'}>{item.commenttitle}</Text>
                                    <Text mb={'8px'} color={'#5C5C5C'} whiteSpace="pre-line">
                                       {item.comment}
                                    </Text>
                                    <Text>{item.commentdate}</Text>
                                 </Accordion.ItemBody>
                              )}
                           </Accordion.ItemContent>
                        </Accordion.Item>
                     ))}
                  </Accordion.Root>
               </Box>
               <Dialog.Root placement={'center'} open={open} onClose={onClose}>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                     <Dialog.Content bg={'white'} color={'black'} w={'400px'}>
                        <Dialog.Header
                           display={'flex'}
                           justifyContent={'space-between'}
                           alignItems={'center'}
                           p={'16px'}
                        >
                           <Dialog.Title m={0} fontWeight={'500'}>
                              상품 Q & A
                           </Dialog.Title>
                           <Dialog.CloseTrigger>
                              <CloseButton
                                 size={'sm'}
                                 color={'black'}
                                 bgColor={'white'}
                                 onClick={handleSaveQna}
                                 position={'static'}
                              />
                           </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body>
                           <Flex direction={'column'} gap={'16px'}>
                              <Box>
                                 <Text fontWeight={'500'} fontSize={'16px'} pb={'8px'} textAlign={'left'}>
                                    문의 유형
                                 </Text>
                                 <RadioGroup.Root
                                    variant={'outline'}
                                    defaultValue={'productAsk'}
                                    colorPalette={'red'}
                                    size={'sm'}
                                 >
                                    <Flex gap={4}>
                                       <RadioGroup.Item value="productAsk">
                                          <RadioGroup.ItemHiddenInput />
                                          <RadioGroup.ItemIndicator />
                                          <RadioGroup.ItemText fontSize={'12px'}>상품문의</RadioGroup.ItemText>
                                       </RadioGroup.Item>
                                       <RadioGroup.Item value="orderAsk">
                                          <RadioGroup.ItemHiddenInput />
                                          <RadioGroup.ItemIndicator />
                                          <RadioGroup.ItemText fontSize={'12px'}>주문 상품문의</RadioGroup.ItemText>
                                       </RadioGroup.Item>
                                    </Flex>
                                 </RadioGroup.Root>
                              </Box>
                              <Box>
                                 <Text fontWeight={'500'} fontSize={'16px'} pb={'8px'} textAlign={'left'}>
                                    타임 리페어 인텐시브 크림
                                 </Text>
                                 <Textarea
                                    placeholder="Q&A 게시판에서는 고객님의 정보 확인이 어려우므로 배송 문의 등은 1:1 문의를 이용 부탁드립니다."
                                    variant={'outline'}
                                    h={'250px'}
                                    size={'xs'}
                                 />
                                 <Text textAlign={'left'} color={'#898989'} fontSize={'12px'}>
                                    0자 / 250자
                                 </Text>
                              </Box>
                           </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                           <Flex w={'100%'} gap={'8px'}>
                              <IconButton
                                 bgColor={'white'}
                                 border={'1px solid #cccccc'}
                                 color={'black'}
                                 flex={1}
                                 h={'40px'}
                                 onClick={handleCancelQna}
                              >
                                 취소
                              </IconButton>
                              <Button bgColor={'#FA6D6D'} color={'white'} w={'50%'} h={'40px'} onClick={handleSaveQna}>
                                 등록
                              </Button>
                           </Flex>
                        </Dialog.Footer>
                     </Dialog.Content>
                  </Dialog.Positioner>
               </Dialog.Root>
            </Tabs.Content>
         </Tabs.Root>
      </Container>
   );
}
