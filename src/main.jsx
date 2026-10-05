function SaleBanner() {
  const slides = [
    "/hero-1.png",
    "/hero-2.png",
    "/hero-3.png",
    "/hero-4.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 2000);

    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="sale-banner"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1536 / 235",
        height: "auto",
        minHeight: "0",
        maxHeight: "235px",
        overflow: "hidden",
        background: "#fff",
        padding: 0,
        margin: 0,
        lineHeight: 0,
      }}
    >
      <img
        src={slides[current]}
        alt="Flikart Mega Sale"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          objectPosition: "center",
          margin: 0,
          padding: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8px",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px",
          zIndex: 5,
          lineHeight: 1,
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Show sale banner ${index + 1}`}
            style={{
              width: index === current ? "20px" : "7px",
              height: "7px",
              padding: 0,
              margin: 0,
              border: "none",
              borderRadius: "20px",
              background:
                index === current
                  ? "#ffffff"
                  : "rgba(255,255,255,0.55)",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
