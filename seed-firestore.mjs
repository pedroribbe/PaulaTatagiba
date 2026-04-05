import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey:            "AIzaSyBo0HJWT_OMe6SkBIcQ0gmHoym-I8wDpyw",
  authDomain:        "tatagiba-arquitetura.firebaseapp.com",
  projectId:         "tatagiba-arquitetura",
  storageBucket:     "tatagiba-arquitetura.firebasestorage.app",
  messagingSenderId: "649936737333",
  appId:             "1:649936737333:web:661bae2f86310a8c128d7c",
});

const db = getFirestore(app);

const content = {
  geral: { logo: "" },
  home: {
    foto_capa: "https://res.cloudinary.com/dn2dwljgy/image/upload/v1775066045/dyg82iio6hlorzzrz1sc.jpg",
    manifesto_titulo: "Desenhamos espaços onde a matéria e a luz dialogam com a essência humana.",
    manifesto_texto: "Com base no Rio de Janeiro, o escritório Tatagiba foca na criação de projetos residenciais e comerciais que prezam pela simplicidade formal e riqueza sensorial.",
    foto_atelier: "https://res.cloudinary.com/dn2dwljgy/image/upload/v1775056077/tw4eiyqviqnzei67qzbn.jpg",
    expertise: [
      { numero: "01", titulo: "Arquitetura Residencial", texto: "Projetos únicos que traduzem o estilo de vida e os sonhos de cada família em espaços atemporais." },
      { numero: "02", titulo: "Design de Interiores",   texto: "Curadoria de mobiliário e texturas que proporcionam conforto tátil e equilíbrio visual." },
      { numero: "03", titulo: "Gestão de Obras",        texto: "Acompanhamento técnico rigoroso para garantir que a execução seja fiel ao conceito projetado." },
    ],
  },
  sobre: {
    fotos: ["https://drive.google.com/thumbnail?id=169NepWDbGgwW5Tr2UC0y4FD0_vmGozo9&sz=w1200"],
    foto_fundo: "",
    valores: [
      { titulo: "Curadoria Técnica",  texto: "Cada material é escolhido por sua textura e durabilidade, garantindo que a estética envelheça com dignidade." },
      { titulo: "Luz como Estrutura", texto: "Trabalhamos a iluminação natural como um elemento construtivo fundamental para o bem-estar dos moradores." },
      { titulo: "Naturalismo Moderno",texto: "Integração entre o ambiente construído e o orgânico, criando harmonia entre interior e exterior." },
    ],
    destaque_titulo: "Onde a estética encontra a função primordial.",
    destaque_texto: "Projetamos para além do visual. Projetamos para o toque, para o silêncio e para o convívio. Cada linha traçada em nosso estúdio reflete um compromisso com a longevidade arquitetônica.",
    bio_p1: "Acreditamos que o espaço que habitamos é uma extensão silenciosa de quem somos. Na Tatagiba Arquitetura, cada projeto nasce de um diálogo profundo entre a técnica rigorosa e a sensibilidade estética.",
    bio_p2: "Formada com o olhar voltado para o detalhe e a funcionalidade, busco transformar concreto e luz em experiências de refúgio. Minha trajetória é marcada pela busca incessante por materiais naturais e soluções que respeitem a cronologia do tempo.",
  },
  contato: {
    mostrar_endereco: false,
    endereco: "Avenida Alfredo Balthazar da Silveira, 419",
    telefone: "+5521997250979",
    email: "contato@tatagiba.arq.br",
    instagram: "@tatagiba.arquitetura",
  },
};

const projects = {
  projects: [
    { id: "casa-itanhanga",    name: "Casa Itanhangá",     category: "residencial", featured: true,  image: "https://drive.google.com/thumbnail?id=1yJPPlP788iVbGcl3BvPLYFAgHZN9Nbxr&sz=w1600", images: ["https://drive.google.com/thumbnail?id=1yJPPlP788iVbGcl3BvPLYFAgHZN9Nbxr&sz=w1600"] },
    { id: "apartamento-fw",    name: "Apartamento FW",     category: "residencial", featured: true,  image: "https://drive.google.com/thumbnail?id=1L9p9rG8YcHt99bOGWn1jnT6vjP_vtYOJ&sz=w1600", images: ["https://drive.google.com/thumbnail?id=1L9p9rG8YcHt99bOGWn1jnT6vjP_vtYOJ&sz=w1600"] },
    { id: "consultorio-nf",    name: "Consultório NF",     category: "comercial",   featured: true,  image: "https://drive.google.com/thumbnail?id=1aAObwz1CJJUqWKns5vLZbrlZ0LbBWBrz&sz=w1600", images: ["https://drive.google.com/thumbnail?id=1aAObwz1CJJUqWKns5vLZbrlZ0LbBWBrz&sz=w1600", "https://res.cloudinary.com/dn2dwljgy/image/upload/v1775055917/dvawqvhow71hkqauijiq.jpg"] },
    { id: "quarto-ana-carolina",name: "Quarto Ana Carolina",category: "infantil",   featured: true,  image: "https://drive.google.com/thumbnail?id=1mamlEmAUupVVHlc-OgZ4Pnuzm8QO-1Z4&sz=w1600", images: ["https://drive.google.com/thumbnail?id=1mamlEmAUupVVHlc-OgZ4Pnuzm8QO-1Z4&sz=w1600"] },
    { id: "quarto-leticia",    name: "Quarto Letícia",     category: "infantil",   featured: false, image: "https://drive.google.com/thumbnail?id=1y6ZdAoqK77tYGJzA3eUVLp6hiIknwety&sz=w1600", images: ["https://drive.google.com/thumbnail?id=1y6ZdAoqK77tYGJzA3eUVLp6hiIknwety&sz=w1600"] },
    { id: "quarto-maite",      name: "Quarto Maitê",       category: "infantil",   featured: false, image: "https://drive.google.com/thumbnail?id=198PUVlO7p6LYFwBxDP5GVGn0JQu6MvQm&sz=w1600", images: ["https://drive.google.com/thumbnail?id=198PUVlO7p6LYFwBxDP5GVGn0JQu6MvQm&sz=w1600"] },
    { id: "apartamento-jl",    name: "Apartamento JL",     category: "residencial", featured: false, image: "https://drive.google.com/thumbnail?id=1v8ang4M2Zu0-xe0TKCnqnmozVV5gOT7g&sz=w1600", images: ["https://drive.google.com/thumbnail?id=1v8ang4M2Zu0-xe0TKCnqnmozVV5gOT7g&sz=w1600"] },
    { id: "apartamento-me",    name: "Apartamento ME",     category: "residencial", featured: false, image: "https://drive.google.com/thumbnail?id=1Ov8oBRD3kNxAlNOjq-QL1IBuuvgoMFTc&sz=w1600", images: ["https://drive.google.com/thumbnail?id=1Ov8oBRD3kNxAlNOjq-QL1IBuuvgoMFTc&sz=w1600"] },
    { id: "quarto-luisa",      name: "Quarto Luísa",       category: "infantil",   featured: false, image: "https://drive.google.com/thumbnail?id=1y4kT_YV2IzlGACSIPqd3ho1s4fO_o7UU&sz=w1600", images: ["https://drive.google.com/thumbnail?id=1y4kT_YV2IzlGACSIPqd3ho1s4fO_o7UU&sz=w1600"] },
  ],
};

await setDoc(doc(db, 'settings', 'content'),  content);
await setDoc(doc(db, 'settings', 'projects'), projects);

console.log('✓ Firestore populado com sucesso!');
process.exit(0);
