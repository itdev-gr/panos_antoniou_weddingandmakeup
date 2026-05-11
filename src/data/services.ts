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

const fullPlanningIncludes = [
  "Continuous communication with the couple",
  "Wedding planning guidance & consultation",
  "Venue scouting & vendor recommendations",
  "Vendor management & booking assistance",
  "Budget management",
  "Wedding day coordination",
  "Vendors timetable & scheduling management",
];

export const planningServices = {
  fullPlanning: [
    {
      name: "Intimate Weddings (up to 30 guests)",
      price: "€2,000",
      startingFrom: true,
      includes: fullPlanningIncludes,
    },
    {
      name: "Grand Celebrations (up to 100 guests)",
      price: "€4,500",
      startingFrom: true,
      includes: fullPlanningIncludes,
    },
  ],
  elopements: [
    {
      name: "Essential Elopement Package",
      price: "€7,700",
      includes: [
        "Planning",
        "Venue",
        "Dinner",
        "Arch setup",
        "Celebrant",
        "Wedding cake",
        "Photographer & Videography",
        "Flowers & candles",
        "Bridal Hair & Makeup",
        "Transportation",
      ],
    },
    {
      name: "Premium Elopement Experience",
      price: "€9,700",
      includes: [
        "Planning",
        "Venue",
        "Dinner",
        "Premium floral & decoration setup",
        "Celebrant",
        "Wedding cake",
        "Photographer & Videography",
        "Flowers & candles",
        "Bridal Hair & Makeup",
        "Transportation",
      ],
    },
  ],
  proposals: [
    {
      name: "Proposal Essential",
      price: "€4,500",
      includes: [
        "Secret & discreet planning",
        "Venue",
        "Letters setup",
        "Heart arch, flowers & candles",
        "Photographer & Videography",
        "Transportation",
      ],
    },
    {
      name: "Luxury Proposal Design",
      price: "€6,900",
      includes: [
        "Secret & discreet planning",
        "Venue",
        "Letters setup",
        "Heart arch, flowers & candles",
        "Photographer & Videography",
        "Transportation",
        "Fireworks",
        "Private dinner setup",
      ],
    },
  ],
  sailingExperience: [
    {
      name: "Sailing Experience",
      price: "€6,900",
      includes: [
        "Secret & discreet planning",
        "Private yacht (5 hours)",
        "Photographer & Videography",
        "Dinner",
        "Champagne",
        "Transportation",
        "Flowers & décor",
      ],
    },
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

export const additionalBridalServices = [
  {
    name: "Photoshoot",
    price: "€350",
    description:
      "For Flying Dress photoshoots, proposals, pre or next-day, and fashion sessions.",
    details: [
      { label: "Just Makeup", price: "€160" },
      { label: "Just Hair", price: "€160" },
    ],
    note: "1.5 hrs for both services",
  },
  {
    name: "Light & Simple",
    price: "€250",
    description:
      "Natural-glow makeup with soft waves or a sleek bun.",
    note: "1 hr for both services",
  },
  {
    name: "Groom's Party",
    price: "€150",
    description: "Grooming and styling for the groom's side.",
    details: [
      { label: "Traditional Razor Shave", price: "+€100" },
      { label: "Executive Haircut & Finishing", price: "+€100" },
    ],
  },
];

export const sameSexWeddingPackages = [
  {
    name: "Double Bridal Glow",
    price: "€1,000",
    id: "double-bridal-glow",
    description:
      "A coordinated beauty experience for two brides, ensuring a harmonious and high-end aesthetic for your wedding gallery.",
    details: [
      { label: "Full Bridal Harmony Look (Hair & Makeup for both brides)", price: "€1,000" },
      { label: "Coordinated Styling (Hair or Makeup only)", price: "€250" },
    ],
    features: ["On-site luxury service", "2 artists"],
    note: "3.5 hrs for both brides",
  },
  {
    name: "Groomed & Polished",
    price: "€300",
    id: "groomed-and-polished",
    description:
      "Expert grooming for the groom duo. Tailored services to ensure a sharp, sophisticated, and camera-ready look.",
    details: [
      { label: "Double Grooming & Styling (skincare, hair styling & light touch-ups for both)", price: "€300" },
      { label: "The Sharp Duo (executive haircut & beard grooming for both)", price: "+€180" },
    ],
    features: ["High-definition, camera-ready finish", "2 artists"],
    note: "2.5 hrs for both grooms",
  },
];

export const locations = [
  "Santorini",
  "Mykonos",
  "Athens",
  "Greece",
  "Worldwide",
];
