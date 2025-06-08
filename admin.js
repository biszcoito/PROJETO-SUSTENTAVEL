document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM
  const loginSection = document.getElementById("login-section")
  const adminDashboard = document.getElementById("admin-dashboard")
  const loginForm = document.getElementById("login-form")
  const logoutBtn = document.getElementById("logout-btn")
  const contentTab = document.getElementById("content-tab")
  const galleryTab = document.getElementById("gallery-tab")
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

  // Elementos da galeria
  const galleryGrid = document.getElementById("gallery-grid")
  const galleryFilter = document.getElementById("gallery-filter")
  const gallerySearch = document.getElementById("gallery-search")
  const gallerySearchBtn = document.getElementById("gallery-search-btn")
  const addGalleryItemBtn = document.getElementById("add-gallery-item")
  const galleryModal = document.getElementById("gallery-modal")
  const galleryModalTitle = document.getElementById("gallery-modal-title")
  const closeGalleryModal = document.getElementById("close-gallery-modal")
  const galleryForm = document.getElementById("gallery-form")
  const galleryModalCancel = document.getElementById("gallery-modal-cancel")
  const galleryModalSave = document.getElementById("gallery-modal-save")
  const galleryItemImage = document.getElementById("gallery-item-image")
  const imagePreview = document.getElementById("image-preview")
  const previewImage = document.getElementById("preview-image")

  // Variáveis para controlar edição
  let editingContentId = null
  let editingGalleryId = null
  let currentConfirmCallback = null

  // Import Quill library
  const Quill = window.Quill

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
  document.documentElement.classList.add("dark")
  darkModeToggle.checked = true

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

  // Event Listeners principais
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

  // Event listeners da galeria
  addGalleryItemBtn.addEventListener("click", openGalleryModal)
  closeGalleryModal.addEventListener("click", closeGalleryModalHandler)
  galleryModalCancel.addEventListener("click", closeGalleryModalHandler)
  galleryModalSave.addEventListener("click", saveGalleryItem)
  galleryFilter.addEventListener("change", filterGallery)
  gallerySearchBtn.addEventListener("click", searchGallery)
  gallerySearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchGallery()
    }
  })
  galleryItemImage.addEventListener("input", updateImagePreview)

  // Event listeners para o modal de confirmação
  modalCancel.addEventListener("click", closeConfirmationModal)
  closeModal.addEventListener("click", closeConfirmationModal)
  modalConfirm.addEventListener("click", () => {
    if (currentConfirmCallback) {
      currentConfirmCallback()
      closeConfirmationModal()
    }
  })

  // Fechar modais ao clicar fora
  confirmationModal.addEventListener("click", (e) => {
    if (e.target === confirmationModal) {
      closeConfirmationModal()
    }
  })

  galleryModal.addEventListener("click", (e) => {
    if (e.target === galleryModal) {
      closeGalleryModalHandler()
    }
  })

  // Escutar atualizações de conteúdo
  window.addEventListener("blogContentUpdated", () => {
    console.log("Conteúdo atualizado, recarregando...")
    loadContent()
    loadGallery()
  })

  // Funções principais
  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"

    if (isLoggedIn) {
      loginSection.classList.add("hidden")
      adminDashboard.classList.remove("hidden")
      loadContent()
      loadGallery()
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
      loadGallery()
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
      galleryTab.classList.add("hidden")
      createTab.classList.add("hidden")
      loadContent()
    } else if (tabName === "gallery") {
      contentTab.classList.add("hidden")
      galleryTab.classList.remove("hidden")
      createTab.classList.add("hidden")
      loadGallery()
    } else if (tabName === "create") {
      contentTab.classList.add("hidden")
      galleryTab.classList.add("hidden")
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

  // Funções de gerenciamento de conteúdo
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
    attachContentActionListeners()
  }

  function attachContentActionListeners() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        editContent(btn.getAttribute("data-id"))
      })
    })

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        viewContent(btn.getAttribute("data-id"))
      })
    })

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        deleteContent(btn.getAttribute("data-id"))
      })
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
      type,
      title,
      summary,
      category,
      icon,
      content,
    }

    // Adicionar campos específicos para artigos
    if (type === "article") {
      contentObj.author = document.getElementById("content-author").value || "Equipe ASCAMAREA"

      const tagsInput = document.getElementById("content-tags").value
      if (tagsInput) {
        contentObj.tags = tagsInput.split(",").map((tag) => tag.trim())
      }
    }

    // Verificar se é edição ou criação
    if (editingContentId) {
      // Atualizar conteúdo existente
      console.log("Editando conteúdo:", editingContentId)

      if (window.blogData) {
        const updated = window.blogData.updateContent(editingContentId, contentObj)
        if (updated) {
          showToast("Conteúdo atualizado com sucesso!")
          resetForm()
          // Voltar para a aba de gerenciamento
          document.querySelector('.admin-tab-btn[data-tab="content"]').click()
          loadContent()
        } else {
          showToast("Erro ao atualizar conteúdo.", true)
        }
      }
    } else {
      // Criar novo conteúdo
      console.log("Criando novo conteúdo")

      contentObj.id = generateSlug(title) + "-" + Date.now()
      contentObj.date = new Date().toISOString().split("T")[0]

      if (window.blogData) {
        const added = window.blogData.addContent(contentObj)
        if (added) {
          showToast("Conteúdo salvo com sucesso!")
          resetForm()
          // Voltar para a aba de gerenciamento
          document.querySelector('.admin-tab-btn[data-tab="content"]').click()
          loadContent()
        } else {
          showToast("Erro ao salvar conteúdo.", true)
        }
      }
    }
  }

  function editContent(id) {
    if (!window.blogData) return

    const content = window.blogData.getContentById(id)
    if (!content) {
      showToast("Conteúdo não encontrado.", true)
      return
    }

    console.log("Editando conteúdo:", id, content)

    // Definir ID de edição ANTES de mudar para a aba
    editingContentId = id

    // Mudar para a aba de criação
    document.querySelector('.admin-tab-btn[data-tab="create"]').click()

    // Aguardar um pouco para garantir que a aba foi carregada
    setTimeout(() => {
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

      // Mudar texto do botão
      const submitButton = document.querySelector('#content-form button[type="submit"]')
      if (submitButton) {
        submitButton.textContent = "Atualizar"
      }

      console.log("Formulário preenchido para edição, editingContentId:", editingContentId)
    }, 100)
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
    if (!content) {
      showToast("Conteúdo não encontrado.", true)
      return
    }

    console.log("Tentando excluir conteúdo:", id, content.title)

    showConfirmationModal(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir "${content.title}"? Esta ação não pode ser desfeita.`,
      () => {
        console.log("Confirmação de exclusão para:", id)
        const deleted = window.blogData.deleteContent(id)
        if (deleted) {
          console.log("Conteúdo excluído com sucesso:", deleted.title)
          showToast("Conteúdo excluído com sucesso!")
          loadContent(contentFilter.value, contentSearch.value)
        } else {
          console.error("Erro ao excluir conteúdo:", id)
          showToast("Erro ao excluir conteúdo.", true)
        }
      },
    )
  }

  // Funções de gerenciamento da galeria
  function loadGallery(filter = "all", searchQuery = "") {
    if (!window.blogData || !window.blogData.getAllGalleryItems) {
      showToast("Erro ao carregar dados da galeria.", true)
      return
    }

    let items = window.blogData.getAllGalleryItems()

    // Aplicar filtro de categoria
    if (filter !== "all") {
      items = items.filter((item) => item.category === filter)
    }

    // Aplicar busca se houver
    if (searchQuery) {
      searchQuery = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery),
      )
    }

    // Limpar grid
    galleryGrid.innerHTML = ""

    if (items.length === 0) {
      galleryGrid.innerHTML = `
        <div class="empty-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
          <p>Nenhum item encontrado na galeria.</p>
        </div>
      `
      return
    }

    // Preencher grid
    items.forEach((item) => {
      const date = new Date(item.date)
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

      const itemElement = document.createElement("div")
      itemElement.className = "gallery-admin-item"
      itemElement.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}" class="gallery-admin-image" onerror="this.src='https://via.placeholder.com/400x300?text=Imagem+não+encontrada'">
        <div class="gallery-admin-content">
          <h4 class="gallery-admin-title">${item.title}</h4>
          <p class="gallery-admin-description">${item.description}</p>
          <div class="gallery-admin-meta">
            <span class="gallery-admin-category">${item.category}</span>
            <span>${formattedDate}</span>
          </div>
          <div class="gallery-admin-actions">
            <button class="btn btn-sm btn-outline-green gallery-edit-btn" data-id="${item.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-green gallery-delete-btn" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `

      galleryGrid.appendChild(itemElement)
    })

    // Adicionar event listeners para os botões de ação da galeria
    attachGalleryActionListeners()
  }

  function attachGalleryActionListeners() {
    document.querySelectorAll(".gallery-edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        editGalleryItem(btn.getAttribute("data-id"))
      })
    })

    document.querySelectorAll(".gallery-delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        deleteGalleryItem(btn.getAttribute("data-id"))
      })
    })
  }

  function filterGallery() {
    const filter = galleryFilter.value
    const searchQuery = gallerySearch.value
    loadGallery(filter, searchQuery)
  }

  function searchGallery() {
    const filter = galleryFilter.value
    const searchQuery = gallerySearch.value
    loadGallery(filter, searchQuery)
  }

  function openGalleryModal(id = null) {
    editingGalleryId = id

    if (id) {
      // Modo edição
      const item = window.blogData.getGalleryItemById(id)
      if (!item) {
        showToast("Item da galeria não encontrado.", true)
        return
      }

      galleryModalTitle.textContent = "Editar Item da Galeria"
      document.getElementById("gallery-item-title").value = item.title
      document.getElementById("gallery-item-description").value = item.description
      document.getElementById("gallery-item-category").value = item.category
      document.getElementById("gallery-item-image").value = item.imageUrl
      updateImagePreview()
    } else {
      // Modo criação
      galleryModalTitle.textContent = "Adicionar Item à Galeria"
      galleryForm.reset()
      imagePreview.classList.add("hidden")
    }

    galleryModal.classList.remove("hidden")
  }

  function closeGalleryModalHandler() {
    galleryModal.classList.add("hidden")
    editingGalleryId = null
    galleryForm.reset()
    imagePreview.classList.add("hidden")
  }

  function updateImagePreview() {
    const imageUrl = galleryItemImage.value
    if (imageUrl) {
      previewImage.src = imageUrl
      previewImage.onload = () => {
        imagePreview.classList.remove("hidden")
      }
      previewImage.onerror = () => {
        imagePreview.classList.add("hidden")
      }
    } else {
      imagePreview.classList.add("hidden")
    }
  }

  function saveGalleryItem() {
    const title = document.getElementById("gallery-item-title").value
    const description = document.getElementById("gallery-item-description").value
    const category = document.getElementById("gallery-item-category").value
    const imageUrl = document.getElementById("gallery-item-image").value

    // Validar campos obrigatórios
    if (!title || !description || !category || !imageUrl) {
      showToast("Por favor, preencha todos os campos obrigatórios.", true)
      return
    }

    const itemObj = {
      title,
      description,
      category,
      imageUrl,
    }

    if (editingGalleryId) {
      // Atualizar item existente
      const updated = window.blogData.updateGalleryItem(editingGalleryId, itemObj)
      if (updated) {
        showToast("Item da galeria atualizado com sucesso!")
        closeGalleryModalHandler()
        loadGallery()
      } else {
        showToast("Erro ao atualizar item da galeria.", true)
      }
    } else {
      // Criar novo item
      itemObj.id = generateSlug(title) + "-" + Date.now()
      itemObj.date = new Date().toISOString().split("T")[0]

      const added = window.blogData.addGalleryItem(itemObj)
      if (added) {
        showToast("Item adicionado à galeria com sucesso!")
        closeGalleryModalHandler()
        loadGallery()
      } else {
        showToast("Erro ao adicionar item à galeria.", true)
      }
    }
  }

  function editGalleryItem(id) {
    openGalleryModal(id)
  }

  function deleteGalleryItem(id) {
    if (!window.blogData) return

    const item = window.blogData.getGalleryItemById(id)
    if (!item) {
      showToast("Item da galeria não encontrado.", true)
      return
    }

    showConfirmationModal(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir "${item.title}" da galeria? Esta ação não pode ser desfeita.`,
      () => {
        const deleted = window.blogData.deleteGalleryItem(id)
        if (deleted) {
          showToast("Item removido da galeria com sucesso!")
          loadGallery(galleryFilter.value, gallerySearch.value)
        } else {
          showToast("Erro ao remover item da galeria.", true)
        }
      },
    )
  }

  // Funções auxiliares
  function resetForm() {
    contentForm.reset()
    quill.root.innerHTML = ""
    editingContentId = null

    // Resetar texto do botão
    const submitButton = document.querySelector('#content-form button[type="submit"]')
    if (submitButton) {
      submitButton.textContent = "Salvar"
    }

    // Resetar ícone
    contentIconInput.value = "fa-recycle"
    selectedIconPreview.className = "fas fa-recycle"

    // Esconder preview
    contentPreview.classList.add("hidden")
    previewBtn.innerHTML = '<i class="fas fa-eye"></i> Visualizar'

    // Esconder campos de artigo
    articleFields.classList.add("hidden")

    console.log("Formulário resetado, editingContentId:", editingContentId)
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
    console.log("Mostrando modal de confirmação:", title)

    modalTitle.textContent = title
    modalMessage.textContent = message

    // Armazenar o callback atual
    currentConfirmCallback = confirmCallback

    // Mostrar modal
    confirmationModal.classList.remove("hidden")
  }

  function closeConfirmationModal() {
    console.log("Fechando modal de confirmação")

    // Limpar callback
    currentConfirmCallback = null

    // Esconder modal
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
})
