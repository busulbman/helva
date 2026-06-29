import Link from "next/link";
import { DisplayProduct } from "@/lib/data";
import { generateWhatsAppLink, generateOrderMessage } from "@/data/config";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: DisplayProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappLink = generateWhatsAppLink(generateOrderMessage(product.name, 1));

  return (
    <div className="product-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image */}
      <Link href={`/urunler/${product.slug}`} className="block relative aspect-square overflow-hidden bg-cream">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          fill
          className="hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isBestseller && (
            <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded">
              Çok Satan
            </span>
          )}
          {product.isNew && (
            <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded">
              Yeni
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/urunler/${product.slug}`}>
          <h3 className="font-serif text-lg font-semibold text-gray-900 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-primary">₺{product.price}</span>
            <span className="text-sm text-gray-500 ml-1">/ {product.weight}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/urunler/${product.slug}`}
            className="flex-1 btn-secondary text-center text-sm py-2"
          >
            Detay
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-whatsapp justify-center text-sm py-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Sipariş
          </a>
        </div>
      </div>
    </div>
  );
}
