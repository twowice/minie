import { supabase } from "@/lib/supabase";

export async function uploadInquiryImage(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `inquiry/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
        .from("inquiry")
        .upload(fileName, buffer, {
            contentType: file.type,
        });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
        .from("inquiry")
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

export async function uploadReviewImage(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `reviews/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
        .from("reviews")
        .upload(fileName, buffer, {
            contentType: file.type,
        });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
        .from("reviews")
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}