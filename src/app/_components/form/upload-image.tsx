"use client";

import { useRouter } from "next/navigation";
import React, { ReactComponentElement, ReactHTMLElement, useState } from "react";
import { api } from "~/trpc/react";


export default function UploadImage() {
  const router = useRouter();

  // Call Api
  const preSignedMutation = api.image.getPreSignedUrl.useMutation();

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.item(0);
    if (!file) {
      // Throw Error
      return;
    }
    const fileName = encodeURIComponent(file.name);
    // const fileType = encodeURIComponent(file.type);
    // console.log(fileName);

    // Call Api
    const {url, fields} = await preSignedMutation.mutateAsync({
      fileName: file.name,
      fileType: file.type,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {
      ...fields,
      "Content-Type": file.type,
      file,
    }

    const formData = new FormData();
    for (const name in data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      formData.append(name, data[name]);
    }

    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (upload.ok) {
      console.log("success");
    } else {
      console.log("unsuccessful");
    }
  }


  return (
    <>
      <h2>Upload Media</h2>
      <input
        type="file"
        onChange={uploadImage}
        accept="image/png, image/jpeg"
      />
    </>
  );
}
