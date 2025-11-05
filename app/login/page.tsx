// app/login/page.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
        
        <form className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
          >
            로그인
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          아직 계정이 없으신가요? <a href="/signup" className="text-blue-600 hover:underline">회원가입</a>
        </p>
      </div>
    </div>
  );
}