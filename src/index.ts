// // import dotenv from "dotenv";
// // import path from "path";
// // import fastify from "fastify";
// // import users from "./routes/users";

// // dotenv.config();

// // export async function createServer() {
// //   const server = fastify({
// //     logger: {
// //       level: process.env.LOG_LEVEL,
// //     },
// //     ignoreTrailingSlash: true,
// //     pluginTimeout: 10000,
// //   });
// //   await server.register(users);
// //   await server.ready();
// //   return server;
// // }

// // export async function startServer() {
// //   process.on("unhandledRejection", (err) => {
// //     console.error(err);
// //     process.exit(1);
// //   });

// //   const server: any = await createServer();
// //   await server.listen(process.env.API_PORT, process.env.API_HOST);

// //   if (process.env.NODE_ENV === "production") {
// //     for (const signal of ["SIGINT", "SIGTERM"]) {
// //       process.on(signal, () =>
// //         server.close().then((err: any) => {
// //           console.log(`close application on ${signal}`);
// //           process.exit(err ? 1 : 0);
// //         })
// //       );
// //     }
// //   }
// // }

// // if (process.env.NODE_ENV !== "test") {
// //   console.log("NODE ENVIRONMENT: ", process.env.NODE_ENV);
// //   startServer();
// // }

// import dotenv from "dotenv";
// import path, { dirname } from "path";
// import fastify from "fastify";
// import users from "./routes/users";
// import { PrismaClient, User } from "@prisma/client";

// const prisma = new PrismaClient();

// dotenv.config();

// export async function createServer() {
//   const server = fastify({
//     logger: {
//       level: process.env.LOG_LEVEL,
//     },
//     ignoreTrailingSlash: true,
//     pluginTimeout: 10000,
//   });

//   // await server.register(users);

//   server.route({
//     method: ["OPTIONS", "POST"],
//     url: "/users",
//     handler: async (request, reply) => {
//       // Set CORS headers for OPTIONS request
//       reply.header("Access-Control-Allow-Origin", "*");
//       reply.header("Access-Control-Allow-Methods", "POST");
//       reply.header("Access-Control-Allow-Headers", "Content-Type");
//       console.log("9000...", request.body);
//       const reqData: any = request.body;
//       const createRecord = await prisma.user.create({
//         data: {
//           email: reqData.email,
//           name: reqData.name,
//           password: reqData.password,
//         },
//       });

//       console.log("9001", reqData);
//     },
//   });

//   await server.ready();
//   return server;
// }

// export async function startServer() {
//   process.on("unhandledRejection", (err) => {
//     console.error(err);
//     process.exit(1);
//   });

//   const server: any = await createServer();

//   server.listen(
//     process.env.API_PORT,
//     process.env.API_HOST,
//     (err: any, address: any) => {
//       if (err) {
//         console.error(err);
//         process.exit(1);
//       }
//       console.log(`Server listening at ${address}`);
//     }
//   );

//   if (process.env.NODE_ENV === "production") {
//     for (const signal of ["SIGINT", "SIGTERM"]) {
//       process.on(signal, () =>
//         server.close().then((err: any) => {
//           console.log(`Close application on ${signal}`);
//           process.exit(err ? 1 : 0);
//         })
//       );
//     }
//   }
// }

// if (process.env.NODE_ENV !== "test") {
//   console.log("NODE ENVIRONMENT:", process.env.NODE_ENV);
//   startServer();
// }
import dotenv from "dotenv";
import path from "path";
import fastify from "fastify";
import users from "./routes/users";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

export async function createServer() {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
    ignoreTrailingSlash: true,
    pluginTimeout: 10000,
  });

  // await server.register(users);
  //to handle cors
  server.addHook("onRequest", (request, reply, done) => {
    // Set CORS headers
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "POST");
    reply.header("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      // Handle OPTIONS preflight request
      reply.send();
    } else {
      // Continue to the route handler
      done();
    }
  });
  await server.register(users);

  await server.ready();
  return server;
}

export async function startServer() {
  process.on("unhandledRejection", (err) => {
    console.error(err);
    process.exit(1);
  });

  const server: any = await createServer();

  server.listen(
    process.env.API_PORT,
    process.env.API_HOST,
    (err: any, address: any) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    }
  );

  if (process.env.NODE_ENV === "production") {
    for (const signal of ["SIGINT", "SIGTERM"]) {
      process.on(signal, () =>
        server.close().then((err: any) => {
          console.log(`Close application on ${signal}`);
          process.exit(err ? 1 : 0);
        })
      );
    }
  }
}

if (process.env.NODE_ENV !== "test") {
  console.log("NODE ENVIRONMENT:", process.env.NODE_ENV);
  startServer();
}
