import 'dotenv/config';

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL não encontrada");
}

const adapter = new PrismaNeon({
    connectionString: DATABASE_URL
});

export const prisma = new PrismaClient({
    adapter
});














// import 'dotenv/config'
// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const DATABASE_URL = process.env.DATABASE_URL;

// if (!DATABASE_URL || typeof DATABASE_URL !== 'string') {
//   throw new Error(
//     "Missing/invalid DATABASE_URL in environment (.env). Add DATABASE_URL=..."
//   );
// }

// // console.log("DATABASE_URL:", DATABASE_URL);

// export const prisma = new PrismaClient({
//   adapter: new PrismaPg({ connectionString: DATABASE_URL }),
// });

