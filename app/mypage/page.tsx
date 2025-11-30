"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const pathname = usePathname();

    /* 관리자 여부 */
    const { user, isAdmin } = useUser();
    useEffect(() => {
        if (!user) { router.replace("/login"); return; }

        if (pathname === "/mypage" || pathname === "/mypage/") {
            router.replace("/mypage/order");
        }
    }, [user, pathname, router]);
    return <div>마이페이지 홈</div>;
}
