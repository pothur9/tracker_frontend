import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Loader2 } from "lucide-react";

const SearchResultsContent = dynamic(() => import("./SearchResultsClient"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
    </div>
  ),
});

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        }
      >
        <SearchResultsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
