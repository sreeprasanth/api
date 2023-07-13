import { PrismaClient, User } from "@prisma/client";
import { error } from "console";
import fastify, { FastifyInstance, FastifyPluginOptions } from "fastify";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "doyle.gutkowski@ethereal.email",
    pass: "ecXwRXbeX5sPSaCBbj",
  },
});

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.post("/users", async (request: any, reply: any) => {
    // Set CORS headers
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "POST");
    reply.header("Access-Control-Allow-Headers", "Content-Type");
    try {
      const reqData: User = <User>request.body;
      const createRecord = await prisma.user.create({
        data: {
          ...reqData,
        },
      });
      const toEmail = createRecord.email;
      // / Send email
      const mailOptions = {
        from: "doyle.gutkowski@ethereal.email",
        bcc: "doyle.gutkowski@ethereal.email",
        to: toEmail,
        subject: "New User Created",
        text: `A new user with the name ${reqData.name} has been created .`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error occurred while sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
      // const users = await prisma.user.findMany();
      reply.send(createRecord);
    } catch {
      reply.send(error);
    }
  });
  fastify.post("/login", async (request, reply) => {
    // Set CORS headers
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "POST");
    reply.header("Access-Control-Allow-Headers", "Content-Type");
    try {
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

  fastify.post("/share", async (request: any, reply: any) => {
    // Set CORS headers
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "POST");
    reply.header("Access-Control-Allow-Headers", "Content-Type");
    try {
      const reqData: any = request.body;
      const Record = await prisma.user.findUnique({
        where: {
          email: reqData?.emailBy,
        },
      });
      const toEmail = reqData.email;
      console.log("880,,", Record);
      // / Send email
      const mailOptions = {
        from: "doyle.gutkowski@ethereal.email",
        bcc: "doyle.gutkowski@ethereal.email",
        to: toEmail,
        subject: "Password shared",
        text: `This is your email ${reqData?.emailBy} and this your password ${Record?.password} for login .`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error occurred while sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
      // const users = await prisma.user.findMany();
      reply.send("shared sucessfully");
    } catch {
      reply.send(error);
    }
  });
}
