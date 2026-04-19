import "./config";
import { prisma } from "./prisma";

async function main() {
  const statuses = ["OPEN", "IN_PROGRESS", "CLOSED"];
  const issues = Array.from({ length: 10000 }, (_, i) => ({
    title: "Issue " + (i + 1),
    description: "Description for issue " + (i + 1),
    status: statuses[Math.floor(Math.random() * 3)],
  }));

  await prisma.issue.createMany({ data: issues });
  console.log("Seeded 10,000 issues");
  await prisma.$disconnect();
}

main();