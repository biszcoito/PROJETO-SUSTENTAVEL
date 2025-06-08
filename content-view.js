// Prevenir execução múltipla
if (typeof window.contentViewLoaded === "undefined") {
  window.contentViewLoaded = true

  document.addEventListener("DOMContentLoaded", () => {
    console.log("Inicializando visualização de conteúdo...")

    // Obter o ID do conteúdo da URL
    const urlParams = new URLSearchParams(window.location.search)
    const contentId = urlParams.get("id")

    if (!contentId) {
      // Se não houver ID, redirecionar para a página inicial
      window.location.href = "index.html"
      return
    }

    // Variável para armazenar o conteúdo atual
    let currentContent = null

    // Escutar atualizações de conteúdo
    window.addEventListener("blogContentUpdated", () => {
      console.log("Conteúdo atualizado, recarregando visualização...")
      loadContent(true) // Forçar recarregamento
    })

    // Escutar mudanças no localStorage de outras abas
    window.addEventListener("storage", (e) => {
      if (e.key === "ascamarea_blog_content") {
        console.log("Dados atualizados em outra aba, recarregando visualização...")
        loadContent(true) // Forçar recarregamento
      }
    })

    // Função para tentar carregar o conteúdo
    function tryLoadContent() {
      if (typeof window.blogData === "undefined") {
        console.log("Aguardando carregamento dos dados...")
        setTimeout(tryLoadContent, 500)
        return
      }

      loadContent()
    }

    // Função principal para carregar o conteúdo
    function loadContent(forceReload = false) {
      if (typeof window.blogData === "undefined") {
        console.log("Dados do blog não disponíveis")
        return
      }

      // Recarregar dados do localStorage para garantir que temos a versão mais recente
      if (window.blogData.loadFromStorage) {
        window.blogData.loadFromStorage()
      }

      // Obter o conteúdo pelo ID
      const content = window.blogData.getContentById(contentId)

      if (!content) {
        // Se o conteúdo não for encontrado, exibir mensagem de erro
        document.querySelector(".article-container").innerHTML = `
          <div class="error-message" style="text-align: center; padding: 4rem 2rem;">
            <h2>Conteúdo não encontrado</h2>
            <p>O conteúdo que você está procurando não existe ou foi removido.</p>
            <a href="index.html#blog" class="btn btn-green">Voltar para o Blog</a>
          </div>
        `
        return
      }

      // Verificar se o conteúdo mudou (para evitar recarregamentos desnecessários)
      if (!forceReload && currentContent && JSON.stringify(currentContent) === JSON.stringify(content)) {
        console.log("Conteúdo não mudou, mantendo visualização atual")
        return
      }

      // Atualizar conteúdo atual
      currentContent = content

      // Atualizar o título da página
      document.title = `${content.title} | ASCAMAREA`

      // Preencher o cabeçalho do conteúdo
      const contentHeader = document.getElementById("content-header")
      if (contentHeader) {
        contentHeader.innerHTML = `
          <h1>${content.title}</h1>
          <div class="article-meta">
            ${content.date ? `<span><i class="fas fa-calendar-alt"></i> ${formatDate(content.date)}</span>` : ""}
            ${content.author ? `<span><i class="fas fa-user"></i> ${content.author}</span>` : ""}
            ${content.category ? `<span><i class="fas fa-tag"></i> ${content.category}</span>` : ""}
          </div>
        `
      }

      // Preencher a imagem destacada
      const contentFeaturedImage = document.getElementById("content-featured-image")
      if (contentFeaturedImage) {
        contentFeaturedImage.innerHTML = `
          <i class="fas ${content.icon || "fa-recycle"} featured-icon"></i>
        `
      }

      // Preencher o corpo do conteúdo
      const contentBody = document.getElementById("content-body")
      if (contentBody) {
        contentBody.innerHTML = content.content || "<p>Conteúdo não disponível.</p>"
      }

      // Preencher o rodapé do conteúdo
      const contentFooter = document.getElementById("content-footer")
      if (contentFooter) {
        // Preparar as tags se existirem
        let tagsHTML = ""
        if (content.tags && content.tags.length > 0) {
          tagsHTML = `
            <div class="article-tags">
              ${content.tags.map((tag) => `<span class="tag tag-green">${tag}</span>`).join("")}
            </div>
          `
        }

        contentFooter.innerHTML = `
          ${tagsHTML}
          <div class="article-share">
            <span>Compartilhe:</span>
            <a href="#" class="share-link" onclick="shareContent('facebook', '${contentId}')"><i class="fab fa-facebook"></i></a>
            <a href="#" class="share-link" onclick="shareContent('twitter', '${contentId}')"><i class="fab fa-twitter"></i></a>
            <a href="#" class="share-link" onclick="shareContent('whatsapp', '${contentId}')"><i class="fab fa-whatsapp"></i></a>
          </div>
        `
      }

      // Preencher conteúdo relacionado
      loadRelatedContent(content)

      console.log("Conteúdo carregado/atualizado com sucesso:", content.title)
    }

    // Função para carregar conteúdo relacionado
    function loadRelatedContent(content) {
      const relatedContent = document.getElementById("related-content")
      if (!relatedContent) return

      try {
        // Recarregar dados para garantir que temos a versão mais recente
        if (window.blogData.loadFromStorage) {
          window.blogData.loadFromStorage()
        }

        // Obter conteúdo do mesmo tipo ou categoria
        const allContent = window.blogData.getAllContent()
        const related = allContent
          .filter((item) => {
            // Excluir o próprio item
            if (item.id === content.id) return false

            // Priorizar mesmo tipo e categoria
            if (item.type === content.type && item.category === content.category) return true

            // Depois mesmo tipo
            if (item.type === content.type) return true

            // Por último, mesma categoria
            if (item.category === content.category) return true

            return false
          })
          .slice(0, 3) // Limitar a 3 itens relacionados

        if (related.length > 0) {
          relatedContent.innerHTML = `
            <h3>Conteúdo Relacionado</h3>
            <div class="related-grid">
              ${related
                .map(
                  (item) => `
                <a href="content-view.html?id=${item.id}" class="related-article">
                  <div class="related-image">
                    <i class="fas ${item.icon || "fa-recycle"}"></i>
                  </div>
                  <h4>${item.title}</h4>
                  <p class="related-summary">${item.summary ? item.summary.substring(0, 100) + "..." : ""}</p>
                </a>
              `,
                )
                .join("")}
            </div>
          `
        } else {
          relatedContent.innerHTML = `
            <h3>Conteúdo Relacionado</h3>
            <div class="empty-message">
              <p>Nenhum conteúdo relacionado encontrado.</p>
              <a href="blog.html" class="btn btn-outline-green">Ver todos os posts</a>
            </div>
          `
        }
      } catch (error) {
        console.error("Erro ao carregar conteúdo relacionado:", error)
        relatedContent.innerHTML = `
          <h3>Conteúdo Relacionado</h3>
          <div class="empty-message">
            <p>Erro ao carregar conteúdo relacionado.</p>
          </div>
        `
      }
    }

    // Iniciar tentativa de carregamento
    tryLoadContent()

    // Verificar periodicamente se o conteúdo foi atualizado (fallback)
    setInterval(() => {
      if (typeof window.blogData !== "undefined") {
        // Recarregar dados do localStorage
        if (window.blogData.loadFromStorage) {
          window.blogData.loadFromStorage()
        }

        // Verificar se o conteúdo ainda existe
        const content = window.blogData.getContentById(contentId)
        if (!content && currentContent) {
          // Conteúdo foi deletado
          console.log("Conteúdo foi deletado, redirecionando...")
          window.location.href = "blog.html"
        } else if (content && (!currentContent || JSON.stringify(currentContent) !== JSON.stringify(content))) {
          // Conteúdo foi atualizado
          console.log("Conteúdo foi atualizado, recarregando...")
          loadContent(true)
        }
      }
    }, 5000) // Verificar a cada 5 segundos
  })

  // Função para formatar a data
  function formatDate(dateString) {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR")
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return dateString
    }
  }

  // Função para compartilhar conteúdo
  function shareContent(platform, contentId) {
    const url = `${window.location.origin}/content-view.html?id=${contentId}`
    const title = document.title

    let shareUrl

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`
        break
      default:
        return
    }

    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  // Tornar a função shareContent global
  window.shareContent = shareContent
}
