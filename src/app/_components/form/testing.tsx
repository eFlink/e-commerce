"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
import { FilePondFile } from "filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { api } from "~/trpc/react";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Our app
export default function Testing() {
  const [files, setFiles] = useState<FilePondFile[]>([]);

  const preSignedMutation = api.image.getPreSignedUrl.useMutation();

  const uploadImage = async (file: File) => {

    if (!file) {
      // Throw Error
      return;
    }
    // console.log(file);

    // Call Api
    const { url, fields } = await preSignedMutation.mutateAsync({
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

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      console.log("success");
    } else {
      console.log("unsuccessful");
    }
  };

  return (
    <div>
      <form
      onSubmit={ (event) => {
        event.preventDefault();
        console.log(files.at(0)?.file)
        console.log(files.at(0))
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        files.forEach(async (value) => {
          await uploadImage(value.file);
        })
        }}>
        <FilePond
          onupdatefiles={setFiles}
          allowMultiple={true}
          maxFiles={3}
          name="files" /* sets the file input name, it's filepond by default */
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
        <button type="submit">Hello</button>
      </form>
    </div>
  );
}