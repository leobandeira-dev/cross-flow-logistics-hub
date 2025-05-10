
export const handleWhatsAppSupport = () => {
  // Número fictício para suporte via WhatsApp
  const phoneNumber = "5511912345678";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Olá,%20preciso%20de%20suporte%20com%20uma%20carga.`;
  window.open(whatsappUrl, '_blank');
};
