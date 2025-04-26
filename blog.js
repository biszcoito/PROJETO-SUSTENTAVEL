document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle")
    if (localStorage.getItem("darkMode") === "enabled") {
      document.documentElement.classList.add("dark")
      darkModeToggle.checked = true
    }
    darkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("darkMode", "enabled")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("darkMode", "disabled")
      }
    })
    const mobileMenuButton = document.getElementById("mobileMenuButton")
    const mobileMenu = document.getElementById("mobileMenu")
  
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
    loadBlogContent()
    const blogTabButtons = document.querySelectorAll(".blog-tab-btn")
    blogTabButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        blogTabButtons.forEach(b => b.classList.remove("active"))
        this.classList.add("active")
        const contentType = this.getAttribute("data-content-type")
        filterBlogContent(contentType)
      })
    })
    const searchInput = document.getElementById("blog-search-input")
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        searchBlogContent(searchInput.value)
      })
    }
  })
  function loadBlogContent() {
    const blogPostsContainer = document.getElementById("blog-posts-container")
    const announcementsContainer = document.getElementById("announcements-container")
    
    if (!blogPostsContainer || !announcementsContainer) return
    blogPostsContainer.innerHTML = ""
    announcementsContainer.innerHTML = ""
    if (typeof window.blogData === "undefined") {
      console.error("Dados do blog não estão disponíveis")
      return
    }
    const articles = window.blogData.getContentByType("article")
    const announcements = window.blogData.getContentByType("announcement")
    // Exibir comunicados
    if (announcements && announcements.length > 0) {
      announcementsContainer.innerHTML = `
        <h3 class="section-title">Comunicados Recentes</h3>
        <div class="announcements-list">
          ${announcements.map(announcement => createAnnouncementElement(announcement)).join('')}
        </div>
      `
    } else {
      announcementsContainer.style.display = "none"
    }
    if (articles && articles.length > 0) {
      const articlesHTML = articles.map(article => createBlogPostElement(article)).join('')
      blogPostsContainer.innerHTML = `
        <h3 class="section-title">Artigos</h3>
        <div class="blog-posts-grid">
          ${articlesHTML}
        </div>
      `
    } else {
      blogPostsContainer.innerHTML = '<div class="empty-message">Nenhum artigo disponível no momento.</div>'
    }
  }
  
  // Função para filtrar
  function filterBlogContent(contentType) {
    const announcementsContainer = document.getElementById("announcements-container")
    const blogPostsContainer = document.getElementById("blog-posts-container")
    
    if (contentType === "all") {
      announcementsContainer.style.display = ""
      blogPostsContainer.style.display = ""
    } else if (contentType === "article") {
      announcementsContainer.style.display = "none"
      blogPostsContainer.style.display = ""
    } else if (contentType === "announcement") {
      announcementsContainer.style.display = ""
      blogPostsContainer.style.display = "none"
    }
  }
  // Função para busca
  function searchBlogContent(searchTerm) {
    if (!searchTerm) {
      loadBlogContent()
      return
    }
  
    searchTerm = searchTerm.toLowerCase()
    // Obter os elementos onde os posts serão exibidos
    const blogPostsContainer = document.getElementById("blog-posts-container")
    const announcementsContainer = document.getElementById("announcements-container")
    if (!blogPostsContainer || !announcementsContainer) return
    blogPostsContainer.innerHTML = ""
    announcementsContainer.innerHTML = ""
    if (typeof window.blogData === "undefined") return
    //Buscar artigos que correspondem ao termo de busca
    const allArticles = window.blogData.getContentByType("article")
    const filteredArticles = allArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) || 
      article.summary.toLowerCase().includes(searchTerm) ||
      (article.content && article.content.toLowerCase().includes(searchTerm)) ||
      (article.author && article.author.toLowerCase().includes(searchTerm)) ||
      (article.category && article.category.toLowerCase().includes(searchTerm)) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    )
  
    //Buscar comunicados que correspondem ao termo da busca
    const allAnnouncements = window.blogData.getContentByType("announcement")
    const filteredAnnouncements = allAnnouncements.filter(announcement => 
      announcement.title.toLowerCase().includes(searchTerm) || 
      announcement.summary.toLowerCase().includes(searchTerm) ||
      (announcement.content && announcement.content.toLowerCase().includes(searchTerm)) ||
      (announcement.category && announcement.category.toLowerCase().includes(searchTerm))
    )
    // Exibir comunicados filtrados (se houver, se nao houver FODA-se)
    if (filteredAnnouncements && filteredAnnouncements.length > 0) {
      announcementsContainer.innerHTML = `
        <h3 class="section-title">Comunicados Encontrados</h3>
        <div class="announcements-list">
          ${filteredAnnouncements.map(announcement => createAnnouncementElement(announcement)).join('')}
        </div>
      `
    } else {
      announcementsContainer.innerHTML = '<div class="empty-message">Nenhum comunicado encontrado para sua busca.</div>'
    }
  
    // Exibir artigos filtrados
    if (filteredArticles && filteredArticles.length > 0) {
      const articlesHTML = filteredArticles.map(article => createBlogPostElement(article)).join('')
      blogPostsContainer.innerHTML = `
        <h3 class="section-title">Artigos Encontrados</h3>
        <div class="blog-posts-grid">
          ${articlesHTML}
        </div>
      `
    } else {
      blogPostsContainer.innerHTML = '<div class="empty-message">Nenhum artigo encontrado para sua busca.</div>'
    }
  }
  
  // Função para criar elemento de comunicado
  function createAnnouncementElement(announcement) {
    // Formatar data
    const date = new Date(announcement.date)
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
  
    return `
      <div class="announcement-item">
        <div class="announcement-icon">
          <i class="fas ${announcement.icon}"></i>
        </div>
        <div class="announcement-content">
          <h4>${announcement.title}</h4>
          <div class="announcement-meta">
            <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
            <span><i class="fas fa-tag"></i> ${announcement.category}</span>
          </div>
          <p>${announcement.summary}</p>
          <a href="content-view.html?id=${announcement.id}" class="btn btn-sm btn-outline-green">Ler comunicado</a>
        </div>
      </div>
    `
  }
  function createBlogPostElement(content) {
    // Formatar data
    const date = new Date(content.date)
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
    // Criar tópicos
    let topicsHTML = ""
    if (content.tags && content.tags.length > 0) {
      const topics = content.tags.slice(0, 4) // Limitar a 4 tópicos
      topicsHTML = `
        <div class="blog-post-topics">
          <h5>Tópicos abordados:</h5>
          <ul>
            ${topics.map((topic) => `<li>${topic}</li>`).join("")}
          </ul>
        </div>
      `
    }
    return `
      <div class="blog-post">
        <div class="blog-post-image">
          <i class="fas ${content.icon} blog-icon"></i>
        </div>
        <div class="blog-post-content">
          <h4>${content.title}</h4>
          <div class="blog-post-meta">
            <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
            ${content.author ? `<span><i class="fas fa-user"></i> ${content.author}</span>` : ""}
          </div>
          <p class="blog-post-excerpt">${content.summary}</p>
          ${topicsHTML}
          <a href="content-view.html?id=${content.id}" class="btn btn-green">Ler artigo completo</a>
        </div>
      </div>
    `
  }