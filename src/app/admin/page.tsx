import { redirect } from "next/navigation";
// import { UploadProduct } from "../_components/form/upload-product";
import { api } from "~/trpc/server";
import { UploadProduct } from "../_components/form/upload-product";

export default async function Page() {
    // Product Uploading
    // Name, Description, Brand, Price
    const isAdmin = await api.user.isAdmin.query();
    if (!isAdmin) {
        redirect("/");
    }

    return (
        <div>
            <UploadProduct/>
        </div>
    )
}