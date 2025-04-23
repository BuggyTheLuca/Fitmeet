import { describe, expect, it, jest, test } from '@jest/globals';
import request from "supertest";
import express, { json } from 'express';
import authRoutes from '../routes/auth-routes';
import bcrypt from 'bcryptjs';

jest.mock("../repositories/user-repository", () => ({
    getByEmail: (email: string) =>
        email === "teste@gmail.com"
        ? {
            name: "Igor",
            email: "teste@gmail.com",
            password: bcrypt.hash("12345678", 10),
            cpf: '836.571.390-01',
            id: "123",
            avatar: "avatar.jpg",
            xp: 0,
            level: 1,
            deletedAt: null,
            achievements: []
            }
        : null,
    findByEmailOrCpf: (email: string, cpf: string) => {
        if (email === "joao@email.com" || cpf === "596.219.000-93") {
            return {
                name: "João Silva",
                email: "joao@email.com",
                cpf: "596.219.000-93",
                password: "senha123"
            };
        }
        return null;
    },
    create: (data: {
      name: string,
      email: string,
      cpf: string,
      password: string
    }) => Promise.resolve({
        id: "123",
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        password: data.password,
        xp: 0,
        level: 1,
        deletedAt: null,
        achievements: []
    })
}));
  
jest.mock("bcryptjs", () => ({
    compare: (password: string) => password === "12345678",
    hash: () => "abcd",
}));

jest.mock("jsonwebtoken", () => ({
    sign: () => "abcd",
}));

const server = express();
server.use(json());
authRoutes(server)

describe("Auth Routes", () => {
  describe("POST /auth/register", () => {
      test("Deve cadastrar um usuário e retornar 201", async () => {
        const response = await request(server)
          .post("/auth/register")
          .send({
            "name": "João Silva",
            "email": "joao7@email.com",
            "cpf": "057.112.251-54",
            "password": "senha123"
          });
    
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Usuário criado com sucesso.");
      });
    
      test("Deve retornar 400 se algum campo obrigatório estiver faltando", async () => {
        const response = await request(server)
          .post("/auth/register")
          .send({
            email: "joao@email.com",
            cpf: "596.219.000-93",
            password: "senha123",
          });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Informe os campos obrigatórios corretamente.");
      });

      test("Deve retornar 400 se o cpf não estiver no formato correto", async () => {
        const response = await request(server)
          .post("/auth/register")
          .send({
            email: "joao@email.com",
            cpf: "59621900093",
            password: "senha123",
          });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Informe os campos obrigatórios corretamente.");
      });
    
      test("Deve retornar 409 se o e-mail ou CPF já estiver cadastrado", async () => {
        const response = await request(server)
          .post("/auth/register")
          .send({
            name: "João Silva",
            email: "joao@email.com",
            cpf: "596.219.000-93",
            password: "senha123",
          });
    
        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty("error", "O e-mail ou CPF informado já pertence a outro usuário.");
      });
    });
})