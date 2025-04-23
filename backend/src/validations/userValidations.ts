import { z } from "zod";

const cpfValidator = z.string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF deve estar no formato XXX.XXX.XXX-XX' })
  .refine((cpf) => {
    return validateCPF(cpf);
  }, {
    message: 'CPF inválido',
  });
  
function validateCPF(cpf: string): boolean {

    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11) return false;
  
    let sum = 0;
    let remainder;
  
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
  
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
  
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
  
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
  
    return true;
}

export const validateRegister = z.object({
    name: z.string().trim().nonempty(),
    email: z.string().email(),
    cpf: cpfValidator,
    password: z.string().min(6).max(32)
})