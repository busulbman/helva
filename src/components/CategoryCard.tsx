import Link from "next/link";
import { DisplayCategory } from "@/lib/data";

interface CategoryCardProps {
  category: DisplayCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/kategori/${category.slug}`}
      className="category-card block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="p-6 text-center">
        <h3 className="font-serif text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
