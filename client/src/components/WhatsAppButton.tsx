/**
 * WhatsApp floating action button
 * Fixed at bottom-right corner on all pages
 */
export function WhatsAppButton() {
  const phone = "8617373129234"; // WhatsApp format: no + or spaces
  const message = encodeURIComponent("Hi, I'd like to get a quote for my manufacturing project.");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-150 ease-out active:scale-95 hover:scale-105"
      style={{ backgroundColor: "#25D366" }}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8"
        fill="white"
        aria-hidden="true"
      >
        <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.63 4.674 1.826 6.695L2.667 29.333l6.82-1.789A13.27 13.27 0 0 0 16.003 29.333c7.366 0 13.33-5.97 13.33-13.333S23.369 2.667 16.003 2.667zm0 24.267a11.01 11.01 0 0 1-5.617-1.54l-.403-.24-4.047 1.062 1.08-3.944-.263-.416A10.97 10.97 0 0 1 5.001 16c0-6.069 4.933-11 11.002-11S27.005 9.931 27.005 16s-4.933 11-11.002 11zm6.04-8.23c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.524-.165-.745.165-.22.33-.855 1.073-1.048 1.293-.193.22-.386.248-.716.083-.33-.165-1.394-.514-2.655-1.638-.982-.875-1.645-1.956-1.838-2.286-.193-.33-.02-.508.145-.672.15-.148.33-.386.496-.579.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.579-.083-.165-.745-1.797-1.02-2.46-.27-.647-.544-.56-.745-.57l-.634-.011c-.22 0-.579.083-.882.413-.303.33-1.158 1.132-1.158 2.76s1.186 3.202 1.351 3.422c.165.22 2.334 3.563 5.657 4.995.79.34 1.407.544 1.888.697.793.252 1.515.216 2.086.131.636-.095 1.953-.799 2.228-1.57.275-.771.275-1.432.193-1.57-.083-.138-.303-.22-.634-.386z" />
      </svg>
    </a>
  );
}
