import { UploadProduct } from "../_components/upload-product";

export default function Home() {
    // Product Uploading
    // Name, Description, Brand, Price
    return (
        <div>
            <h1 className="">Product Upload</h1>
            <UploadProduct/>
        </div>
    )
}