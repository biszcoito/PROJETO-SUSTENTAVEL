// Variável para controlar se os scripts já foram inicializados
let scriptsInitialized = false

document.addEventListener("DOMContentLoaded", () => {
  // Evitar inicialização múltipla
  if (scriptsInitialized) {
    return
  }
  scriptsInitialized = true

  console.log("Inicializando scripts...")

  // Dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle")

  if (darkModeToggle) {
    // Check for saved dark mode preference
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
  }

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobileMenuButton")
  const mobileMenu = document.getElementById("mobileMenu")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  // Navigation links smooth scrolling
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Não previna o comportamento padrão se for um link para outra página
      if (this.getAttribute("href").includes(".html")) {
        return
      }

      e.preventDefault()

      // Get the target tab ID from the href
      const targetId = this.getAttribute("href").substring(1)

      // Find the tab button
      const tabButton = document.getElementById(targetId)
      if (tabButton) {
        // Click the tab button to activate the tab
        tabButton.click()

        // Scroll to the tab section
        const tabsSection = document.querySelector(".tabs")
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: "smooth" })
        }

        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden")
        }
      }
    })
  })

  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((btn) => {
        btn.classList.remove("active")
      })

      this.classList.add("active")

      // Show selected tab content
      tabContents.forEach((content) => {
        content.classList.add("hidden")
      })

      const targetTab = document.getElementById(`${tabName}-tab`)
      if (targetTab) {
        targetTab.classList.remove("hidden")
      }

      // Initialize specific tab content
      try {
        if (tabName === "gamificacao") {
          initializeQuizGame()
        } else if (tabName === "calendario") {
          generateCalendar()
        } else if (tabName === "blog") {
          loadBlogContent()
        } else if (tabName === "galeria") {
          loadGalleryContent()
        }
      } catch (error) {
        console.error("Erro ao inicializar aba:", error)
      }
    })
  })

  // Escutar atualizações de conteúdo do blog
  window.addEventListener("blogContentUpdated", () => {
    console.log("Conteúdo do blog atualizado, recarregando aba blog...")
    const blogTab = document.getElementById("blog-tab")
    if (blogTab) {
      blogTab.setAttribute("data-loaded", "false")
      // Se a aba blog estiver ativa, recarregar
      const activeBlogTab = document.querySelector('.tab-btn[data-tab="blog"].active')
      if (activeBlogTab) {
        loadBlogContent()
      }
    }

    // Recarregar galeria também
    const galeriaTab = document.getElementById("galeria-tab")
    if (galeriaTab) {
      galeriaTab.setAttribute("data-loaded", "false")
      // Se a aba galeria estiver ativa, recarregar
      const activeGaleriaTab = document.querySelector('.tab-btn[data-tab="galeria"].active')
      if (activeGaleriaTab) {
        loadGalleryContent()
      }
    }
  })

  // Carregar conteúdo da galeria dinamicamente
  function loadGalleryContent() {
    const galeriaTab = document.getElementById("galeria-tab")
    if (!galeriaTab) return

    // Verificar se o conteúdo já foi carregado
    const forceReload = galeriaTab.getAttribute("data-loaded") === "false"
    if (galeriaTab.getAttribute("data-loaded") === "true" && !forceReload) return

    // Marcar como carregado
    galeriaTab.setAttribute("data-loaded", "true")

    // Obter o elemento onde os itens da galeria serão exibidos
    const galeriaContainer = galeriaTab.querySelector(".card-body .row")
    if (!galeriaContainer) return

    // Limpar conteúdo existente
    galeriaContainer.innerHTML = ""

    // Verificar se o objeto blogData está disponível
    if (typeof window.blogData === "undefined" || !window.blogData.getAllGalleryItems) {
      console.warn("Dados da galeria não estão disponíveis ainda")
      galeriaContainer.innerHTML = '<div class="empty-message">Carregando galeria...</div>'

      // Tentar carregar novamente após um breve delay
      setTimeout(() => {
        if (typeof window.blogData !== "undefined" && window.blogData.getAllGalleryItems) {
          galeriaTab.setAttribute("data-loaded", "false")
          loadGalleryContent()
        }
      }, 1000)
      return
    }

    try {
      // Recarregar dados do localStorage para garantir que temos a versão mais recente
      if (window.blogData.loadFromStorage) {
        window.blogData.loadFromStorage()
      }

      // Obter todos os itens da galeria
      const galleryItems = window.blogData.getAllGalleryItems()

      if (galleryItems && galleryItems.length > 0) {
        galleryItems.forEach((item) => {
          const galleryItemElement = createGalleryItemElement(item)
          galeriaContainer.appendChild(galleryItemElement)
        })
      } else {
        galeriaContainer.innerHTML = '<div class="empty-message">Nenhum item disponível na galeria no momento.</div>'
      }

      console.log("Galeria carregada:", galleryItems.length, "itens")
    } catch (error) {
      console.error("Erro ao carregar galeria:", error)
      galeriaContainer.innerHTML = '<div class="empty-message">Erro ao carregar galeria.</div>'
    }
  }

  // Função para criar elemento de item da galeria
  function createGalleryItemElement(item) {
    const itemElement = document.createElement("article")
    itemElement.className = "card-img"

    itemElement.innerHTML = `
      <div class="image-area">
        <img class="ah" src="${item.imageUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/320x320?text=Imagem+não+encontrada'">
      </div>
      <span class="text-img">${item.description}</span>
    `

    return itemElement
  }

  // Carregar conteúdo do blog dinamicamente
  function loadBlogContent() {
    const blogTab = document.getElementById("blog-tab")
    if (!blogTab) return

    // Verificar se o conteúdo já foi carregado (permitir recarregamento forçado)
    const forceReload = blogTab.getAttribute("data-loaded") === "false"
    if (blogTab.getAttribute("data-loaded") === "true" && !forceReload) return

    // Marcar como carregado
    blogTab.setAttribute("data-loaded", "true")

    // Obter o elemento onde os posts serão exibidos
    const blogPostsGrid = blogTab.querySelector(".blog-posts-grid")
    if (!blogPostsGrid) return

    // Limpar conteúdo existente
    blogPostsGrid.innerHTML = ""

    // Verificar se o objeto blogData está disponível
    if (typeof window.blogData === "undefined") {
      console.warn("Dados do blog não estão disponíveis ainda")
      blogPostsGrid.innerHTML = '<div class="empty-message">Carregando conteúdo...</div>'

      // Tentar carregar novamente após um breve delay
      setTimeout(() => {
        if (typeof window.blogData !== "undefined") {
          blogTab.setAttribute("data-loaded", "false")
          loadBlogContent()
        }
      }, 1000)
      return
    }

    try {
      // Recarregar dados do localStorage para garantir que temos a versão mais recente
      if (window.blogData.loadFromStorage) {
        window.blogData.loadFromStorage()
      }

      // Obter todos os artigos
      const articles = window.blogData.getContentByType("article")

      // Obter comunicados
      const announcements = window.blogData.getContentByType("announcement")

      // Exibir comunicados primeiro (se houver)
      if (announcements && announcements.length > 0) {
        announcements.slice(0, 2).forEach((announcement) => {
          // Limitar a 2 comunicados
          blogPostsGrid.appendChild(createBlogPostElement(announcement))
        })
      }

      // Exibir artigos
      if (articles && articles.length > 0) {
        articles.slice(0, 4).forEach((article) => {
          // Limitar a 4 artigos
          blogPostsGrid.appendChild(createBlogPostElement(article))
        })
      }

      // Se não há conteúdo, mostrar mensagem
      if ((!articles || articles.length === 0) && (!announcements || announcements.length === 0)) {
        blogPostsGrid.innerHTML = '<div class="empty-message">Nenhum conteúdo disponível no momento.</div>'
      }

      console.log("Conteúdo do blog carregado:", articles.length, "artigos,", announcements.length, "comunicados")
    } catch (error) {
      console.error("Erro ao carregar conteúdo do blog:", error)
      blogPostsGrid.innerHTML = '<div class="empty-message">Erro ao carregar conteúdo do blog.</div>'
    }
  }

  // Função para criar elemento de post do blog
  function createBlogPostElement(content) {
    const postElement = document.createElement("div")
    postElement.className = "blog-post"

    // Adicionar classe especial para comunicados
    if (content.type === "announcement") {
      postElement.classList.add("announcement-post")
    }

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

    postElement.innerHTML = `
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
        <a href="content-view.html?id=${content.id}" class="btn btn-green">Ler ${content.type === "article" ? "artigo" : "comunicado"} completo</a>
      </div>
    `

    return postElement
  }

  // Calendar generation
  function generateCalendar() {
    const calendarDays = document.getElementById("calendar-days")
    const currentMonthElement = document.getElementById("current-month")

    if (!calendarDays || !currentMonthElement) return

    // Set up date handling
    const currentDate = new Date()
    let currentMonth = currentDate.getMonth()
    let currentYear = currentDate.getFullYear()

    // Collection events data (fictional)
    const collectionEvents = {
      // Format: "YYYY-MM-DD": ["event-type1", "event-type2"]
      "2023-07-03": ["paper"],
      "2023-07-05": ["plastic"],
      "2023-07-07": ["glass"],
      "2023-07-10": ["metal"],
      "2023-07-12": ["paper", "plastic"],
      "2023-07-14": ["electronic"],
      "2023-07-17": ["general"],
      "2023-07-19": ["paper"],
      "2023-07-21": ["plastic"],
      "2023-07-24": ["glass", "metal"],
      "2023-07-26": ["paper"],
      "2023-07-28": ["electronic"],
      "2023-07-31": ["general"],

      "2023-08-02": ["paper"],
      "2023-08-04": ["plastic"],
      "2023-08-07": ["glass"],
      "2023-08-09": ["metal"],
      "2023-08-11": ["paper", "plastic"],
      "2023-08-14": ["electronic"],
      "2023-08-16": ["general"],
      "2023-08-18": ["paper"],
      "2023-08-21": ["plastic"],
      "2023-08-23": ["glass", "metal"],
      "2023-08-25": ["paper"],
      "2023-08-28": ["electronic"],
      "2023-08-30": ["general"],
    }

    // Event type colors
    const eventColors = {
      paper: "green",
      plastic: "red",
      glass: "blue",
      metal: "yellow",
      electronic: "purple",
      general: "gray",
    }

    function renderCalendar() {
      // Update month display
      const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ]
      currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`

      // Clear previous calendar
      calendarDays.innerHTML = ""

      // Get first day of month and total days
      const firstDay = new Date(currentYear, currentMonth, 1).getDay()
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

      // Add empty cells for days before the first day of month
      for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement("div")
        emptyDay.className = "calendar-day empty"
        calendarDays.appendChild(emptyDay)
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div")
        dayElement.className = "calendar-day"

        // Add day number
        const dayNumber = document.createElement("div")
        dayNumber.className = "day-number"
        dayNumber.textContent = day
        dayElement.appendChild(dayNumber)

        // Check for events on this day
        const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

        if (collectionEvents[dateString]) {
          const eventContainer = document.createElement("div")
          eventContainer.className = "event-dots"

          collectionEvents[dateString].forEach((eventType) => {
            const eventDot = document.createElement("span")
            eventDot.className = `event-dot ${eventColors[eventType]}`
            eventDot.title = eventType.charAt(0).toUpperCase() + eventType.slice(1)
            eventContainer.appendChild(eventDot)
          })

          dayElement.appendChild(eventContainer)
          dayElement.classList.add("has-events")

          // Add tooltip or popup functionality
          dayElement.addEventListener("click", () => {
            alert(`Coleta de ${collectionEvents[dateString].join(" e ")} em ${day}/${currentMonth + 1}/${currentYear}`)
          })
        }

        calendarDays.appendChild(dayElement)
      }
    }

    // Initialize calendar navigation
    const prevMonthButton = document.getElementById("prev-month")
    const nextMonthButton = document.getElementById("next-month")

    if (prevMonthButton && nextMonthButton) {
      // Remove event listeners anteriores
      prevMonthButton.replaceWith(prevMonthButton.cloneNode(true))
      nextMonthButton.replaceWith(nextMonthButton.cloneNode(true))

      // Reobter referências após clonagem
      const newPrevButton = document.getElementById("prev-month")
      const newNextButton = document.getElementById("next-month")

      newPrevButton.addEventListener("click", () => {
        currentMonth--
        if (currentMonth < 0) {
          currentMonth = 11
          currentYear--
        }
        renderCalendar()
      })

      newNextButton.addEventListener("click", () => {
        currentMonth++
        if (currentMonth > 11) {
          currentMonth = 0
          currentYear++
        }
        renderCalendar()
      })
    }

    // Initial render
    renderCalendar()
  }

  // Quiz Game
  function initializeQuizGame() {
    const gameStartScreen = document.getElementById("game-start-screen")
    const gameQuestionScreen = document.getElementById("game-question-screen")
    const gameResultScreen = document.getElementById("game-result-screen")
    const startButton = document.getElementById("game-start")
    const restartButton = document.getElementById("game-restart")
    const shareButton = document.getElementById("share-results")
    const scoreDisplay = document.getElementById("game-score")
    const finalScoreDisplay = document.getElementById("final-score")
    const correctAnswersDisplay = document.getElementById("correct-answers")
    const wrongAnswersDisplay = document.getElementById("wrong-answers")
    const timeTakenDisplay = document.getElementById("time-taken")
    const currentQuestionDisplay = document.getElementById("current-question")
    const totalQuestionsDisplay = document.getElementById("total-questions")
    const questionText = document.getElementById("question-text")
    const answersContainer = document.getElementById("answers-container")
   //const timeBar = document.getElementById("time-bar")

    if (
      !gameStartScreen ||
      !gameQuestionScreen ||
      !gameResultScreen ||
      !startButton ||
      !restartButton ||
      !scoreDisplay ||
      !finalScoreDisplay ||
      !answersContainer
    )
      return

    // Quiz questions
    const questions = [
      {
        question: "Qual destes materiais NÃO é reciclável?",
        answers: [
          { text: "Papel toalha usado", correct: true },
          { text: "Latas de alumínio", correct: false },
          { text: "Garrafas de vidro", correct: false },
          { text: "Embalagens de plástico", correct: false },
        ],
      },
      {
        question: "Qual a cor da lixeira para descarte de papel?",
        answers: [
          { text: "Verde", correct: false },
          { text: "Vermelho", correct: false },
          { text: "Azul", correct: true },
          { text: "Amarelo", correct: false },
        ],
      },
      {
        question: "Quanto tempo leva para uma garrafa PET se decompor na natureza?",
        answers: [
          { text: "Cerca de 5 anos", correct: false },
          { text: "Cerca de 100 anos", correct: false },
          { text: "Cerca de 400 anos", correct: true },
          { text: "Cerca de 1000 anos", correct: false },
        ],
      },
      {
        question: "O que significa a sigla 'PET' nas garrafas plásticas?",
        answers: [
          { text: "Polietileno Tereftalato", correct: true },
          { text: "Plástico Especial Tratado", correct: false },
          { text: "Polímero Ecológico Térmico", correct: false },
          { text: "Produto Específico Transparente", correct: false },
        ],
      },
      {
        question: "Qual destes NÃO é um benefício da reciclagem?",
        answers: [
          { text: "Redução do consumo de energia", correct: false },
          { text: "Diminuição da poluição do ar", correct: false },
          { text: "Aumento da extração de recursos naturais", correct: true },
          { text: "Geração de empregos", correct: false },
        ],
      },
      {
        question: "O que deve ser feito com pilhas e baterias usadas?",
        answers: [
          { text: "Jogar no lixo comum", correct: false },
          { text: "Enterrar no jardim", correct: false },
          { text: "Queimar", correct: false },
          { text: "Levar a pontos de coleta específicos", correct: true },
        ],
      },
      {
        question: "Qual é o processo de transformação de resíduos orgânicos em adubo?",
        answers: [
          { text: "Reciclagem", correct: false },
          { text: "Compostagem", correct: true },
          { text: "Incineração", correct: false },
          { text: "Destilação", correct: false },
        ],
      },
      {
        question: "Qual destes materiais demora mais tempo para se decompor?",
        answers: [
          { text: "Chiclete", correct: false },
          { text: "Isopor", correct: false },
          { text: "Vidro", correct: true },
          { text: "Plástico", correct: false },
        ],
      },
      {
        question: "O que é coleta seletiva?",
        answers: [
          { text: "Separação e recolhimento de resíduos para reciclagem", correct: true },
          { text: "Coleta de lixo apenas em dias específicos", correct: false },
          { text: "Seleção de materiais para incineração", correct: false },
          { text: "Recolhimento apenas de materiais orgânicos", correct: false },
        ],
      },
      {
        question: "Qual a principal vantagem da economia circular?",
        answers: [
          { text: "Aumentar o consumo de produtos", correct: false },
          { text: "Reduzir custos apenas para empresas", correct: false },
          { text: "Minimizar desperdícios e prolongar o ciclo de vida dos materiais", correct: true },
          { text: "Facilitar o descarte de produtos", correct: false },
        ],
      },
    ]

    let currentQuestionIndex = 0
    let score = 0
    let correctAnswers = 0
    let wrongAnswers = 0
    let timeLeft = 0
    let timer
    let gameStartTime

    // Remove event listeners anteriores
    const newStartButton = startButton.cloneNode(true)
    const newRestartButton = restartButton.cloneNode(true)
    const newShareButton = shareButton.cloneNode(true)

    startButton.parentNode.replaceChild(newStartButton, startButton)
    restartButton.parentNode.replaceChild(newRestartButton, restartButton)
    shareButton.parentNode.replaceChild(newShareButton, shareButton)

    // Initialize game
    newStartButton.addEventListener("click", startGame)
    newRestartButton.addEventListener("click", startGame)
    newShareButton.addEventListener("click", shareResults)

    function startGame() {
      // Reset game state
      currentQuestionIndex = 0
      score = 0
      correctAnswers = 0
      wrongAnswers = 0
      gameStartTime = Date.now()

      // Update displays
      scoreDisplay.textContent = "0"

      // Show question screen
      gameStartScreen.classList.add("hidden")
      gameResultScreen.classList.add("hidden")
      gameQuestionScreen.classList.remove("hidden")

      // Set total questions
      totalQuestionsDisplay.textContent = questions.length

      // Show first question
      showQuestion(questions[currentQuestionIndex])
    }

    function showQuestion(question) {
      // Update question number
      currentQuestionDisplay.textContent = currentQuestionIndex + 1

      // Set question text
      questionText.textContent = question.question

      // Clear previous answers
      answersContainer.innerHTML = ""

      // Add answer options
      question.answers.forEach((answer, index) => {
        const answerButton = document.createElement("div")
        answerButton.className = "answer-option"
        answerButton.innerHTML = `
          <div class="answer-content">
            <div class="answer-marker">
              <span>${String.fromCharCode(65 + index)}</span>
            </div>
            <span>${answer.text}</span>
          </div>
        `

        answerButton.addEventListener("click", () => {
          selectAnswer(answer, answerButton)
        })

        answersContainer.appendChild(answerButton)
      })

      // Start timer
      startTimer()
    }

    function startTimer() {
      // Reset timer
      clearInterval(timer)
      timeLeft = 100
      if (timeBar) {
        timeBar.style.width = "100%"
      }

      // Start countdown
      timer = setInterval(() => {
        timeLeft -= 1
        if (timeBar) {
          timeBar.style.width = `${timeLeft}%`
        }

        if (timeLeft <= 0) {
          clearInterval(timer)
          // Auto-select wrong answer if time runs out
          wrongAnswers++
          nextQuestion()
        }
      }, 100) // 10 seconds total (100 * 100ms)
    }

    function selectAnswer(answer, selectedButton) {
      // Stop timer
      clearInterval(timer)

      // Disable all answers
      const allAnswers = answersContainer.querySelectorAll(".answer-option")
      allAnswers.forEach((button) => {
        button.style.pointerEvents = "none"
      })

      // Mark selected answer
      selectedButton.classList.add("selected")

      // Check if answer is correct
      if (answer.correct) {
        selectedButton.classList.add("correct")
        // Add points
        score += 10 + Math.floor(timeLeft / 10) // More points for faster answers
        scoreDisplay.textContent = score
        correctAnswers++
      } else {
        selectedButton.classList.add("incorrect")
        wrongAnswers++

        // Show correct answer
        allAnswers.forEach((button) => {
          const buttonIndex = Array.from(allAnswers).indexOf(button)
          if (questions[currentQuestionIndex].answers[buttonIndex].correct) {
            button.classList.add("correct")
          }
        })
      }

      // Go to next question after delay
      setTimeout(() => {
        nextQuestion()
      }, 1500)
    }

    function nextQuestion() {
      currentQuestionIndex++

      if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex])
      } else {
        endGame()
      }
    }

    function endGame() {
      // Calculate time taken
      const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000)

      // Update result screen
      finalScoreDisplay.textContent = score
      correctAnswersDisplay.textContent = correctAnswers
      wrongAnswersDisplay.textContent = wrongAnswers
      timeTakenDisplay.textContent = `${timeTaken}s`

      // Show appropriate icon based on score
      const resultIcon = document.getElementById("result-icon")
      if (resultIcon) {
        if (score >= 80) {
          resultIcon.className = "fas fa-trophy text-yellow result-icon"
        } else if (score >= 50) {
          resultIcon.className = "fas fa-medal text-blue result-icon"
        } else {
          resultIcon.className = "fas fa-award text-gray result-icon"
        }
      }

      // Show result screen
      gameQuestionScreen.classList.add("hidden")
      gameResultScreen.classList.remove("hidden")
    }

    function shareResults() {
      // In a real app, this would share to social media
      alert(
        `Compartilhei minha pontuação no Desafio de Reciclagem: ${score} pontos! Venha testar seus conhecimentos sobre reciclagem em ascamarea.org`,
      )
    }
  }

  // Initialize the appropriate tab content based on the active tab
  try {
    const activeTab = document.querySelector(".tab-btn.active")
    if (activeTab) {
      const activeTabName = activeTab.getAttribute("data-tab")
      if (activeTabName === "gamificacao") {
        initializeQuizGame()
      } else if (activeTabName === "calendario") {
        generateCalendar()
      } else if (activeTabName === "blog") {
        loadBlogContent()
      } else if (activeTabName === "galeria") {
        loadGalleryContent()
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar aba ativa:", error)
  }

  console.log("Scripts inicializados com sucesso!")
})

// Prevenir múltiplas execuções do script
if (typeof window.scriptLoaded === "undefined") {
  window.scriptLoaded = true
} else {
  console.warn("Script já foi carregado anteriormente")
}
