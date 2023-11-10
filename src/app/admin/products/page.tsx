import { redirect } from "next/navigation";
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
            <h1 className="">Product Upload</h1>
        </div>
    )
}