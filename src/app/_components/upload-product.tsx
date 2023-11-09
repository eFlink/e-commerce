"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function UploadProduct() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");


  const uploadProduct = api.product.add.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDesc("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        uploadProduct.mutate({ name, description });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={uploadProduct.isLoading}
      >
        {uploadProduct.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
