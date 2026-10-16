// The clinic photos in the order the clinic chose - shown both in the
// Klinikánk "A rendelő" carousel and in the homepage "Bepillantás" carousel.
// Each photo's alt text is clinicPage.rooms.photos.<key>.
const CLOUDINARY = "https://res.cloudinary.com/dmwulp3dl/image/upload";

export const CLINIC_PHOTOS = [
  { key: "entrance", src: `${CLOUDINARY}/v1789381101/IMG_3396_vw5kcw.webp` },
  { key: "waitingRoom", src: `${CLOUDINARY}/v1792169412/Alphadent_portfolio_0043_xx4jbj.webp` },
  { key: "panorama", src: `${CLOUDINARY}/v1792169411/pano_crop_uwb9so.webp` },
  { key: "stairwell", src: `${CLOUDINARY}/v1792169411/Alphadent_portfolio_0005_qn3dta.webp` },
  { key: "waitingArea", src: `${CLOUDINARY}/v1792169413/Alphadent_portfolio_0010_hwllsc.webp` },
  { key: "treatmentUnit", src: `${CLOUDINARY}/v1792169413/Alphadent_portfolio_0017_hsi2u8.webp` },
  { key: "treatmentRoom", src: `${CLOUDINARY}/v1792169413/Alphadent_portfolio_0019_daswiz.webp` },
  { key: "millingUnits", src: `${CLOUDINARY}/v1792169411/Alphadent_portfolio_0075_jjxlho.webp` },
  { key: "parking", src: `${CLOUDINARY}/v1792169413/Alphadent_portfolio_0107_tblmms.webp` },
  { key: "building", src: `${CLOUDINARY}/v1792169413/Alphadent_portfolio_0067_mzysg9.webp` },
] as const;
