const mongoose = require("mongoose")

const portfolioData = [
  {
    slug: "tensile-canopy-structures",
    title: "Tensile Canopy Structures",
    hero_heading: "Durable Tensile Canopies for Every Space",
    hero_subheading: "Modern shade solutions that combine sculptural beauty with unbeatable functionality.",
    introduction:
      "A tensile canopy is more than just a roof – it's architecture in motion. Light and flexible, our custom canopies seem to float above your outdoor areas, filtering sunlight and rain alike. Engineered with state-of-the-art tensioned fabric, each canopy curves and sweeps to create drama while protecting the space below.",
    why_choose:
      "With decades of shade-crafting experience, we ensure each canopy is precision-engineered and installed. From initial design to final tensioning, our team treats your project as an architectural statement. The result: a tensile canopy that's as durable as it is beautiful.",
    cta: "Get started – request a free canopy design consultation today.",
    features: [
      {
        title: "Sleek Aesthetics",
        description:
          "Crafted from premium fabrics and slender supports, our canopies lend a contemporary, gallery-like look to gardens, patios, and courtyards.",
      },
      {
        title: "Large Coverage",
        description:
          "Despite their airy appearance, tensile canopies can span wide areas with minimal supports. This means a single sweeping canopy can shade your entire pool deck or backyard lounge without bulky pillars.",
      },
      {
        title: "Lightweight Strength",
        description:
          "The fabrics we use are engineered to block up to 100% of harmful UV rays while staying surprisingly lightweight. High-end tensile materials can filter the sun's heat yet allow natural daylight to glow through.",
      },
      {
        title: "Custom Curves",
        description:
          "Every canopy is custom-designed. Your La Fabrica expert will sketch a form tailored to your site – whether that's a gentle sail-like curve, a bold asymmetry, or multiple intersecting panels.",
      },
    ],
    images: [
      {
        url: "/placeholder.svg?height=800&width=1200",
        alt: "Modern tensile canopy structure",
        title: "Tensile Canopy",
        order: 0,
      },
      {
        url: "/placeholder.svg?height=600&width=800",
        alt: "Tensile canopy over outdoor patio",
        title: "Patio Canopy",
        order: 1,
      },
      {
        url: "/placeholder.svg?height=600&width=800",
        alt: "Tensile canopy over pool deck",
        title: "Pool Deck Canopy",
        order: 2,
      },
    ],
  },
  {
    slug: "window-awning-design",
    title: "Window Awning Design",
    hero_heading: "Window Awnings: Style Meets Comfort",
    hero_subheading: "Add charm to your façade while protecting interiors from glare.",
    introduction:
      "Our handcrafted window awnings turn ordinary windows into focal points. Choose from graceful dome shapes, sleek flat profiles, or artisan scalloped edges to reflect your style. Each awning frames the view outside while shielding you from afternoon sun. On hot days, an awning can keep your rooms cooler – studies show this can cut indoor temperatures by up to 15°F – reducing air-conditioning needs and energy costs.",
    why_choose:
      "Every awning is built on a sturdy steel frame with marine-grade canvas or PVC fabric. Automated mechanisms ensure smooth retractability. This meticulous craftsmanship delivers an awning that looks beautiful and performs flawlessly for years.",
    cta: "Transform your windows – contact us for a custom awning quote.",
    features: [
      {
        title: "UV Protection",
        description:
          "Premium acrylic fabrics block harmful UV and prevent furniture fading. You can enjoy natural daylight filtering in, but not the heat or glare.",
      },
      {
        title: "Year-round Comfort",
        description:
          "Retractable or fixed, our awnings extend your outdoor season. On sunny spring mornings they welcome light, and in blazing summer afternoons they let you enjoy shade.",
      },
      {
        title: "Branding & Beauty",
        description:
          "We can embroider logos or use bold colors to make your business stand out. On a home, awnings add a boutique-inspired elegance.",
      },
    ],
    images: [
      {
        url: "/placeholder.svg?height=800&width=1200",
        alt: "Modern window awning design",
        title: "Window Awning",
        order: 0,
      },
      {
        url: "/placeholder.svg?height=600&width=800",
        alt: "Window awning on storefront",
        title: "Storefront Awning",
        order: 1,
      },
    ],
  },
  {
    slug: "retractable-awnings",
    title: "Retractable Awnings",
    hero_heading: "Retractable Awnings: Flexibility & Function",
    hero_subheading: "Open or close your shade at a moment's notice.",
    introduction:
      "La Fabrica's retractable awnings bring the best of both worlds: expansive shade when you want it, and open sky when you don't. Designed for patios, decks and storefronts, they extend out smoothly on warm days and roll away at night or in rain. In summer, our retractable systems can keep indoor spaces up to 15°F cooler, making afternoons more pleasant for everyone.",
    why_choose:
      "When the awning glides out, your patio transforms: cool, dappled shade appears like magic. It's the perfect respite on a sunny afternoon or a romantic canopy for evening dining under the stars.",
    cta: "Experience the magic – request a retractable awning demo.",
    features: [
      {
        title: "Smart Control",
        description:
          "Motorized operation (with remote or wall switch) means one-button comfort. Optional sensors automatically retract the awning if it starts to rain or get windy.",
      },
      {
        title: "Durable Construction",
        description:
          "Built with heavy-duty aluminum arms and thick cassette housings, our awnings withstand daily use and tropical rain alike. We engineer them to last decades with minimal maintenance.",
      },
      {
        title: "Tailored Design",
        description:
          "Available in many shapes (flat, classic waterfall, or gabled), sizes, and hundreds of fabric patterns. Your awning can match corporate branding or home décor.",
      },
    ],
    images: [
      {
        url: "/placeholder.svg?height=800&width=1200",
        alt: "Retractable awning over patio",
        title: "Retractable Awning",
        order: 0,
      },
      {
        url: "/placeholder.svg?height=600&width=800",
        alt: "Retractable awning over deck",
        title: "Deck Awning",
        order: 1,
      },
    ],
  },
]

async function seedDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      throw new Error("Please define MONGODB_URI environment variable")
    }

    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    const PortfolioItemSchema = new mongoose.Schema({
      slug: String,
      title: String,
      hero_heading: String,
      hero_subheading: String,
      introduction: String,
      why_choose: String,
      cta: String,
      features: [
        {
          title: String,
          description: String,
        },
      ],
      images: [
        {
          url: String,
          alt: String,
          title: String,
          order: Number,
        },
      ],
    })

    const PortfolioItem = mongoose.models.PortfolioItem || mongoose.model("PortfolioItem", PortfolioItemSchema)

    // Clear existing data
    await PortfolioItem.deleteMany({})
    console.log("Cleared existing portfolio items")

    // Insert seed data
    await PortfolioItem.insertMany(portfolioData)
    console.log(`Seeded ${portfolioData.length} portfolio items`)

    await mongoose.connection.close()
    console.log("Database connection closed")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
