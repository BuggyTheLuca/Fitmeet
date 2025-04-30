export function verifyEmail(email: string): boolean {
    return email.length > 0 && email.includes('@') && email.includes('.');
}