const videos = [
  { id: "dQw4w9WgXcQ", title: "Cloud Build — How We Work" },
];

export default function VideosSection() {
  return (
    <section className="py-20 lg:py-28 section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Watch Us Work</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2">See Cloud Build In Action</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {videos.map((v) => (
            <div key={v.id} className="fade-up rounded-lg overflow-hidden border border-border bg-background card-hover">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="font-heading font-semibold text-sm">{v.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
