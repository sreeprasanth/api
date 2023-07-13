import { PrismaClient, User } from "@prisma/client";
import fastify, { FastifyInstance, FastifyPluginOptions } from "fastify";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.post("/login", async (request, reply) => {
    try {
      // const { username, password } = request.body;
      const reqData: any = request.body;

      const users = await prisma.user.findFirst({
        where: {
          email: reqData?.email,
        },
      });

      if (users?.password != reqData.password) {
        throw new Error("Invalid username or password");
      }
      const secretKey: any = process.env.SECRET_KEY;

      const token = jwt.sign(users?.email as any, secretKey);

      reply.send({ token });
    } catch (error) {
      console.error(error);
      reply.code(401).send({ error: "Invalid username or password" });
    }
  });
}
