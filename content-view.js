document.addEventListener("DOMContentLoaded", () => {
  // Obter o ID do conteúdo da URL
  const urlParams = new URLSearchParams(window.location.search)
  const contentId = urlParams.get("id")

  if (!contentId) {
    // Se não houver ID, redirecionar para a página inicial
    window.location.href = "index.html"
    return
  }

  // Obter o conteúdo pelo ID
  const content = window.blogData.getContentById(contentId)

  if (!content) {
    // Se o conteúdo não for encontrado, exibir mensagem de erro
    document.querySelector(".article-container").innerHTML = `
      <div class="error-message">
        <h2>Conteúdo não encontrado</h2>
        <p>O conteúdo que você está procurando não existe ou foi removido.</p>
        <a href="index.html#blog" class="btn btn-green">Voltar para o Blog</a>
      </div>
    `
    return
  }

  // Atualizar o título da página
  document.title = `${content.title} | ASCAMAREA`

  // Preencher o cabeçalho do conteúdo
  const contentHeader = document.getElementById("content-header")
  contentHeader.innerHTML = `
    <h1>${content.title}</h1>
    <div class="article-meta">
      ${content.date ? `<span><i class="fas fa-calendar-alt"></i> ${formatDate(content.date)}</span>` : ""}
      ${content.author ? `<span><i class="fas fa-user"></i> ${content.author}</span>` : ""}
      ${content.category ? `<span><i class="fas fa-tag"></i> ${content.category}</span>` : ""}
    </div>
  `

  // Preencher a imagem destacada
  const contentFeaturedImage = document.getElementById("content-featured-image")
  contentFeaturedImage.innerHTML = `
    <i class="fas ${content.icon} featured-icon"></i>
  `

  // Preencher o corpo do conteúdo
  const contentBody = document.getElementById("content-body")
  contentBody.innerHTML = content.content

  // Preencher o rodapé do conteúdo
  const contentFooter = document.getElementById("content-footer")

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

  // Preencher conteúdo relacionado
  const relatedContent = document.getElementById("related-content")

  // Obter conteúdo do mesmo tipo ou categoria
  const allContent = window.blogData.getAllContent()
  const related = allContent
    .filter((item) => item.id !== contentId && (item.type === content.type || item.category === content.category))
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
              <i class="fas ${item.icon}"></i>
            </div>
            <h4>${item.title}</h4>
          </a>
        `,
          )
          .join("")}
      </div>
    `
  } else {
    relatedContent.style.display = "none"
  }
})

// Função para formatar a data
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
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

  window.open(shareUrl, "_blank")
}
