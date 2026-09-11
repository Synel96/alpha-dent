import { Hero } from "../../components/ui/hero";

export { Page };

const HERO_IMAGE =
  "https://res.cloudinary.com/dmwulp3dl/image/upload/v1789138056/IMG_3392_faedmf.webp";

function Page() {
  return (
    <>
      <Hero imageSrc={HERO_IMAGE} imageAlt="Alphadent" />
      <section className="min-h-[calc(100vh-140px)]" />
    </>
  );
}
