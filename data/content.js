// precisamos melhorar isso...

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
  ],
}

// Função para obter um artigo pelo ID
function getContentById(id) {
  return blogContent.articles.find((article) => article.id === id)
}
// Função para obter todos os artigos
function getAllContent() {
  return blogContent.articles
}
// Função para obter artigos por tipo (artigo ou anuncio)
function getContentByType(type) {
  return blogContent.articles.filter((article) => article.type === type)
}
// Função para adicionar novo conteúdo
function addContent(content) {
  //isso era para ser salvo em um banco de dados
  blogContent.articles.push(content)
  return content
}
// Função para atualizar conteúdo existente
function updateContent(id, updatedContent) {
  const index = blogContent.articles.findIndex((article) => article.id === id)
  if (index !== -1) {
    blogContent.articles[index] = { ...blogContent.articles[index], ...updatedContent }
    return blogContent.articles[index]
  }
  return null
}
// Função para excluir conteúdo
function deleteContent(id) {
  const index = blogContent.articles.findIndex((article) => article.id === id)
  if (index !== -1) {
    const deleted = blogContent.articles.splice(index, 1)
    return deleted[0]
  }
  return null
}
// Exportar as funções
window.blogData = {
  getContentById,
  getAllContent,
  getContentByType,
  addContent,
  updateContent,
  deleteContent,
}
