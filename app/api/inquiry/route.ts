import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        const uid = req.headers.get('X-User-ID');
        if (uid === null || uid === "") {
            return Response.json({ error: "Unauthorized: No user info" }, { status: 401 })
        }
        const formData = await req.formData();

        const category = formData.get("category");
        const content = formData.get("content");
        const email = formData.get("email");
        const file = formData.get("file");

        console.log("===== 📩 새 POST 요청 도착 =====");
        console.log("카테고리:", category);
        console.log("내용:", content);
        console.log("이메일:", email);
        console.log("파일:", file);

        let image_url = null;
        if (file && typeof file === "object" && "arrayBuffer" in file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public/images/inquiry");
            await mkdir(uploadDir, { recursive: true });

            // 중복 방지
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            image_url = `/images/inquiry/${fileName}`;
        }
        /* 이메일 전송 */
        let attachments: any[] = [];
        if (file && typeof (file as File).arrayBuffer === "function") {
            const arrayBuffer = await (file as File).arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            attachments.push({
                filename: (file as File).name || `image-${Date.now()}.jpg`,
                content: buffer,
                contentType: (file as File).type || "application/octet-stream",
            });
        }

        try {
            await sendMail(
                process.env.EMAIL_USER,
                `[1:1 문의] ${category}`,
                `
                <h2>📩 새로운 문의가 도착했습니다</h2>
                <p><strong>카테고리:</strong> ${category}</p>
                <p><strong>내용:</strong></p>
                <div style="padding: 15px; background: #f6f6f6; border-radius: 8px;">
                    ${content}
                </div>
                <p><strong>사용자 이메일:</strong>${email}</p>
                `,
                attachments
            );

            console.log("이메일 발송 완료");
        } catch (e: any) {
            console.error("이메일 전송 실패:", e)
        }

        // DB INSERT
        let result;
        const { data, error } = await supabase
            .from("inquiry")
            .insert([
                {
                    user_id: Number(uid),
                    inquiry_type: category,
                    content: content,
                    image_url: image_url || "",
                    reply_email: email
                }
            ])
            .select();

        if (error) return Response.json({ message: "문의 추가 실패", error: error.message }, { status: 500 });

        result = data;

        return Response.json({ message: "이메일 요청 성공" })
    } catch (err: any) {
        return Response.json(
            { message: "서버 에러", error: err.message },
            { status: 500 }
        );
    }
}