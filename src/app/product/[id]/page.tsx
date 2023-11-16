

import ProductOverview from "./product-overview";



export default function Page({ params }: {params: { id: string} }) {

    return (
        <>
        <div>
            Product Id: {params.id}
            <ProductOverview productId={params.id}/>
        </div>
        </>
    )
}