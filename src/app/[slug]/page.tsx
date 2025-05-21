import { supabase } from "@/lib/supabaseClient";
import HeroSection from "@/components/sections/HeroSection";
import TextSection from "@/components/sections/TextSection";
import ImageSection from "@/components/sections/ImageSection";
import ReviewsSection from "@/components/sections/ReviewsSection";

export const revalidate = 60; // ISR

export default async function PublicPage({ params }: { params: { slug: string } }) {
  const { data: pageData } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", params.slug)
    .single();

  if (!pageData) return <div className="p-8 text-red-500">Страница не найдена</div>;

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", pageData.id)
    .order("sort_order");

  return (
    <main className="space-y-16 py-8">
      {sections?.map((section) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={section.id} {...section} />;
          case "text":
            return <TextSection key={section.id} content={section.content ?? ""} />;
          case "image":
            return (
              <ImageSection
                key={section.id}
                image_url={section.image_url}
                caption={section.caption}
              />
            );
          case "reviews":
            return (
              <ReviewsSection
                key={section.id}
                reviews={JSON.parse(section.content ?? "[]")}
              />
            );
          default:
            return null;
        }
      })}
    </main>
  );
}
