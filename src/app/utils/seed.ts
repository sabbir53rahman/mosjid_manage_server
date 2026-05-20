// import { envVars } from "../../config/env";
// import { Role } from "../../generated/prisma/enums";
// import { prisma } from "../lib/prisma";
// import bcrypt from "bcryptjs";

// export const seedSuperAdmin = async () => {
//   try {
//     const isAdminExist = await prisma.user.findFirst({
//       where: {
//         role: Role.SUPER_ADMIN,
//       },
//     });

//     if (isAdminExist) {
//       console.log("Super admin already exists. Skipping seeding super admin.");
//       return;
//     }

//     // Create a default mosque for the super admin
//     let defaultMosque = await prisma.mosque.findUnique({
//       where: { slug: "default-mosque" },
//     });

//     if (!defaultMosque) {
//       defaultMosque = await prisma.mosque.create({
//         data: {
//           name: "Default Mosque",
//           slug: "default-mosque",
//           address: "Default Address",
//           owner: {
//             connect: {
//               email: envVars.SUPER_ADMIN_EMAIL,
//             },
//           },
//         },
//       });
//     }

//     const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, 12);

//     await prisma.user.create({
//       data: {
//         email: envVars.SUPER_ADMIN_EMAIL,
//         password: hashedPassword,
//         phone: 1234567890,
//         name: "Super Admin",
//         role: Role.SUPER_ADMIN,
//       },
//     });

//     console.log("Super Admin Created successfully");
//   } catch (error) {
//     console.error("Error seeding super admin: ", error);
//   }
// };
