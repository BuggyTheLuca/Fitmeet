export function formatCpfMask(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 11);
    const parts = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);

    if (!parts) return digits;

    const [, p1, p2, p3, p4] = parts;

    let formatted = p1;
    if (p2) formatted += '.' + p2;
    if (p3) formatted += '.' + p3;
    if (p4) formatted += '-' + p4;

    return formatted;
  }