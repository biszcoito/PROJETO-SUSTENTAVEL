document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM
  const loginSection = document.getElementById("login-section")
  const adminDashboard = document.getElementById("admin-dashboard")
  const loginForm = document.getElementById("login-form")
  const logoutBtn = document.getElementById("logout-btn")
  const contentTab = document.getElementById("content-tab")
  const createTab = document.getElementById("create-tab")
  const tabButtons = document.querySelectorAll(".admin-tab-btn")
  const contentForm = document.getElementById("content-form")
  const contentTypeSelect = document.getElementById("content-type")
  const articleFields = document.getElementById("article-fields")
  const contentList = document.getElementById("content-list")
  const contentFilter = document.getElementById("content-filter")
  const contentSearch = document.getElementById("content-search")
  const searchBtn = document.getElementById("search-btn")
  const cancelBtn = document.getElementById("cancel-btn")
  const previewBtn = document.getElementById("preview-btn")
  const contentPreview = document.getElementById("content-preview")
  const openIconSelector = document.getElementById("open-icon-selector")
  const iconGrid = document.getElementById("icon-grid")
  const iconItems = document.querySelectorAll(".icon-item")
  const selectedIconPreview = document.getElementById("selected-icon-preview")
  const contentIconInput = document.getElementById("content-icon")
  const confirmationModal = document.getElementById("confirmation-modal")
  const modalTitle = document.getElementById("modal-title")
  const modalMessage = document.getElementById("modal-message")
  const modalConfirm = document.getElementById("modal-confirm")
  const modalCancel = document.getElementById("modal-cancel")
  const closeModal = document.getElementById("close-modal")
  const toast = document.getElementById("toast")
  const toastContent = document.getElementById("toast-content")
  const contentBodyInput = document.getElementById("content-body")
  const darkModeToggle = document.getElementById("darkModeToggle")
  const mobileMenuButton = document.getElementById("mobileMenuButton")
  const mobileMenu = document.getElementById("mobileMenu")

  // Inicializar o editor Quill
  let quill = null
  try {
    quill = new Quill("#editor-container", {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
      placeholder: "Escreva seu conteúdo aqui...",
      theme: "snow",
    })
  } catch (error) {
    console.error("Quill editor could not be initialized:", error)
  }

  // Verificar modo escuro
  if (localStorage.getItem("darkMode") === "enabled") {
    document.documentElement.classList.add("dark")
    darkModeToggle.checked = true
  }

  // Toggle modo escuro
  darkModeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "enabled")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "disabled")
    }
  })

  // Toggle menu mobile
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
  })

  // Verificar se o usuário está logado
  checkLoginStatus()

  // Event Listeners
  loginForm.addEventListener("submit", handleLogin)
  logoutBtn.addEventListener("click", handleLogout)
  tabButtons.forEach((button) => {
    button.addEventListener("click", switchTab)
  })
  contentTypeSelect.addEventListener("change", toggleArticleFields)
  contentForm.addEventListener("submit", handleContentSubmit)
  contentFilter.addEventListener("change", filterContent)
  searchBtn.addEventListener("click", searchContent)
  contentSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchContent()
    }
  })
  cancelBtn.addEventListener("click", resetForm)
  previewBtn.addEventListener("click", togglePreview)
  openIconSelector.addEventListener("click", toggleIconGrid)
  iconItems.forEach((item) => {
    item.addEventListener("click", selectIcon)
  })
  modalCancel.addEventListener("click", closeConfirmationModal)
  closeModal.addEventListener("click", closeConfirmationModal)

  // Funções
  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"

    if (isLoggedIn) {
      loginSection.classList.add("hidden")
      adminDashboard.classList.remove("hidden")
      loadContent()
    } else {
      loginSection.classList.remove("hidden")
      adminDashboard.classList.add("hidden")
    }
  }

  function handleLogin(e) {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    
    if (username === "admin" && password === "admin") {
      localStorage.setItem("adminLoggedIn", "true")
      loginSection.classList.add("hidden")
      adminDashboard.classList.remove("hidden")
      loadContent()
      showToast("Login realizado com sucesso!")
    } else {
      showToast("Credenciais inválidas. Tente novamente.", true)
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminLoggedIn")
    loginSection.classList.remove("hidden")
    adminDashboard.classList.add("hidden")
    showToast("Logout realizado com sucesso!")
  }

  function switchTab() {
    const tabName = this.getAttribute("data-tab")

    // Atualizar botões
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    this.classList.add("active")

    // Mostrar conteúdo da aba
    if (tabName === "content") {
      contentTab.classList.remove("hidden")
      createTab.classList.add("hidden")
      loadContent()
    } else if (tabName === "create") {
      contentTab.classList.add("hidden")
      createTab.classList.remove("hidden")
      resetForm()
    }
  }

  function toggleArticleFields() {
    const contentType = contentTypeSelect.value

    if (contentType === "article") {
      articleFields.classList.remove("hidden")
    } else {
      articleFields.classList.add("hidden")
    }
  }

  function loadContent(filter = "all", searchQuery = "") {
    if (!window.blogData) {
      showToast("Erro ao carregar dados do blog.", true)
      return
    }

    let contents = []

    if (filter === "all") {
      contents = window.blogData.getAllContent()
    } else {
      contents = window.blogData.getContentByType(filter)
    }

    // Aplicar busca se houver
    if (searchQuery) {
      searchQuery = searchQuery.toLowerCase()
      contents = contents.filter(
        (content) =>
          content.title.toLowerCase().includes(searchQuery) ||
          content.summary.toLowerCase().includes(searchQuery) ||
          (content.content && content.content.toLowerCase().includes(searchQuery)),
      )
    }

    // Ordenar por data (mais recente primeiro)
    contents.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Limpar lista
    contentList.innerHTML = ""

    if (contents.length === 0) {
      contentList.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">Nenhum conteúdo encontrado.</td>
        </tr>
      `
      return
    }

    // Preencher lista
    contents.forEach((content) => {
      const date = new Date(content.date)
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${content.title}</td>
        <td>${content.type === "article" ? "Artigo" : "Comunicado"}</td>
        <td>${formattedDate}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-outline-green edit-btn" data-id="${content.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-green view-btn" data-id="${content.id}">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-green delete-btn" data-id="${content.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `

      contentList.appendChild(row)
    })

    // Adicionar event listeners para os botões de ação
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => editContent(btn.getAttribute("data-id")))
    })

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => viewContent(btn.getAttribute("data-id")))
    })

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteContent(btn.getAttribute("data-id")))
    })
  }

  function filterContent() {
    const filter = contentFilter.value
    const searchQuery = contentSearch.value
    loadContent(filter, searchQuery)
  }

  function searchContent() {
    const filter = contentFilter.value
    const searchQuery = contentSearch.value
    loadContent(filter, searchQuery)
  }

  function handleContentSubmit(e) {
    e.preventDefault()

    // Obter valores do formulário
    const type = contentTypeSelect.value
    const title = document.getElementById("content-title").value
    const summary = document.getElementById("content-summary").value
    const category = document.getElementById("content-category").value
    const icon = contentIconInput.value

    // Obter conteúdo do editor
    const content = quill.root.innerHTML
    contentBodyInput.value = content

    // Validar campos obrigatórios
    if (!type || !title || !summary) {
      showToast("Por favor, preencha todos os campos obrigatórios.", true)
      return
    }

    // Criar objeto de conteúdo
    const contentObj = {
      id: Date.now().toString(), // ID único baseado no timestamp
      type,
      title,
      summary,
      category,
      icon,
      content,
      date: new Date().toISOString(),
    }

    // Adicionar campos específicos para artigos
    if (type === "article") {
      contentObj.author = document.getElementById("content-author").value || "Equipe ASCAMAREA"

      const tagsInput = document.getElementById("content-tags").value
      if (tagsInput) {
        contentObj.tags = tagsInput.split(",").map((tag) => tag.trim())
      }
    }

    // Salvar conteúdo
    if (window.blogData) {
      window.blogData.addContent(contentObj)
      showToast("Conteúdo salvo com sucesso!")
      resetForm()

      // Voltar para a aba de gerenciamento
      document.querySelector('.admin-tab-btn[data-tab="content"]').click()
    } else {
      showToast("Erro ao salvar conteúdo.", true)
    }
  }

  function editContent(id) {
    if (!window.blogData) return

    const content = window.blogData.getContentById(id)
    if (!content) return

    // Mudar para a aba de criação
    document.querySelector('.admin-tab-btn[data-tab="create"]').click()

    // Preencher formulário
    contentTypeSelect.value = content.type
    document.getElementById("content-title").value = content.title
    document.getElementById("content-summary").value = content.summary
    document.getElementById("content-category").value = content.category || "Reciclagem"
    contentIconInput.value = content.icon || "fa-recycle"
    selectedIconPreview.className = `fas ${content.icon || "fa-recycle"}`

    // Preencher editor
    quill.root.innerHTML = content.content || ""

    // Mostrar/esconder campos de artigo
    toggleArticleFields()

    // Preencher campos específicos de artigo
    if (content.type === "article") {
      document.getElementById("content-author").value = content.author || ""
      document.getElementById("content-tags").value = content.tags ? content.tags.join(", ") : ""
    }

    // Adicionar ID para atualização
    contentForm.setAttribute("data-edit-id", id)

    // Mudar texto do botão
    document.querySelector('#content-form button[type="submit"]').textContent = "Atualizar"
  }

  function viewContent(id) {
    if (!window.blogData) return

    const content = window.blogData.getContentById(id)
    if (!content) return

    // Abrir em uma nova aba
    window.open(`content-view.html?id=${id}`, "_blank")
  }

  function deleteContent(id) {
    if (!window.blogData) return

    const content = window.blogData.getContentById(id)
    if (!content) return

    showConfirmationModal(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir "${content.title}"? Esta ação não pode ser desfeita.`,
      () => {
        window.blogData.removeContent(id)
        loadContent(contentFilter.value, contentSearch.value)
        showToast("Conteúdo excluído com sucesso!")
      },
    )
  }

  function resetForm() {
    contentForm.reset()
    quill.root.innerHTML = ""
    contentForm.removeAttribute("data-edit-id")
    document.querySelector('#content-form button[type="submit"]').textContent = "Salvar"
    contentIconInput.value = "fa-recycle"
    selectedIconPreview.className = "fas fa-recycle"
    contentPreview.classList.add("hidden")
    previewBtn.innerHTML = '<i class="fas fa-eye"></i> Visualizar'

    // Esconder campos de artigo
    articleFields.classList.add("hidden")
  }

  function togglePreview() {
    if (contentPreview.classList.contains("hidden")) {
      // Mostrar preview
      const content = quill.root.innerHTML
      contentPreview.innerHTML = content
      contentPreview.classList.remove("hidden")
      previewBtn.innerHTML = '<i class="fas fa-edit"></i> Editar'
    } else {
      // Esconder preview
      contentPreview.classList.add("hidden")
      previewBtn.innerHTML = '<i class="fas fa-eye"></i> Visualizar'
    }
  }

  function toggleIconGrid() {
    iconGrid.classList.toggle("hidden")
  }

  function selectIcon() {
    const icon = this.getAttribute("data-icon")
    contentIconInput.value = icon
    selectedIconPreview.className = `fas ${icon}`

    // Atualizar seleção visual
    iconItems.forEach((item) => item.classList.remove("selected"))
    this.classList.add("selected")

    // Fechar grid
    iconGrid.classList.add("hidden")
  }

  function showConfirmationModal(title, message, confirmCallback) {
    modalTitle.textContent = title
    modalMessage.textContent = message

    // Remover event listeners anteriores
    const newModalConfirm = modalConfirm.cloneNode(true)
    modalConfirm.parentNode.replaceChild(newModalConfirm, modalConfirm)
    const modalConfirm = newModalConfirm

    // Adicionar novo event listener
    modalConfirm.addEventListener("click", () => {
      confirmCallback()
      closeConfirmationModal()
    })

    // Mostrar modal
    confirmationModal.classList.remove("hidden")
  }

  function closeConfirmationModal() {
    confirmationModal.classList.add("hidden")
  }

  function showToast(message, isError = false) {
    toastContent.textContent = message
    toast.classList.remove("hidden", "error")

    if (isError) {
      toast.classList.add("error")
    }

    // Esconder após 3 segundos
    setTimeout(() => {
      toast.classList.add("hidden")
    }, 3000)
  }
})
