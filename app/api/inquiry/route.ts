import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {

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

        const transport = nodemailer.createTransport({
            host: "smtp.naver.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

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

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `[1:1 문의] ${category}`,
            html: `
                <h2>📩새로운 문의가 도착했습니다</h2>
                <p><strong>카테고리:</strong> ${category}</p>
                <p><strong>내용:</strong><br>${content}</p>
                <p><strong>사용자 이메일:</strong> ${email}</p>
            `,
            attachments,
        };

        await transport.sendMail(mailOptions);

        // DB INSERT
        let result;
        const { data, error } = await supabase
            .from("inquiry")
            .insert([
                {
                    inquiry_type: category,
                    content: content,
                    image_url: image_url || "",
                    reply_email: email
                }
            ])
            .select();

        if (error) return Response.json({ message: "리뷰 추가 실패", error: error.message }, { status: 500 });

        result = data;

        return Response.json({ message: "이메일 요청 성공" })
    } catch (err: any) {
        return Response.json(
            { message: "서버 에러", error: err.message },
            { status: 500 }
        );
    }
}