"use client";

import { useState } from "react";
import { Box, Button, CloseButton, Image, Text } from "@chakra-ui/react";

interface PhotoUploaderProps {
  initialPhotoURL?: string | null;
  onChange?: (file: File | null) => void;
}

export default function PhotoUploader({ initialPhotoURL = null, onChange }: PhotoUploaderProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(initialPhotoURL);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoURL(url);
    onChange?.(file);
  };

  const handleRemove = () => {
    setPhoto(null);
    setPhotoURL(null);
    onChange?.(null);
  };

  return (
    <Box>
      <input
        type="file"
        id="photo-upload"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {photoURL ? (
        <Box position="relative" width="80px" height="80px">
          <Image
            src={photoURL}
            alt="업로드 사진"
            boxSize="80px"
            borderRadius="3px"
            objectFit="cover"
            cursor="pointer"
            onClick={() => document.getElementById("photo-upload")?.click()}
          />
          <CloseButton
            size="sm"
            position="absolute"
            w="18px"
            h="18px"
            minW="18px"
            minH="18px"
            top="0"
            right="0"
            bg="red"
            borderRadius="full"
            onClick={handleRemove}
          />
        </Box>
      ) : (
        <Button
          w="80px"
          h="80px"
          border="1px solid #B5B5B5"
          borderRadius="3px"
          fontSize="16px"
          color="#B5B5B5"
          _hover={{ bg: "#f1f1f1" }}
          onClick={() => document.getElementById("photo-upload")?.click()}
        >
          +
        </Button>
      )}
    </Box>
  );
}
