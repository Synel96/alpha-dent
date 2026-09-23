import { describe, it, expect } from "vitest";
import { cloudinaryUrl, cloudinarySrcSet } from "../../lib/cloudinary";

const BASE = "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg";

describe("cloudinaryUrl", () => {
  it("szélesség nélkül csak minőség/formátum transzformációt told be", () => {
    expect(cloudinaryUrl(BASE)).toBe(
      "https://res.cloudinary.com/demo/image/upload/q_78,f_auto/v1/sample.jpg"
    );
  });

  it("szélességgel méretezési transzformációkat is told be", () => {
    expect(cloudinaryUrl(BASE, { width: 400 })).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_400,c_fill,g_auto,q_78,f_auto/v1/sample.jpg"
    );
  });

  it("egyéni crop/gravity/quality/format értékeket alkalmaz", () => {
    expect(
      cloudinaryUrl(BASE, { width: 200, crop: "thumb", gravity: "face", quality: 80, format: "webp" })
    ).toBe("https://res.cloudinary.com/demo/image/upload/w_200,c_thumb,g_face,q_80,f_webp/v1/sample.jpg");
  });

  it("nem Cloudinary URL-t változatlanul hagy", () => {
    const plain = "https://example.com/image.jpg";
    expect(cloudinaryUrl(plain, { width: 400 })).toBe(plain);
  });
});

describe("cloudinarySrcSet", () => {
  it("minden szélességhez egy bejegyzést generál 'url Nw' formátumban", () => {
    const srcSet = cloudinarySrcSet(BASE, [400, 800]);
    expect(srcSet).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_400,c_fill,g_auto,q_78,f_auto/v1/sample.jpg 400w, " +
        "https://res.cloudinary.com/demo/image/upload/w_800,c_fill,g_auto,q_78,f_auto/v1/sample.jpg 800w"
    );
  });

  it("nem Cloudinary URL esetén undefined-ot ad (nincs kitalált srcSet)", () => {
    expect(cloudinarySrcSet("https://example.com/image.jpg", [400, 800])).toBeUndefined();
  });
});
