document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section")
  const adminPanel = document.getElementById("admin-panel")
  const loginForm = document.getElementById("login-form")
  const loginError = document.getElementById("login-error")
  const logoutBtn = document.getElementById("logout-btn")
  const contentForm = document.getElementById("content-form")
  const previewBtn = document.getElementById("preview-btn")
  const previewModal = document.getElementById("preview-modal")
  const previewContent = document.getElementById("preview-content")
  const confirmationModal = document.getElementById("confirmation-modal")
  const confirmMessage = document.getElementById("confirmation-message")
  const confirmYes = document.getElementById("confirm-yes")
  const confirmNo = document.getElementById("confirm-no")
  const closeModalButtons = document.querySelectorAll(".close-modal")
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")
  const toolbarButtons = document.querySelectorAll(".toolbar-btn")
  const contentTypeRadios = document.querySelectorAll('input[name="content-type"]')
  const contentFilterRadios = document.querySelectorAll('input[name="content-filter"]')
  const contentList = document.getElementById("content-list")
  const searchContent = document.getElementById("search-content")


  const ADMIN_USERNAME = "admin"; // Nome de usuário de exemplo
  const ADMIN_PASSWORD = "ascamarea2025"; // Esta é apenas uma senha de exemplo
  // Verificar se o usuário já está logado
  checkLoginStatus();

  // Event Listeners
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }

  if (contentForm) {
    contentForm.addEventListener("submit", handleContentSubmit)
  }

  if (previewBtn) {
    previewBtn.addEventListener("click", showPreview)
  }

  // Alternar campos com base no tipo de conteúdo
  contentTypeRadios.forEach((radio) => {
    radio.addEventListener("change", toggleContentFields)
  })

  // Filtrar conteúdo
  contentFilterRadios.forEach((radio) => {
    radio.addEventListener("change", filterContent)
  })

  // Buscar conteúdo
  if (searchContent) {
    searchContent.addEventListener("input", filterContent)
  }

  // Fechar modais
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      previewModal.classList.add("hidden")
      confirmationModal.classList.add("hidden")
    })
  })
  // Alternar entre abas
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Atualizar botão ativo
      tabButtons.forEach((btn) => {
        btn.classList.remove("active")
      })
      this.classList.add("active")

      // Mostrar conteúdo da aba selecionada
      tabContents.forEach((content) => {
        content.classList.add("hidden")
      })
      document.getElementById(`${tabName}-tab`).classList.remove("hidden")

      // Carregar conteúdo se estiver na aba de gerenciamento
      if (tabName === "manage-content") {
        loadContent()
      }
    })
  })

  // Botões da barra de ferramentas do editor
  toolbarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const format = button.getAttribute("data-format")
      formatText(format)
    })
  })

  // Funções
  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    if (isLoggedIn) {
      showAdminPanel()
    } else {
      showLoginForm()
    }
  }

  function handleLogin(e) {
    e.preventDefault()
    const password = document.getElementById("password").value

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true")
      showAdminPanel()
    } else {
      loginError.classList.remove("hidden")
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminLoggedIn")
    showLoginForm()
  }

  function showLoginForm() {
    adminPanel.classList.add("hidden")
    loginSection.classList.remove("hidden")
  }

  function showAdminPanel() {
    loginSection.classList.add("hidden")
    adminPanel.classList.remove("hidden")
  }

  function toggleContentFields() {
    const contentType = document.querySelector('input[name="content-type"]:checked').value
    const articleFields = document.querySelectorAll(".article-field")

    if (contentType === "article") {
      articleFields.forEach((field) => (field.style.display = "block"))
    } else {
      articleFields.forEach((field) => (field.style.display = "none"))
    }
  }

  function handleContentSubmit(e) {
    e.preventDefault()

    // Obter valores do formulário
    const contentType = document.querySelector('input[name="content-type"]:checked').value
    const title = document.getElementById("content-title").value
    const author = document.getElementById("content-author")?.value || ""
    const category = document.getElementById("content-category").value
    const tags = document.getElementById("content-tags")?.value || ""
    const icon = document.getElementById("content-icon").value
    const summary = document.getElementById("content-summary").value
    const body = document.getElementById("content-body").value

    // Gerar ID a partir do título
    const id = generateSlug(title)

    // Criar objeto de conteúdo
    const content = {
      id,
      type: contentType,
      title,
      date: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
      category,
      icon,
      summary,
      content: formatContentForStorage(body),
    }

    // Adicionar campos específicos para artigos
    if (contentType === "article") {
      content.author = author
      content.tags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    }

    // Simulação de envio bem-sucedido
    window.blogData.addContent(content)

    showConfirmation(`${contentType === "article" ? "Artigo" : "Comunicado"} publicado com sucesso!`, () => {
      contentForm.reset()
      // Redirecionar para a visualização do conteúdo
      window.location.href = `content-view.html?id=${id}`
    })
  }

  function loadContent() {
    if (!contentList) return

    // Obter todo o conteúdo
    const allContent = window.blogData.getAllContent()

    // Aplicar filtros
    const filteredContent = filterContentItems(allContent)

    // Limpar lista
    contentList.innerHTML = ""

    // Adicionar itens à lista
    if (filteredContent.length === 0) {
      contentList.innerHTML = '<div class="empty-message">Nenhum conteúdo encontrado.</div>'
    } else {
      filteredContent.forEach((item) => {
        const contentItem = document.createElement("div")
        contentItem.className = `content-item ${item.type}`

        contentItem.innerHTML = `
          <div class="content-info">
            <h4>${item.title}</h4>
            <div class="content-meta">
              <span><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</span>
              ${item.type === "article" ? `<span><i class="fas fa-user"></i> ${item.author}</span>` : ""}
              <span><i class="fas ${item.type === "article" ? "fa-newspaper" : "fa-bullhorn"}"></i> ${item.type === "article" ? "Artigo" : "Comunicado"}</span>
            </div>
          </div>
          <div class="content-actions">
            <a href="content-view.html?id=${item.id}" class="btn btn-sm btn-outline-green" target="_blank">Ver</a>
            <button class="btn btn-sm btn-outline-green edit-content" data-id="${item.id}">Editar</button>
            <button class="btn btn-sm btn-outline-red delete-content" data-id="${item.id}">Excluir</button>
          </div>
        `

        contentList.appendChild(contentItem)
      })

      // Adicionar event listeners para botões de edição e exclusão
      document.querySelectorAll(".edit-content").forEach((button) => {
        button.addEventListener("click", () => {
          editContent(button.getAttribute("data-id"))
        })
      })

      document.querySelectorAll(".delete-content").forEach((button) => {
        button.addEventListener("click", () => {
          deleteContent(button.getAttribute("data-id"))
        })
      })
    }
  }

  function filterContentItems(items) {
    const filterType = document.querySelector('input[name="content-filter"]:checked')?.value || "all"
    const searchTerm = searchContent?.value.toLowerCase() || ""

    return items.filter((item) => {
      // Filtrar por tipo
      if (filterType !== "all" && item.type !== filterType) {
        return false
      }

      // Filtrar por termo de busca
      if (searchTerm) {
        return (
          item.title.toLowerCase().includes(searchTerm) ||
          item.summary.toLowerCase().includes(searchTerm) ||
          (item.author && item.author.toLowerCase().includes(searchTerm)) ||
          item.category.toLowerCase().includes(searchTerm)
        )
      }

      return true
    })
  }

  function filterContent() {
    loadContent()
  }

  function showPreview() {
    const contentType = document.querySelector('input[name="content-type"]:checked').value
    const title = document.getElementById("content-title").value
    const author = document.getElementById("content-author")?.value || ""
    const category = document.getElementById("content-category").value
    const icon = document.getElementById("content-icon").value
    const body = document.getElementById("content-body").value

    // Criar HTML de pré-visualização
    const previewHTML = `
      <div class="preview-content">
        <h1>${title}</h1>
        <div class="article-meta">
          <span><i class="fas fa-calendar-alt"></i> ${formatDate(new Date().toISOString())}</span>
          ${contentType === "article" ? `<span><i class="fas fa-user"></i> ${author}</span>` : ""}
          <span><i class="fas fa-tag"></i> ${category}</span>
        </div>
        
        <div class="article-featured-image">
          <i class="fas ${icon} featured-icon"></i>
        </div>
        
        <div class="article-content">
          ${formatContentForPreview(body)}
        </div>
      </div>
    `

    previewContent.innerHTML = previewHTML
    previewModal.classList.remove("hidden")
  }

  function formatContentForPreview(content) {
    // Converter quebras de linha em parágrafos
    let formatted = content.replace(/\n\n/g, "</p><p>")
    formatted = "<p>" + formatted + "</p>"

    // Substituir marcações simples
    formatted = formatted.replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>")
    formatted = formatted.replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Substituir caixas de informação
    const infoBoxRegex = /\[info\]([\s\S]*?)\[\/info\]/g
    formatted = formatted.replace(
      infoBoxRegex,
      '<div class="info-box green"><h3 class="info-title"><i class="fas fa-info-circle"></i> Informação</h3><p>$1</p></div>',
    )

    return formatted
  }

  function formatContentForStorage(content) {
    // Em um sistema real, você pode querer fazer algum processamento adicional aqui
    return content
  }

  function formatText(format) {
    const editor = document.getElementById("content-body")
    const selection = editor.value.substring(editor.selectionStart, editor.selectionEnd)
    let formattedText = ""

    switch (format) {
      case "h2":
        formattedText = `\n## ${selection || "Título de Seção"}\n\n`
        break
      case "h3":
        formattedText = `\n### ${selection || "Subtítulo"}\n\n`
        break
      case "p":
        formattedText = `\n${selection || "Novo parágrafo"}\n\n`
        break
      case "bold":
        formattedText = `**${selection || "texto em negrito"}**`
        break
      case "italic":
        formattedText = `*${selection || "texto em itálico"}*`
        break
      case "ul":
        if (selection) {
          const lines = selection.split("\n")
          formattedText = "\n"
          lines.forEach((line) => {
            if (line.trim()) {
              formattedText += `- ${line.trim()}\n`
            }
          })
          formattedText += "\n"
        } else {
          formattedText = "\n- Item da lista\n- Item da lista\n- Item da lista\n\n"
        }
        break
      case "ol":
        if (selection) {
          const lines = selection.split("\n")
          formattedText = "\n"
          lines.forEach((line, index) => {
            if (line.trim()) {
              formattedText += `${index + 1}. ${line.trim()}\n`
            }
          })
          formattedText += "\n"
        } else {
          formattedText = "\n1. Primeiro item\n2. Segundo item\n3. Terceiro item\n\n"
        }
        break
      case "info-box":
        formattedText = `\n[info]${selection || "Informação importante aqui"}[/info]\n\n`
        break
    }

    // Inserir texto formatado
    const start = editor.selectionStart
    const end = editor.selectionEnd
    editor.value = editor.value.substring(0, start) + formattedText + editor.value.substring(end)

    // Reposicionar cursor
    editor.focus()
    editor.selectionStart = start + formattedText.length
    editor.selectionEnd = start + formattedText.length
  }

  function showConfirmation(message, onConfirm) {
    confirmMessage.textContent = message
    confirmationModal.classList.remove("hidden")

    // Remover event listeners anteriores
    confirmYes.replaceWith(confirmYes.cloneNode(true))
    confirmNo.replaceWith(confirmNo.cloneNode(true))

    // Adicionar novos event listeners
    document.getElementById("confirm-yes").addEventListener("click", () => {
      onConfirm()
      confirmationModal.classList.add("hidden")
    })

    document.getElementById("confirm-no").addEventListener("click", () => {
      confirmationModal.classList.add("hidden")
    })
  }

  function editContent(contentId) {
    // Obter o conteúdo pelo ID
    const content = window.blogData.getContentById(contentId)
    if (!content) return

    // Alternar para a aba de novo conteúdo
    document.querySelector('[data-tab="new-content"]').click()

    // Selecionar o tipo de conteúdo
    const contentTypeRadio = document.querySelector(`input[name="content-type"][value="${content.type}"]`)
    if (contentTypeRadio) {
      contentTypeRadio.checked = true
      toggleContentFields()
    }

    // Preencher o

    document.getElementById("content-title").value = content.title
    document.getElementById("content-category").value = content.category
    document.getElementById("content-icon").value = content.icon
    document.getElementById("content-summary").value = content.summary
    document.getElementById("content-body").value = content.content

    if (content.type === "article") {
      document.getElementById("content-author").value = content.author
      document.getElementById("content-tags").value = content.tags.join(", ")
    }
  }

  function deleteContent(contentId) {
    showConfirmation("Tem certeza que deseja excluir este conteúdo?", () => {
      window.blogData.deleteContent(contentId)
      loadContent()
    })
  }

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0") // Janeiro é 0!
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }
})
