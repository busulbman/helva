export const siteConfig = {
  name: "Sipahioğlu Çekme Helva",
  description: "Osmanlı'dan günümüze geleneksel lezzet - El yapımı çekme helva",
  slogan: "Osmanlı'dan Günümüze Geleneksel Lezzet",

  // WhatsApp numarası (ülke kodu ile, boşluksuz)
  whatsappNumber: "905449792337",

  address: {
    street: "Nasrullah Camii karşısı, No: 11",
    city: "Kastamonu",
    postalCode: "37100",
    full: "Nasrullah Camii karşısı, No: 11, 37100 Kastamonu",
  },

  workingHours: {
    weekdays: "08:30 - 20:00",
    saturday: "08:30 - 20:00",
    sunday: "Kapalı",
    display: "Pazartesi - Cumartesi: 08:30 - 20:00",
  },

  social: {
    instagram: "https://instagram.com/sipahioglucekmehelva",
    facebook: "https://facebook.com/sipahioglucekmehelva",
  },

  // Google Maps embed URL - Nasrullah Camii Kastamonu
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2982.1234567890123!2d33.7758!3d41.3756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNasrullah+Camii!5e0!3m2!1str!2str!4v1234567890",
};

export const generateWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;
};

export const generateOrderMessage = (
  productName: string,
  quantity: number
): string => {
  return `Merhaba, ${productName} - ${quantity} adet sipariş etmek istiyorum.`;
};
