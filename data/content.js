// Sistema de armazenamento de conteúdo padronizado com persistência
const STORAGE_KEY = "ascamarea_blog_content"

// Dados iniciais (serão carregados do localStorage se existirem)
const blogContent = {
  articles: [
    {
      id: "reciclagem-importancia",
      type: "article",
      title: "Reciclagem: Por que é tão importante?",
      author: "Equipe ASCAMAREA",
      date: "2023-04-15",
      category: "Reciclagem",
      tags: ["reciclagem", "meio ambiente", "sustentabilidade"],
      icon: "fa-recycle",
      summary:
        "A reciclagem é um dos processos mais importantes para a preservação do meio ambiente. Neste artigo, explicamos os fundamentos da reciclagem, seus benefícios e como você pode contribuir.",
      content: `
        <h2>Introdução</h2>
        <p>A reciclagem é um dos processos mais importantes para a preservação do meio ambiente e para a construção de um futuro sustentável. Em um mundo onde os recursos naturais são finitos e a produção de resíduos cresce exponencialmente, reciclar tornou-se não apenas uma opção, mas uma necessidade urgente.</p>
        
        <p>Neste artigo, vamos explorar os fundamentos da reciclagem, seus benefícios ambientais, econômicos e sociais, além de fornecer dicas práticas sobre como você pode contribuir para este processo vital em seu dia a dia.</p>

        <h2>O que é reciclagem?</h2>
        <p>A reciclagem é o processo de transformação de materiais usados em novos produtos, reduzindo o consumo de matérias-primas, o uso de energia, a poluição do ar e da água, e ainda diminuindo as emissões de gases do efeito estufa.</p>
        
        <p>Este processo envolve a coleta, separação, processamento e transformação de materiais que seriam descartados como lixo em recursos valiosos. Materiais como papel, vidro, plástico e metal podem ser reciclados repetidamente, reduzindo significativamente a quantidade de resíduos enviados para aterros sanitários.</p>

        <div class="info-box green">
          <h3 class="info-title"><i class="fas fa-info-circle"></i> Você sabia?</h3>
          <p>Uma única lata de alumínio reciclada economiza energia suficiente para manter uma TV ligada por três horas. E o alumínio pode ser reciclado infinitamente sem perder suas propriedades!</p>
        </div>

        <h2>Identificação de materiais recicláveis</h2>
        <p>Saber identificar corretamente os materiais recicláveis é o primeiro passo para uma reciclagem eficiente. Aqui estão os principais tipos de materiais recicláveis e como identificá-los:</p>

        <h3>Papel e Papelão</h3>
        <p>Recicláveis: jornais, revistas, caixas, papéis de escritório, envelopes, cartões.</p>
        <p>Não recicláveis: papel higiênico, guardanapos usados, papel toalha, papéis plastificados, metalizados ou parafinados, fotografias.</p>

        <h3>Plásticos</h3>
        <p>Recicláveis: garrafas PET, embalagens de produtos de limpeza, potes de alimentos, sacos plásticos, tubos e canos de PVC.</p>
        <p>Não recicláveis: embalagens metalizadas (como de salgadinhos), fraldas descartáveis, adesivos.</p>

        <h3>Vidros</h3>
        <p>Recicláveis: garrafas, potes, frascos.</p>
        <p>Não recicláveis: espelhos, vidros de janelas, lâmpadas, cristais, cerâmicas, porcelanas.</p>

        <h3>Metais</h3>
        <p>Recicláveis: latas de alumínio, latas de aço, tampas, panelas sem cabo, ferragens.</p>
        <p>Não recicláveis: clipes, grampos, esponjas de aço, latas de tinta ou produtos químicos.</p>

        <h2>Conclusão</h2>
        <p>A reciclagem é muito mais do que uma simples ação ambiental; é um compromisso com o futuro do nosso planeta e das próximas gerações. Ao reciclar, estamos contribuindo para a conservação dos recursos naturais, a redução da poluição e a construção de uma economia mais sustentável.</p>

        <p>Cada pequena ação conta. Seja separando corretamente seus resíduos em casa, apoiando programas de reciclagem em sua comunidade ou educando outros sobre a importância da reciclagem, você está fazendo a diferença.</p>

        <p>A ASCAMAREA convida você a fazer parte desta mudança. Juntos, podemos transformar resíduos em recursos e construir um futuro mais sustentável para todos.</p>
      `,
    },
    {
      id: "compostagem-residuos-vida",
      type: "article",
      title: "Compostagem: Transformando resíduos em vida",
      author: "Dra. Ana Silva",
      date: "2023-04-02",
      category: "Compostagem",
      tags: ["compostagem", "resíduos orgânicos", "jardinagem"],
      icon: "fa-seedling",
      summary:
        "A compostagem é uma técnica milenar que permite transformar resíduos orgânicos em adubo rico em nutrientes. Descubra como iniciar sua composteira doméstica.",
      content: `
        <h2>Introdução</h2>
        <p>A compostagem é uma técnica milenar que permite transformar resíduos orgânicos em adubo rico em nutrientes. Este processo natural não só reduz significativamente a quantidade de lixo enviado aos aterros sanitários, como também produz um fertilizante de alta qualidade para plantas e jardins.</p>
        
        <p>Neste artigo, vamos explorar os fundamentos da compostagem, seus benefícios ambientais e como você pode iniciar sua própria composteira doméstica, mesmo em espaços pequenos como apartamentos.</p>

        <h2>O que é compostagem?</h2>
        <p>A compostagem é um processo biológico de decomposição de matéria orgânica por microrganismos em condições controladas. Durante este processo, bactérias, fungos e outros organismos transformam restos de alimentos, folhas, galhos e outros materiais orgânicos em um composto rico em nutrientes, semelhante ao húmus encontrado naturalmente no solo.</p>
        
        <p>Este processo imita o ciclo natural de decomposição que ocorre na natureza, mas de forma acelerada e controlada. O resultado final é um material escuro, friável e com odor de terra, conhecido como composto ou húmus, que pode ser utilizado como adubo orgânico para enriquecer o solo.</p>

        <div class="info-box green">
          <h3 class="info-title"><i class="fas fa-info-circle"></i> Você sabia?</h3>
          <p>Cerca de 50% do lixo doméstico é composto por resíduos orgânicos que poderiam ser compostados em vez de enviados para aterros sanitários, onde produzem metano, um gás de efeito estufa 25 vezes mais potente que o CO₂.</p>
        </div>

        <h2>Benefícios da compostagem</h2>
        <p>A compostagem oferece uma série de benefícios ambientais, econômicos e para a saúde do solo:</p>

        <h3>Benefícios ambientais</h3>
        <ul class="benefits-list">
          <li><strong>Redução de resíduos:</strong> Diminui significativamente a quantidade de lixo enviado aos aterros sanitários.</li>
          <li><strong>Diminuição de gases de efeito estufa:</strong> Evita a produção de metano que ocorre quando resíduos orgânicos se decompõem em aterros.</li>
          <li><strong>Economia de água:</strong> O composto retém umidade no solo, reduzindo a necessidade de irrigação.</li>
          <li><strong>Redução do uso de fertilizantes químicos:</strong> Fornece uma alternativa natural e sustentável aos fertilizantes industriais.</li>
        </ul>

        <h2>Conclusão</h2>
        <p>A compostagem é uma prática acessível e transformadora que nos permite participar ativamente do ciclo natural de nutrientes. Ao compostar nossos resíduos orgânicos, reduzimos significativamente nossa pegada ecológica e ainda produzimos um recurso valioso para o solo.</p>

        <p>Independentemente do espaço disponível, há sempre uma maneira de incorporar a compostagem em nossa rotina. Seja com uma pequena composteira de apartamento ou um sistema maior no jardim, cada esforço conta para um planeta mais sustentável.</p>

        <p>Comece hoje mesmo sua jornada de compostagem e transforme seus resíduos em vida!</p>
      `,
    },
    {
      id: "coleta-seletiva-bairro-centro",
      type: "announcement",
      title: "Alteração no horário de coleta seletiva no bairro Centro",
      date: "2023-06-10",
      category: "Coleta Seletiva",
      icon: "fa-clock",
      summary:
        "Informamos que a partir do dia 15/06/2023, o horário de coleta seletiva no bairro Centro será alterado para o período da tarde, das 14h às 17h.",
      content: `
        <p>Prezados moradores e comerciantes do bairro Centro,</p>
        
        <p>A ASCAMAREA informa que, a partir do dia <strong>15 de junho de 2023</strong>, o horário de coleta seletiva no bairro Centro será alterado para o período da tarde, das <strong>14h às 17h</strong>.</p>
        
        <p>Esta alteração visa otimizar nossas rotas de coleta e melhorar o atendimento à comunidade. Os dias de coleta permanecem os mesmos: segundas, quartas e sextas-feiras.</p>
        
        <div class="info-box blue">
          <h3 class="info-title"><i class="fas fa-lightbulb"></i> Lembrete</h3>
          <p>Disponibilize seus materiais recicláveis apenas nos dias e horários de coleta. Materiais deixados fora desses horários podem não ser coletados.</p>
        </div>
        
        <h3>Materiais aceitos na coleta seletiva:</h3>
        <ul>
          <li>Papel e papelão limpos</li>
          <li>Plásticos</li>
          <li>Vidros</li>
          <li>Metais</li>
        </ul>
        
        <p>Em caso de dúvidas ou para mais informações, entre em contato conosco pelo telefone (00) 00000-0000 ou pelo e-mail contato@ascamarea.org.</p>
        
        <p>Agradecemos a compreensão e colaboração de todos!</p>
        
        <p>Equipe ASCAMAREA</p>
      `,
    },
    {
      id: "evento-dia-meio-ambiente",
      type: "announcement",
      title: "Evento especial: Dia Mundial do Meio Ambiente",
      date: "2023-05-28",
      category: "Eventos",
      icon: "fa-calendar-alt",
      summary:
        "Participe da nossa programação especial em comemoração ao Dia Mundial do Meio Ambiente. Atividades educativas, oficinas e muito mais!",
      content: `
        <p>Caros membros da comunidade,</p>
        
        <p>Em comemoração ao <strong>Dia Mundial do Meio Ambiente (5 de junho)</strong>, a ASCAMAREA convida toda a comunidade para participar de nossa programação especial.</p>
        
        <h3>Programação do evento:</h3>
        
        <h4>📅 Data: 5 de junho de 2023</h4>
        <h4>🕘 Horário: 8h às 17h</h4>
        <h4>📍 Local: Praça Central de Açailândia</h4>
        
        <h3>Atividades programadas:</h3>
        <ul>
          <li><strong>8h às 10h:</strong> Oficina de compostagem doméstica</li>
          <li><strong>10h às 12h:</strong> Palestra sobre reciclagem e economia circular</li>
          <li><strong>14h às 16h:</strong> Atividades educativas para crianças</li>
          <li><strong>16h às 17h:</strong> Plantio de mudas nativas</li>
        </ul>
        
        <div class="info-box green">
          <h3 class="info-title"><i class="fas fa-gift"></i> Brindes especiais</h3>
          <p>Todos os participantes receberão mudas de plantas nativas e material educativo sobre sustentabilidade!</p>
        </div>
        
        <p>Venha fazer parte desta importante iniciativa pela preservação do nosso meio ambiente. Sua participação faz a diferença!</p>
        
        <p>Para mais informações, entre em contato conosco.</p>
        
        <p>Esperamos vocês!</p>
        <p>Equipe ASCAMAREA</p>
      `,
    },
  ],
  gallery: [
    {
      id: "reciclagem-acao-1",
      title: "Ação de reciclagem no bairro Centro",
      description:
        "Catadores da ASCAMAREA realizando coleta seletiva no centro da cidade, promovendo a conscientização ambiental e a sustentabilidade.",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
      date: "2023-06-15",
      category: "Ações Ambientais",
    },
    {
      id: "oficina-compostagem-1",
      title: "Oficina de compostagem doméstica",
      description:
        "Workshop educativo ensinando a comunidade como fazer compostagem em casa, transformando resíduos orgânicos em adubo natural.",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      date: "2023-06-10",
      category: "Educação Ambiental",
    },
    {
      id: "plantio-mudas-1",
      title: "Plantio de mudas nativas",
      description:
        "Voluntários e membros da comunidade participando do plantio de mudas nativas para recuperação de áreas verdes urbanas.",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?w=400&h=300&fit=crop",
      date: "2023-06-05",
      category: "Reflorestamento",
    },
    {
      id: "separacao-materiais-1",
      title: "Separação de materiais recicláveis",
      description:
        "Processo de triagem e separação de materiais recicláveis na sede da ASCAMAREA, garantindo a qualidade dos materiais para reciclagem.",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      date: "2023-05-30",
      category: "Reciclagem",
    },
    {
      id: "evento-meio-ambiente-1",
      title: "Celebração do Dia Mundial do Meio Ambiente",
      description:
        "Grande evento comemorativo com atividades educativas, palestras e conscientização sobre a importância da preservação ambiental.",
      imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=300&fit=crop",
      date: "2023-05-25",
      category: "Eventos",
    },
    {
      id: "capacitacao-catadores-1",
      title: "Capacitação de catadores",
      description:
        "Programa de capacitação profissional para catadores, oferecendo treinamento em técnicas de coleta, separação e valorização de materiais recicláveis.",
      imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
      date: "2023-05-20",
      category: "Capacitação",
    },
  ],
}

// Carregar dados do localStorage se existirem
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsedData = JSON.parse(stored)
      if (parsedData && parsedData.articles) {
        // Manter compatibilidade com versões antigas que não tinham galeria
        blogContent.articles = parsedData.articles
        if (parsedData.gallery) {
          blogContent.gallery = parsedData.gallery
        }
        console.log(
          "Dados carregados do localStorage:",
          blogContent.articles.length,
          "artigos,",
          blogContent.gallery.length,
          "itens da galeria",
        )
      }
    }
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage:", error)
  }
}

// Salvar dados no localStorage
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogContent))
    console.log("Dados salvos no localStorage")

    // Disparar evento personalizado para notificar outras páginas
    window.dispatchEvent(
      new CustomEvent("blogContentUpdated", {
        detail: { content: blogContent },
      }),
    )
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error)
  }
}

// Carregar dados na inicialização
loadFromStorage()

// Funções para gerenciar o conteúdo
function getContentById(id) {
  return blogContent.articles.find((article) => article.id === id)
}

function getAllContent() {
  return blogContent.articles.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function getContentByType(type) {
  return blogContent.articles
    .filter((article) => article.type === type)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

function addContent(content) {
  // Gerar ID único se não fornecido
  if (!content.id) {
    content.id = generateSlug(content.title) + "-" + Date.now()
  }

  // Adicionar data atual se não fornecida
  if (!content.date) {
    content.date = new Date().toISOString().split("T")[0]
  }

  blogContent.articles.unshift(content) // Adicionar no início para aparecer primeiro
  saveToStorage() // Salvar no localStorage
  return content
}

function updateContent(id, updatedContent) {
  console.log("updateContent chamado com:", { id, updatedContent })

  const index = blogContent.articles.findIndex((article) => article.id === id)
  console.log("Índice encontrado:", index)

  if (index !== -1) {
    // Preservar o ID e data original
    const originalId = blogContent.articles[index].id
    const originalDate = blogContent.articles[index].date

    // Atualizar o conteúdo mantendo ID e data originais
    blogContent.articles[index] = {
      ...updatedContent,
      id: originalId,
      date: originalDate,
    }

    console.log("Conteúdo atualizado:", blogContent.articles[index])

    saveToStorage() // Salvar no localStorage
    return blogContent.articles[index]
  }

  console.error("Conteúdo não encontrado para atualização:", id)
  return null
}

function deleteContent(id) {
  const index = blogContent.articles.findIndex((article) => article.id === id)
  if (index !== -1) {
    const deleted = blogContent.articles.splice(index, 1)
    saveToStorage() // Salvar no localStorage
    console.log("Conteúdo deletado:", deleted[0])
    return deleted[0]
  }
  console.error("Conteúdo não encontrado para exclusão:", id)
  return null
}

// Função para remover conteúdo (alias para deleteContent)
function removeContent(id) {
  return deleteContent(id)
}

// Funções para gerenciar a galeria
function getAllGalleryItems() {
  return blogContent.gallery.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function getGalleryItemById(id) {
  return blogContent.gallery.find((item) => item.id === id)
}

function addGalleryItem(item) {
  // Gerar ID único se não fornecido
  if (!item.id) {
    item.id = generateSlug(item.title) + "-" + Date.now()
  }

  // Adicionar data atual se não fornecida
  if (!item.date) {
    item.date = new Date().toISOString().split("T")[0]
  }

  blogContent.gallery.unshift(item) // Adicionar no início para aparecer primeiro
  saveToStorage() // Salvar no localStorage
  return item
}

function updateGalleryItem(id, updatedItem) {
  console.log("updateGalleryItem chamado com:", { id, updatedItem })

  const index = blogContent.gallery.findIndex((item) => item.id === id)
  console.log("Índice encontrado:", index)

  if (index !== -1) {
    // Preservar o ID e data original
    const originalId = blogContent.gallery[index].id
    const originalDate = blogContent.gallery[index].date

    // Atualizar o item mantendo ID e data originais
    blogContent.gallery[index] = {
      ...updatedItem,
      id: originalId,
      date: originalDate,
    }

    console.log("Item da galeria atualizado:", blogContent.gallery[index])

    saveToStorage() // Salvar no localStorage
    return blogContent.gallery[index]
  }

  console.error("Item da galeria não encontrado para atualização:", id)
  return null
}

function deleteGalleryItem(id) {
  const index = blogContent.gallery.findIndex((item) => item.id === id)
  if (index !== -1) {
    const deleted = blogContent.gallery.splice(index, 1)
    saveToStorage() // Salvar no localStorage
    console.log("Item da galeria deletado:", deleted[0])
    return deleted[0]
  }
  console.error("Item da galeria não encontrado para exclusão:", id)
  return null
}

// Função auxiliar para gerar slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens duplicados
    .trim()
}

// Função para resetar dados (útil para desenvolvimento)
function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEY)
  location.reload()
}

// Exportar as funções para uso global
if (typeof window !== "undefined") {
  window.blogData = {
    getContentById,
    getAllContent,
    getContentByType,
    addContent,
    updateContent,
    deleteContent,
    removeContent,
    getAllGalleryItems,
    getGalleryItemById,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    resetToDefaults,
    saveToStorage,
    loadFromStorage,
  }

  // Escutar mudanças no localStorage de outras abas
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      console.log("Dados atualizados em outra aba, recarregando...")
      loadFromStorage()

      // Disparar evento para atualizar a interface
      window.dispatchEvent(
        new CustomEvent("blogContentUpdated", {
          detail: { content: blogContent },
        }),
      )
    }
  })

  console.log(
    "Sistema de blog inicializado com",
    blogContent.articles.length,
    "artigos e",
    blogContent.gallery.length,
    "itens da galeria",
  )
}
