import Link from "next/link";
import { DisplayCategory } from "@/lib/data";
import ProductImage from "./ProductImage";

interface CategoryCardProps {
  category: DisplayCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/kategori/${category.slug}`}
      className="category-card block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <ProductImage
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-white">
            {category.name}
          </h3>
          <p className="text-white/80 text-sm mt-1 line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
