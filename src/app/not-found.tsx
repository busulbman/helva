import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl md:text-8xl font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Anasayfaya Dön
          </Link>
          <Link href="/urunler" className="btn-secondary">
            Ürünleri Keşfet
          </Link>
        </div>
      </div>
    </div>
  );
}
