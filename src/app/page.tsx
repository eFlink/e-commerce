import { api } from "~/trpc/server";
import { UploadProduct } from "./_components/form/upload-product";
import Hero from "./hero";
import Header from "./_components/ui/header";
import Footer from "./_components/ui/footer";
import Link from "next/link";


export default function Page() {
  // Add server function

  return (
    <>
      <Header />
      <Hero />
      <LatestProducts />
      <Footer />
    </>
  );
}

async function LatestProducts() {
  const products = await api.product.getLatestWithImages.query();
  const urls = Array<string>();
  const imageUrls = new Map<number, string>();
  for (const product of products) {
    const { url } = await api.image.getPresignedUrl.query({
      key: product.image.image_url,
    })
    imageUrls.set(product.product.id, url);
  }

  return (
    <section aria-labelledby="trending-heading">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
        <div className="md:flex md:items-center md:justify-between">
          <h2 id="favorites-heading" className="text-2xl font-bold tracking-tight text-gray-900">
            Trending Products
          </h2>
          <a href="#" className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block">
            Shop the collection
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
          {products.map((product) => (
            <div key={product.product.id} className="group relative">
              <div className="h-56 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src={imageUrls.get(product.product.id)}
                  // alt={product.imageAlt}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                <Link href={`/product/${product.product.id}`}>
                  <span className="absolute inset-0" />
                  {product.product.name}
                </Link>
              </h3>
              {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{product.price}</p> */}
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm md:hidden">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Shop the collection
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )

}