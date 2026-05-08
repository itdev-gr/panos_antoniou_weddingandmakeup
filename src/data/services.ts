export const services = [
  {
    title: "Bridal Makeup & Hair",
    slug: "/services/bridal-beauty",
    description: "High-end beauty services signed by Panos Antoniou Wedding Makeup and Hair.",
    image: "/images/services/bridal-closeup.jpg",
    price: "Starting from €560",
  },
  {
    title: "Wedding Planning & Coordination",
    slug: "/services/wedding-planning",
    description: "From concept to execution, we design your wedding with precision and style.",
    image: "/images/services/ceremony-caldera.jpg",
    price: "Starting from €1,500",
  },
];

export const signatureServices = [
  {
    name: "Full Bridal Beauty (Makeup & Hair)",
    price: "€560",
    id: "full-bridal-beauty",
    includes: [
      "Facial massage & skin preparation",
      "Toners, moisturizers & serums",
      "Full coverage for chest, shoulders & back",
      "Premium false lashes",
      "Veil placement assistance",
    ],
  },
  { name: "Bridal Makeup Only", price: "€280" },
  { name: "Bridal Hair Only", price: "€290" },
  { name: "Bridal Trial (Makeup & Hair)", price: "€100" },
  {
    name: "Pre or Next-Day Styling",
    price: "€250",
    id: "pre-or-next-day-styling",
    priceNote:
      "Price applies when booked in combination with another bridal service. Otherwise, the price is €350.",
  },
  { name: "Flower Girls — under 9 years (per person)", price: "€80" },
  { name: "Flower Girls — 9 years and above (per person)", price: "€120" },
];

export const luxuryPackages = [
  {
    name: "The Intimate Bride",
    price: "€980",
    includes: "Bridal Makeup & Hair + 2 additional persons + Venue Touch-ups",
  },
  {
    name: "The Bridal Morning",
    price: "€1,140",
    includes: "Bridal Makeup & Hair + 3 additional persons + Venue Touch-ups",
  },
  {
    name: "The Bridal Party",
    price: "€1,280",
    includes: "Bridal Makeup & Hair + 4 additional persons + 1hr Group Venue Touch-ups",
  },
];

export const planningServices = {
  fullPlanning: [
    { name: "Intimate Weddings (up to 30 guests)", price: "€1,500" },
    { name: "Grand Celebrations (up to 100 guests)", price: "€3,500" },
  ],
  elopements: [
    { name: "Essential Elopement Package", price: "€1,200" },
    { name: "Premium Elopement Experience", price: "€1,800" },
    { name: "Luxury Elopement (with full styling & photography)", price: "€2,800" },
  ],
  proposals: [
    { name: "Proposal Essential", price: "€500" },
    { name: "Luxury Proposal Design", price: "€1,200" },
  ],
};

export const studioServices = [
  { name: "Private Bridal Preparation", price: "€450" },
  { name: "Bridal Boudoir Studio Use", price: "€60/hr" },
  { name: "Professional Makeup Lessons", price: "€150" },
];

export const bridesmaidServices = [
  {
    name: "Bridesmaids Makeup & Hair",
    price: "€200",
    details: [
      { label: "Makeup Only", price: "€110" },
      { label: "Hair Only", price: "€110" },
      { label: "Group of 3 (per person)", price: "€190" },
      { label: "Group of 4 (per person)", price: "€180" },
      { label: "Group of 5 or more (per person)", price: "€170" },
    ],
    note: "40 min per service",
  },
];

export const eventServices = [
  {
    name: "Event Make-up and Hair",
    price: "€160",
    description:
      "Professional makeup and hairstyling for any special occasion, tailored to your personal style.",
    details: [
      { label: "Makeup Only", price: "€90" },
      { label: "Hair Only", price: "€90" },
      { label: "Group of 3 (per person)", price: "€150" },
      { label: "Group of 4 (per person)", price: "€140" },
      { label: "Group of 5 or more (per person)", price: "€130" },
    ],
    note: "40 min per service",
  },
];

export const locations = [
  "Santorini",
  "Mykonos",
  "Athens",
  "Greece",
  "Worldwide",
];
