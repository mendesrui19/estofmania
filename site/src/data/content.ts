export const company = {
  name: 'Estofmania',
  tagline: 'Limpeza e Higienização Profissional',
  description:
    'Excelência em higienização e impermeabilização profissional para estofos, tapetes e cortinados. Atendimento premium em Vila Nova de Famalicão e arredores.',
  phone: '',
  whatsapp: '351917914696',
  email: '',
  instagram: 'https://www.instagram.com/estofmania/',
  tiktok: 'https://www.tiktok.com/@estofmania',
  linktree: 'https://linktr.ee/estofmania.pt',
  googleReviewUrl:
    'https://www.google.com/search?q=Estofmania+Cr%C3%ADticas&hl=pt-PT#lkt=LocalPoiReviews',
  area: ['Vila Nova de Famalicão', 'Lousado', 'Trofa', 'Ribeirão', 'Barcelos', 'arredores'],
} as const

export const navLinks = [
  { href: '/#servicos', label: 'Serviços' },
  { href: '/#galeria', label: 'Galeria' },
  { href: '/#processo', label: 'Processo' },
  { href: '/#avaliacoes', label: 'Avaliações' },
  { href: '/#contacto', label: 'Contacto' },
] as const

export const services = [
  {
    id: 'estofos',
    title: 'Sofás e cadeiras',
    description:
      'Higienização profunda que remove manchas, odores e ácaros. Cores renovadas e frescura garantida para o seu lar.',
    image: '/premium/01_estofos.jpg',
    features: ['Remoção de manchas', 'Eliminação de odores', 'Produtos profissionais'],
  },
  {
    id: 'impermeabilizacao',
    title: 'Impermeabilização',
    description:
      'Proteção invisível contra líquidos e sujidade. Facilita a manutenção e prolonga a vida útil do estofado.',
    image: '/premium/02_estofos.jpg',
    features: ['Teste de repelência', 'Proteção duradoura', 'Ideal para famílias'],
  },
  {
    id: 'tapetes',
    title: 'Tapetes e carpetes',
    description:
      'Limpeza de manutenção ou profunda. Recolha e entrega ao domicílio para a sua comodidade.',
    image: '/premium/03_estofos.jpg',
    features: ['Recolha ao domicílio', 'Ácaros e bactérias', 'Textura renovada'],
  },
  {
    id: 'colchoes',
    title: 'Colchões',
    description:
      'Higienização que vai além do visível — ambiente mais saudável para dormir com tranquilidade.',
    image: '/premium/04_estofos.jpg',
    features: ['Higiene profunda', 'Ambiente saudável', 'Sem químicos agressivos'],
  },
  {
    id: 'cortinas',
    title: 'Cortinas e cortinados',
    description:
      'Cortinas lavadas, branquinhas e prontas a voltar ao lugar. Sensação de casa fresca e organizada.',
    image: '/premium/05_estofos.jpg',
    features: ['Lavagem profissional', 'Secagem controlada', 'Montagem incluída'],
  },
  {
    id: 'empresas',
    title: 'Empresas',
    description:
      'Higienização para gabinetes, estética e espaços comerciais. Produtos veganos e biodegradáveis.',
    image: '/premium/06_estofos.jpg',
    features: ['Atendimento B2B', 'Produtos eco', 'Horários flexíveis'],
  },
] as const

export const galleryImages = [
  {
    src: '/antes-depois/sofa-horizontal.png',
    alt: 'Antes e depois — higienização de sofá',
    category: 'estofos',
  },
  {
    src: '/antes-depois/sofa-vertical.png',
    alt: 'Antes e depois — estofos como novos',
    category: 'estofos',
  },
  {
    src: '/antes-depois/tapete.png',
    alt: 'Antes e depois — limpeza de tapete',
    category: 'tapetes',
  },
] as const

export const processSteps = [
  {
    step: '01',
    title: 'Orçamento grátis',
    description: 'Envie mensagem com fotos ou descreva o serviço. Respondemos com proposta sem compromisso.',
  },
  {
    step: '02',
    title: 'Agendamento',
    description: 'Marcamos a visita em Famalicão e arredores no horário que lhe for mais conveniente.',
  },
  {
    step: '03',
    title: 'Higienização',
    description: 'Extratora e aspirador profissional com técnica de extração e produtos Kärcher.',
  },
  {
    step: '04',
    title: 'Resultado',
    description: 'Estofos, tapetes e colchões como novos — ambiente mais saudável e acolhedor.',
  },
] as const

export const stats = [
  { value: '5.0', label: 'Satisfação dos clientes', suffix: '★' },
  { value: '156+', label: 'Projetos no Instagram' },
  { value: '100%', label: 'Orçamento grátis' },
  { value: '24h', label: 'Resposta rápida' },
] as const

export const benefits = [
  'Higiene profunda com equipamento profissional',
  'Eliminação de bactérias, ácaros e alergénios',
  'Produtos veganos e biodegradáveis',
  'Impermeabilização com teste de repelência',
  'Recolha e entrega de tapetes',
  'Famalicão, Lousado, Trofa e arredores',
] as const
