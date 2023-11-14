"use client";

import { useRouter } from "next/navigation";
import React, { ReactElement, ReactHTML, useState } from "react";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'


// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
import { type FilePondFile } from "filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);


import { api } from "~/trpc/react";

export function UploadProduct() {
  const router = useRouter();

  // Inputs
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [images, setImages] = useState<FilePondFile[]>([]);

  const handleSubmit = async () => {
    // Upload the images first
    const product = await uploadProduct.mutateAsync({
      name, 
      description,
    });

    // Get the URLs
    images.map( async (filePond) => {
      const imageKey = await uploadImage(filePond, product!.id);
    });

    setName("");
    setDesc("");
    setImages([]);
    router.replace("/admin");
  }

  const uploadImage = async (filePond: FilePondFile, productId: number) => {
    const file = filePond.file; // Transform to ActualFileObject that is functionally the same as File
    if (!file) {
      return;
    }

    const { url, fields, imageKey } = await preSignedMutation.mutateAsync({
      fileName: file.name,
      fileType: file.type,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {
      ...fields,
      "Content-Type": file.type,
      file,
    };

    const formData = new FormData();
    for (const name in data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      formData.append(name, data[name]);
    }

    // Post Image to S3
    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      console.log("success");
      return imageKey;
    } else {
      console.log("unsuccessful");
      return null;
    }
  };

  const uploadProduct = api.product.add.useMutation();
  const preSignedMutation = api.image.getPreSignedPost.useMutation();

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="flex flex-col gap-2"
      >
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Product Upload</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                  Title
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"

                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                  Description
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <p className="mt-3 text-sm leading-6 text-gray-600">Write a few Sentences describing the product, make sure to include keywords.</p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Cost
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center gap-x-3">
                    <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                    <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                  Photos
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  {/* Add Image Dropper here */}
                <FilePond
                  onupdatefiles={setImages}
                  allowMultiple={true}
                  maxFiles={3}
                  name="images" /* sets the file input name, it's filepond by default */
                  labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
                  allowReorder={true}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={uploadProduct.isLoading}
        >
          {uploadProduct.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}
