import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Password123!";

async function main() {
  const existing = await prisma.user.count();
  if (existing > 0) {
    console.log(`Seed skipped: ${existing} users already exist.`);
    return;
  }

  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const managers = await Promise.all(
    ["Nadia Petrova", "Marcus Lee"].map((name, i) =>
      prisma.user.create({
        data: {
          email: `manager${i + 1}@n5deal.com`,
          passwordHash,
          role: "MANAGER",
          name,
          company: "N5Deal",
        },
      })
    )
  );

  const sellerSeed = [
    { name: "Elena Volkova", company: "Volkova Capital Advisors" },
    { name: "Tom Richardson", company: "Richardson & Co." },
    { name: "Yuki Tanaka", company: "Tanaka M&A Partners" },
    { name: "Priya Sharma", company: "Sharma Growth Equity" },
    { name: "Carlos Mendes", company: "Mendes Corporate Finance" },
  ];
  const sellers = await Promise.all(
    sellerSeed.map((s, i) =>
      prisma.user.create({
        data: {
          email: `seller${i + 1}@n5deal.com`,
          passwordHash,
          role: "SELLER",
          name: s.name,
          company: s.company,
        },
      })
    )
  );

  const assetSeed = [
    { sellerIdx: 0, title: "B2B SaaS Analytics Platform", sector: "TECHNOLOGY", region: "NORTH_AMERICA", dealSize: 4_500_000, revenue: 2_100_000, ebitda: 600_000, description: "Profitable vertical SaaS analytics company serving mid-market logistics firms, 90% net revenue retention, founder seeking full exit." },
    { sellerIdx: 0, title: "Cybersecurity Managed Services Firm", sector: "TECHNOLOGY", region: "EUROPE", dealSize: 8_200_000, revenue: 5_000_000, ebitda: 1_100_000, description: "MSSP with recurring contracts across EU financial services clients, strong compliance certifications." },
    { sellerIdx: 1, title: "Specialty Medical Device Manufacturer", sector: "HEALTHCARE", region: "NORTH_AMERICA", dealSize: 12_000_000, revenue: 9_000_000, ebitda: 2_300_000, description: "FDA-cleared orthopedic device maker, established distributor network, growing 18% YoY." },
    { sellerIdx: 1, title: "Outpatient Diagnostics Chain (6 sites)", sector: "HEALTHCARE", region: "NORTH_AMERICA", dealSize: 21_000_000, revenue: 15_500_000, ebitda: 3_800_000, description: "Regional diagnostics imaging network, long-term payer contracts, roll-up ready." },
    { sellerIdx: 2, title: "Precision CNC Machining Shop", sector: "MANUFACTURING", region: "APAC", dealSize: 6_300_000, revenue: 4_800_000, ebitda: 900_000, description: "Tier-2 automotive supplier, ISO 9001 certified, long-standing OEM relationships." },
    { sellerIdx: 2, title: "Industrial Packaging Producer", sector: "MANUFACTURING", region: "APAC", dealSize: 15_000_000, revenue: 12_000_000, ebitda: 2_600_000, description: "Sustainable packaging manufacturer, blue-chip FMCG client base." },
    { sellerIdx: 3, title: "Regional Insurance Brokerage", sector: "FINANCIAL_SERVICES", region: "EUROPE", dealSize: 9_500_000, revenue: 6_200_000, ebitda: 1_800_000, description: "Commercial lines brokerage with sticky SME client book, succession-driven sale." },
    { sellerIdx: 3, title: "Boutique Wealth Management Firm", sector: "FINANCIAL_SERVICES", region: "NORTH_AMERICA", dealSize: 18_000_000, revenue: 7_000_000, ebitda: 4_200_000, description: "$900M AUM RIA, high-net-worth focus, retiring founder." },
    { sellerIdx: 4, title: "Mixed-Use Commercial Property Portfolio", sector: "REAL_ESTATE", region: "LATAM", dealSize: 25_000_000, revenue: 3_100_000, ebitda: 2_400_000, description: "Stabilized retail + office portfolio across 3 growing metro markets." },
    { sellerIdx: 4, title: "Logistics & Cold Storage Warehousing", sector: "REAL_ESTATE", region: "LATAM", dealSize: 32_000_000, revenue: 4_500_000, ebitda: 3_600_000, description: "Class-A cold storage facilities leased to national grocery distributors." },
    { sellerIdx: 0, title: "Solar EPC & O&M Services Company", sector: "ENERGY", region: "EUROPE", dealSize: 11_000_000, revenue: 8_800_000, ebitda: 1_500_000, description: "Utility-scale solar installer with growing O&M recurring revenue base." },
    { sellerIdx: 1, title: "E-commerce D2C Home Goods Brand", sector: "RETAIL", region: "NORTH_AMERICA", dealSize: 5_400_000, revenue: 6_100_000, ebitda: 1_000_000, description: "Profitable Shopify-native brand, strong repeat purchase rate, 3PL fulfillment." },
    { sellerIdx: 2, title: "Specialty Grocery Retail Chain", sector: "RETAIL", region: "APAC", dealSize: 14_000_000, revenue: 22_000_000, ebitda: 2_000_000, description: "12-store premium grocery chain, loyal local customer base." },
    { sellerIdx: 3, title: "Data Center Colocation Provider", sector: "TECHNOLOGY", region: "GLOBAL", dealSize: 40_000_000, revenue: 18_000_000, ebitda: 7_500_000, description: "Tier III colocation facilities serving enterprise and cloud clients globally." },
    { sellerIdx: 4, title: "Renewable Biomass Energy Plant", sector: "ENERGY", region: "LATAM", dealSize: 27_000_000, revenue: 10_500_000, ebitda: 4_100_000, description: "Long-term PPA-backed biomass generation facility." },
    { sellerIdx: 4, title: "Legacy Print & Signage Business", sector: "OTHER", region: "NORTH_AMERICA", dealSize: 1_800_000, revenue: 2_400_000, ebitda: 350_000, description: "Established local print shop, owner retiring, stable but low-growth." },
  ] as const;

  const assets = await Promise.all(
    assetSeed.map((a) =>
      prisma.asset.create({
        data: {
          sellerId: sellers[a.sellerIdx].id,
          title: a.title,
          description: a.description,
          sector: a.sector,
          region: a.region,
          dealSize: a.dealSize,
          revenue: a.revenue,
          ebitda: a.ebitda,
        },
      })
    )
  );

  const buyerSeed = [
    { name: "Alex Kim", company: "Kim Family Office", thesis: "We acquire profitable B2B software and tech-enabled services businesses with $1-10M EBITDA, prioritizing sticky recurring revenue.", sectors: ["TECHNOLOGY"], regions: ["NORTH_AMERICA", "EUROPE"], min: 3_000_000, max: 9_000_000 },
    { name: "Sofia Rossi", company: "Rossi Healthcare Ventures", thesis: "Focused on lower middle-market healthcare providers and device makers with defensible regulatory moats.", sectors: ["HEALTHCARE"], regions: ["NORTH_AMERICA"], min: 8_000_000, max: 25_000_000 },
    { name: "Daniel Obi", company: "Obi Industrial Holdings", thesis: "Search fund targeting manufacturing and industrial businesses in Asia-Pacific with strong OEM relationships.", sectors: ["MANUFACTURING"], regions: ["APAC"], min: 4_000_000, max: 16_000_000 },
    { name: "Grace Chen", company: "Chen Capital Partners", thesis: "Growth equity investor in financial services distribution businesses (brokerages, RIAs, MGAs).", sectors: ["FINANCIAL_SERVICES"], regions: ["EUROPE", "NORTH_AMERICA"], min: 5_000_000, max: 20_000_000 },
    { name: "Miguel Santos", company: "Santos Real Assets", thesis: "Acquiring income-producing commercial and logistics real estate across Latin America.", sectors: ["REAL_ESTATE"], regions: ["LATAM"], min: 15_000_000, max: 40_000_000 },
    { name: "Isabelle Laurent", company: "Laurent Energy Transition Fund", thesis: "Investing in renewable generation and energy services companies with long-term contracted cash flows.", sectors: ["ENERGY"], regions: ["EUROPE", "LATAM", "GLOBAL"], min: 8_000_000, max: 30_000_000 },
    { name: "Ravi Patel", company: "Patel Consumer Holdings", thesis: "Buy-and-build platform for profitable D2C and specialty retail brands with loyal customer bases.", sectors: ["RETAIL"], regions: ["NORTH_AMERICA", "APAC"], min: 3_000_000, max: 15_000_000 },
    { name: "Hannah Wagner", company: "Wagner Diversified Capital", thesis: "Generalist independent sponsor, opportunistic across sectors, comfortable with smaller founder-led businesses.", sectors: ["TECHNOLOGY", "RETAIL", "OTHER"], regions: ["GLOBAL"], min: 1_000_000, max: 6_000_000 },
  ] as const;

  const buyers = await Promise.all(
    buyerSeed.map((b, i) =>
      prisma.user.create({
        data: {
          email: `buyer${i + 1}@n5deal.com`,
          passwordHash,
          role: "BUYER",
          name: b.name,
          company: b.company,
        },
      })
    )
  );

  await Promise.all(
    buyerSeed.map((b, i) =>
      prisma.buyerProfile.create({
        data: {
          userId: buyers[i].id,
          investmentThesis: b.thesis,
          ticketSizeMin: b.min,
          ticketSizeMax: b.max,
          sectors: { create: b.sectors.map((sector) => ({ sector })) },
          regions: { create: b.regions.map((region) => ({ region })) },
        },
      })
    )
  );

  // A couple of seeded conversations so the inbox isn't empty on first login.
  const conversation1 = await prisma.conversation.create({
    data: { buyerId: buyers[0].id, sellerId: sellers[0].id, assetId: assets[0].id },
  });
  await prisma.message.createMany({
    data: [
      { conversationId: conversation1.id, senderId: buyers[0].id, body: "Hi Elena, the SaaS analytics platform looks like a strong fit for our thesis. Could you share the CIM?" },
      { conversationId: conversation1.id, senderId: sellers[0].id, body: "Hi Alex, happy to. I'll send the CIM and last two years of financials over today." },
    ],
  });
  await prisma.conversation.update({ where: { id: conversation1.id }, data: { lastMessageAt: new Date() } });

  const conversation2 = await prisma.conversation.create({
    data: { buyerId: buyers[1].id, sellerId: sellers[1].id, assetId: assets[3].id },
  });
  await prisma.message.create({
    data: { conversationId: conversation2.id, senderId: buyers[1].id, body: "Interested in the diagnostics chain — can we set up a call this week?" },
  });

  // Demonstrate manager moderation on first login.
  await prisma.user.update({
    where: { id: buyers[buyers.length - 1].id },
    data: { status: "SUSPENDED", statusReason: "Unverified company information", statusChangedAt: new Date() },
  });
  await prisma.asset.update({
    where: { id: assets[assets.length - 1].id },
    data: { status: "SUSPENDED", statusReason: "Pending updated financials", statusChangedAt: new Date() },
  });

  console.log("Seed complete.");
  console.log(`Managers: ${managers.map((m) => m.email).join(", ")}`);
  console.log(`Sellers: ${sellers.map((s) => s.email).join(", ")}`);
  console.log(`Buyers: ${buyers.map((b) => b.email).join(", ")}`);
  console.log(`Demo password for all accounts: ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
