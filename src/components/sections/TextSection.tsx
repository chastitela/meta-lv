export default function TextSection({ content }: { content: string }) {
  return (
    <section className="prose max-w-3xl mx-auto py-12">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
}
