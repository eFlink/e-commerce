import { redirect } from "next/navigation";
import { UploadProduct } from "../_components/form/upload-product";
import { api } from "~/trpc/server";

export default async function Home() {
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