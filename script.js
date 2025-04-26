document.addEventListener("DOMContentLoaded", () => {
  // Dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle")
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

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobileMenuButton")
  const mobileMenu = document.getElementById("mobileMenu")

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
  })

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
      const tabButton = document.querySelector(`.tab-btn[data-tab="${targetId}"]`)
      if (tabButton) {
        // Click the tab button to activate the tab
        tabButton.click()

        // Scroll to the tab section
        const tabsSection = document.querySelector(".tabs")
        tabsSection.scrollIntoView({ behavior: "smooth" })

        // Close mobile menu if open
        if (!mobileMenu.classList.contains("hidden")) {
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

      const tabContent = document.getElementById(`${tabName}-tab`)
      if (tabContent) {
        tabContent.classList.remove("hidden")
      }

      // Initialize specific tab content
      if (tabName === "gamificacao") {
        initializeQuizGame()
      } else if (tabName === "calendario") {
        generateCalendar()
      } else if (tabName === "blog") {
        // Verificar se estamos na página index ou se devemos redirecionar
        if (
          window.location.pathname.includes("index.html") ||
          window.location.pathname === "/" ||
          window.location.pathname.endsWith("/")
        ) {
          window.location.href = "blog.html"
        } else {
          loadBlogContent()
        }
      } else if (tabName === "mapa") {
        initializeMap()
      } else if (tabName === "sobre") {
        // Não precisa de inicialização especial
      }
    })
  })

  // Verificar se há uma aba especificada na URL (por exemplo, index.html?tab=calendario)
  const urlParams = new URLSearchParams(window.location.search)
  const tabParam = urlParams.get("tab")

  if (tabParam) {
    // Tentar encontrar o botão da aba correspondente
    const tabButton = document.querySelector(`.tab-btn[data-tab="${tabParam}"]`)
    if (tabButton) {
      // Simular um clique no botão da aba
      tabButton.click()
    }
  } else {
    // Se não houver parâmetro, ativar a primeira aba por padrão
    const firstTabButton = document.querySelector(".tab-btn")
    if (firstTabButton) {
      firstTabButton.click()
    }
  }

  // Carregar conteúdo do blog dinamicamente
  function loadBlogContent() {
    const blogTab = document.getElementById("blog-tab")
    if (!blogTab) return

    // Verificar se o conteúdo já foi carregado
    if (blogTab.getAttribute("data-loaded") === "true") return

    // Marcar como carregado
    blogTab.setAttribute("data-loaded", "true")

    // Obter os elementos onde os posts serão exibidos
    const blogPostsContainer = document.getElementById("blog-posts-container")
    const announcementsContainer = document.getElementById("announcements-container")

    if (!blogPostsContainer || !announcementsContainer) return

    // Limpar conteúdo existente
    blogPostsContainer.innerHTML = ""
    announcementsContainer.innerHTML = ""

    // Verificar se o objeto blogData está disponível
    if (typeof window.blogData === "undefined") {
      console.error("Dados do blog não estão disponíveis")
      loadBlogDataScript()
      return
    }

    // Obter todos os artigos
    const articles = window.blogData.getContentByType("article")

    // Obter comunicados
    const announcements = window.blogData.getContentByType("announcement")

    // Exibir comunicados (se houver)
    if (announcements && announcements.length > 0) {
      announcementsContainer.innerHTML = `
        <h3 class="section-title">Comunicados Recentes</h3>
        <div class="announcements-list">
          ${announcements.map((announcement) => createAnnouncementElement(announcement)).join("")}
        </div>
      `
    } else {
      announcementsContainer.style.display = "none"
    }

    // Exibir artigos
    if (articles && articles.length > 0) {
      const articlesHTML = articles.map((article) => createBlogPostElement(article)).join("")
      blogPostsContainer.innerHTML = `
        <h3 class="section-title">Artigos</h3>
        <div class="blog-posts-grid">
          ${articlesHTML}
        </div>
      `
    } else {
      blogPostsContainer.innerHTML = '<div class="empty-message">Nenhum artigo disponível no momento.</div>'
    }

    // Adicionar event listeners para os botões de filtro do blog
    const blogTabButtons = document.querySelectorAll(".blog-tab-btn")
    blogTabButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Atualizar botão ativo
        blogTabButtons.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")

        // Filtrar conteúdo
        const contentType = this.getAttribute("data-content-type")
        filterBlogContent(contentType)
      })
    })
  }

  // Função para filtrar conteúdo do blog
  function filterBlogContent(contentType) {
    const announcementsContainer = document.getElementById("announcements-container")
    const blogPostsContainer = document.getElementById("blog-posts-container")

    if (!announcementsContainer || !blogPostsContainer) return

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

  // Função para criar elemento de post do blog
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

  // Função para carregar o script de dados do blog
  function loadBlogDataScript() {
    if (document.querySelector('script[src="data/content.js"]')) {
      return // Script já foi carregado
    }

    const script = document.createElement("script")
    script.src = "data/content.js"
    script.onload = () => {
      // Inicializar o conteúdo do blog se estiver na aba do blog
      const activeTab = document.querySelector(".tab-btn.active")
      if (activeTab && activeTab.getAttribute("data-tab") === "blog") {
        loadBlogContent()
      }
    }
    document.body.appendChild(script)
  }

  // Calendar generation
  function generateCalendar() {
    console.log("Calendar generated")
    // Implementação do calendário
    const calendarContainer = document.getElementById("calendar-container")
    if (!calendarContainer) return

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Criar o calendário
    const calendar = document.createElement("div")
    calendar.className = "calendar"

    // Cabeçalho do calendário
    const header = document.createElement("div")
    header.className = "calendar-header"

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

    header.innerHTML = `
      <button id="prev-month" class="calendar-nav-btn"><i class="fas fa-chevron-left"></i></button>
      <h3 id="month-display">${monthNames[currentMonth]} ${currentYear}</h3>
      <button id="next-month" class="calendar-nav-btn"><i class="fas fa-chevron-right"></i></button>
    `

    calendar.appendChild(header)

    // Dias da semana
    const weekdays = document.createElement("div")
    weekdays.className = "weekdays"

    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    days.forEach((day) => {
      const dayElem = document.createElement("div")
      dayElem.className = "weekday"
      dayElem.textContent = day
      weekdays.appendChild(dayElem)
    })

    calendar.appendChild(weekdays)

    // Dias do mês
    const daysContainer = document.createElement("div")
    daysContainer.className = "days"
    daysContainer.id = "calendar-days"

    // Preencher os dias
    updateCalendarDays(daysContainer, currentMonth, currentYear)

    calendar.appendChild(daysContainer)

    // Limpar e adicionar o calendário ao container
    calendarContainer.innerHTML = ""
    calendarContainer.appendChild(calendar)

    // Adicionar event listeners para navegação
    document.getElementById("prev-month").addEventListener("click", () => {
      const monthDisplay = document.getElementById("month-display")
      const [month, year] = monthDisplay.textContent.split(" ")
      const monthIndex = monthNames.indexOf(month)

      let newMonth = monthIndex - 1
      let newYear = Number.parseInt(year)

      if (newMonth < 0) {
        newMonth = 11
        newYear--
      }

      monthDisplay.textContent = `${monthNames[newMonth]} ${newYear}`
      updateCalendarDays(daysContainer, newMonth, newYear)
    })

    document.getElementById("next-month").addEventListener("click", () => {
      const monthDisplay = document.getElementById("month-display")
      const [month, year] = monthDisplay.textContent.split(" ")
      const monthIndex = monthNames.indexOf(month)

      let newMonth = monthIndex + 1
      let newYear = Number.parseInt(year)

      if (newMonth > 11) {
        newMonth = 0
        newYear++
      }

      monthDisplay.textContent = `${monthNames[newMonth]} ${newYear}`
      updateCalendarDays(daysContainer, newMonth, newYear)
    })
  }

  function updateCalendarDays(container, month, year) {
    container.innerHTML = ""

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1)
    const startingDay = firstDay.getDay()

    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0)
    const totalDays = lastDay.getDate()

    // Dias do mês anterior para preencher a primeira semana
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    // Eventos do mês (exemplo)
    const events = [
      { day: 5, title: "Coleta Seletiva", type: "coleta" },
      { day: 12, title: "Coleta Seletiva", type: "coleta" },
      { day: 15, title: "Reunião Mensal", type: "reuniao" },
      { day: 19, title: "Coleta Seletiva", type: "coleta" },
      { day: 26, title: "Coleta Seletiva", type: "coleta" },
    ]

    // Preencher dias do mês anterior
    for (let i = startingDay - 1; i >= 0; i--) {
      const day = document.createElement("div")
      day.className = "day prev-month-day"
      day.textContent = prevMonthLastDay - i
      container.appendChild(day)
    }

    // Preencher dias do mês atual
    const today = new Date()
    const currentDay = today.getDate()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    for (let i = 1; i <= totalDays; i++) {
      const day = document.createElement("div")
      day.className = "day"

      // Destacar o dia atual
      if (i === currentDay && month === currentMonth && year === currentYear) {
        day.classList.add("today")
      }

      day.textContent = i

      // Verificar se há eventos neste dia
      const dayEvents = events.filter((event) => event.day === i)
      if (dayEvents.length > 0) {
        day.classList.add("has-event")

        // Adicionar indicadores de evento
        const eventIndicators = document.createElement("div")
        eventIndicators.className = "event-indicators"

        dayEvents.forEach((event) => {
          const indicator = document.createElement("span")
          indicator.className = `event-indicator ${event.type}`
          indicator.title = event.title
          eventIndicators.appendChild(indicator)
        })

        day.appendChild(eventIndicators)

        // Adicionar tooltip com detalhes do evento
        day.setAttribute("data-tooltip", dayEvents.map((e) => e.title).join(", "))

        // Adicionar event listener para mostrar detalhes
        day.addEventListener("click", () => {
          showEventDetails(i, month, year, dayEvents)
        })
      }

      container.appendChild(day)
    }

    // Calcular quantos dias do próximo mês precisamos para completar a grade
    const totalCells = Math.ceil((startingDay + totalDays) / 7) * 7
    const nextMonthDays = totalCells - (startingDay + totalDays)

    // Preencher dias do próximo mês
    for (let i = 1; i <= nextMonthDays; i++) {
      const day = document.createElement("div")
      day.className = "day next-month-day"
      day.textContent = i
      container.appendChild(day)
    }
  }

  function showEventDetails(day, month, year, events) {
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

    const eventDetails = document.getElementById("event-details") || document.createElement("div")
    eventDetails.id = "event-details"
    eventDetails.className = "event-details"

    eventDetails.innerHTML = `
      <div class="event-details-header">
        <h4>Eventos do dia ${day} de ${monthNames[month]} de ${year}</h4>
        <button class="close-btn">&times;</button>
      </div>
      <div class="event-list">
        ${events
          .map(
            (event) => `
          <div class="event-item ${event.type}">
            <div class="event-time">10:00</div>
            <div class="event-info">
              <div class="event-title">${event.title}</div>
              <div class="event-description">Detalhes sobre ${event.title.toLowerCase()}</div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `

    // Adicionar ao DOM se ainda não estiver
    const calendarContainer = document.getElementById("calendar-container")
    if (!document.getElementById("event-details")) {
      calendarContainer.appendChild(eventDetails)
    }

    // Adicionar event listener para fechar
    eventDetails.querySelector(".close-btn").addEventListener("click", () => {
      eventDetails.remove()
    })
  }

  // Quiz Game
  function initializeQuizGame() {
    console.log("Quiz game initialized")
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
    const timeBar = document.getElementById("time-bar")
    const questionHeaderElement = document.querySelector(".question-header")

    if (!gameStartScreen || !gameQuestionScreen || !gameResultScreen) {
      console.log("Quiz elements not found")
      return
    }

    // Armazenar respostas erradas para mostrar no final
    let wrongQuestions = []

    // Remover a barra de tempo visível
    if (questionHeaderElement && timeBar) {
      const timeBarContainer = document.querySelector(".time-bar-container")
      if (timeBarContainer) {
        timeBarContainer.style.display = "none"
      }
    }

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

    // Initialize game
    if (startButton) {
      startButton.addEventListener("click", startGame)
    }
    if (restartButton) {
      restartButton.addEventListener("click", startGame)
    }
    if (shareButton) {
      shareButton.addEventListener("click", shareResults)
    }

    function startGame() {
      // Reset game state
      currentQuestionIndex = 0
      score = 0
      correctAnswers = 0
      wrongAnswers = 0
      wrongQuestions = []
      gameStartTime = Date.now()

      // Update displays
      if (scoreDisplay) scoreDisplay.textContent = "0"

      // Show question screen
      gameStartScreen.classList.add("hidden")
      gameResultScreen.classList.add("hidden")
      gameQuestionScreen.classList.remove("hidden")

      // Set total questions
      if (totalQuestionsDisplay) totalQuestionsDisplay.textContent = questions.length

      // Show first question
      showQuestion(questions[currentQuestionIndex])
    }

    function showQuestion(question) {
      // Update question number
      if (currentQuestionDisplay) currentQuestionDisplay.textContent = currentQuestionIndex + 1

      // Set question text
      if (questionText) questionText.textContent = question.question

      // Clear previous answers
      if (answersContainer) answersContainer.innerHTML = ""

      // Add answer options
      if (answersContainer) {
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
            selectAnswer(answer, answerButton, index)
          })

          answersContainer.appendChild(answerButton)
        })
      }

      // Start timer (invisível para o usuário, mas ainda rastreando o tempo)
      startTimer()
    }

    function startTimer() {
      // Reset timer
      clearInterval(timer)
      timeLeft = 100

      // Manter a barra de tempo oculta, mas ainda rastrear o tempo
      if (timeBar) {
        timeBar.style.width = "100%"
      }

      // Start countdown
      timer = setInterval(() => {
        timeLeft -= 1

        // Atualizar a barra de tempo (invisível)
        if (timeBar) {
          timeBar.style.width = `${timeLeft}%`
        }

        if (timeLeft <= 0) {
          clearInterval(timer)
          wrongAnswers++
          wrongQuestions.push({
            questionIndex: currentQuestionIndex,
            question: questions[currentQuestionIndex].question,
            correctAnswerIndex: questions[currentQuestionIndex].answers.findIndex((a) => a.correct),
            userAnswerIndex: -1,
            timeOut: true,
          })

          nextQuestion()
        }
      }, 100) // 10 seconds total (100 * 100ms)
    }

    function selectAnswer(answer, selectedButton, answerIndex) {
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
        if (scoreDisplay) scoreDisplay.textContent = score
        correctAnswers++
      } else {
        selectedButton.classList.add("incorrect")
        wrongAnswers++

        const correctAnswerIndex = questions[currentQuestionIndex].answers.findIndex((a) => a.correct)
        wrongQuestions.push({
          questionIndex: currentQuestionIndex,
          question: questions[currentQuestionIndex].question,
          correctAnswerIndex: correctAnswerIndex,
          userAnswerIndex: answerIndex,
          correctAnswer: questions[currentQuestionIndex].answers[correctAnswerIndex].text,
          userAnswer: answer.text,
          timeOut: false,
        })
        allAnswers.forEach((button, idx) => {
          if (questions[currentQuestionIndex].answers[idx].correct) {
            button.classList.add("correct")
          }
        })
      }
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
      if (finalScoreDisplay) finalScoreDisplay.textContent = score
      if (correctAnswersDisplay) correctAnswersDisplay.textContent = correctAnswers
      if (wrongAnswersDisplay) wrongAnswersDisplay.textContent = wrongAnswers
      if (timeTakenDisplay) timeTakenDisplay.textContent = `${timeTaken}s`

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

      // Mostrar respostas erradas
      const wrongAnswersSection = document.createElement("div")
      wrongAnswersSection.className = "wrong-answers-section"

      if (wrongQuestions.length > 0) {
        wrongAnswersSection.innerHTML = `
          <h4>Respostas Incorretas:</h4>
          <div class="wrong-answers-list">
            ${wrongQuestions
              .map(
                (item) => `
              <div class="wrong-answer-item">
                <p><strong>Pergunta ${item.questionIndex + 1}:</strong> ${item.question}</p>
                ${
                  item.timeOut
                    ? `<p class="text-red">Tempo esgotado</p>`
                    : `<p>Sua resposta: <span class="text-red">${item.userAnswer}</span></p>`
                }
                <p>Resposta correta: <span class="text-green">${item.correctAnswer}</span></p>
              </div>
            `,
              )
              .join("")}
          </div>
        `
      } else {
        wrongAnswersSection.innerHTML = `
          <h4>Parabéns!</h4>
          <p>Você acertou todas as perguntas!</p>
        `
      }

      // Adicionar a seção de respostas erradas ao resultado
      const resultActions = document.querySelector(".result-actions")
      if (resultActions) {
        const existingSection = document.querySelector(".wrong-answers-section")
        if (existingSection) {
          existingSection.remove()
        }
        resultActions.parentNode.insertBefore(wrongAnswersSection, resultActions)
      }
      gameQuestionScreen.classList.add("hidden")
      gameResultScreen.classList.remove("hidden")
    }
    function shareResults() {
      alert(
        `Compartilhei minha pontuação no Desafio de Reciclagem: ${score} pontos! Venha testar seus conhecimentos sobre reciclagem em ascamarea.org`,
      )
    }
  }

  // Função para inicializar o mapa
  function initializeMap() {
    console.log("Map initialized")
    const mapContainer = document.getElementById("map-container")
    if (!mapContainer) return
    if (mapContainer.querySelector(".map-content")) return
    const mapContent = document.createElement("div")
    mapContent.className = "map-content"
    mapContent.innerHTML = `
      <div class="map-header">
        <h3>Pontos de Coleta</h3>
        <div class="map-filters">
          <button class="map-filter-btn active" data-filter="all">Todos</button>
          <button class="map-filter-btn" data-filter="paper">Papel</button>
          <button class="map-filter-btn" data-filter="plastic">Plástico</button>
          <button class="map-filter-btn" data-filter="glass">Vidro</button>
          <button class="map-filter-btn" data-filter="metal">Metal</button>
          <button class="map-filter-btn" data-filter="electronic">Eletrônicos</button>
        </div>
      </div>
      <div class="map-view">
        <div class="map-placeholder">
          <i class="fas fa-map-marked-alt"></i>
          <p>Mapa de pontos de coleta será exibido aqui.</p>
          <p class="map-note">Nota: Em uma implementação real, este seria um mapa interativo usando Google Maps ou Leaflet.</p>
        </div>
        <div class="map-legend">
          <h4>Legenda</h4>
          <ul>
            <li><span class="legend-marker paper"></span> Papel</li>
            <li><span class="legend-marker plastic"></span> Plástico</li>
            <li><span class="legend-marker glass"></span> Vidro</li>
            <li><span class="legend-marker metal"></span> Metal</li>
            <li><span class="legend-marker electronic"></span> Eletrônicos</li>
          </ul>
        </div>
      </div>
      <div class="collection-points">
        <h4>Pontos de Coleta Próximos</h4>
        <div class="collection-points-list">
          <div class="collection-point-item" data-types="paper,plastic,glass">
            <div class="collection-point-icon">
              <i class="fas fa-recycle"></i>
            </div>
            <div class="collection-point-info">
              <h5>Ecoponto Central</h5>
              <p>Av. Principal, 1000 - Centro</p>
              <div class="collection-point-types">
                <span class="point-type paper">Papel</span>
                <span class="point-type plastic">Plástico</span>
                <span class="point-type glass">Vidro</span>
              </div>
              <p class="collection-point-hours"><i class="fas fa-clock"></i> Seg-Sex: 8h às 17h</p>
            </div>
          </div>
          <div class="collection-point-item" data-types="metal,electronic">
            <div class="collection-point-icon">
              <i class="fas fa-laptop"></i>
            </div>
            <div class="collection-point-info">
              <h5>Ponto de Coleta Eletrônica</h5>
              <p>Rua Tecnologia, 500 - Bairro Novo</p>
              <div class="collection-point-types">
                <span class="point-type metal">Metal</span>
                <span class="point-type electronic">Eletrônicos</span>
              </div>
              <p class="collection-point-hours"><i class="fas fa-clock"></i> Ter-Sáb: 9h às 18h</p>
            </div>
          </div>
          <div class="collection-point-item" data-types="paper,plastic">
            <div class="collection-point-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="collection-point-info">
              <h5>Supermercado Verde</h5>
              <p>Av. Sustentável, 230 - Jardim Ecológico</p>
              <div class="collection-point-types">
                <span class="point-type paper">Papel</span>
                <span class="point-type plastic">Plástico</span>
              </div>
              <p class="collection-point-hours"><i class="fas fa-clock"></i> Todos os dias: 8h às 22h</p>
            </div>
          </div>
        </div>
      </div>
    `

    mapContainer.appendChild(mapContent)

    // Adicionar event listeners para os filtros
    const filterButtons = mapContainer.querySelectorAll(".map-filter-btn")
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Atualizar botão ativo
        filterButtons.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")

        // Filtrar pontos de coleta
        const filter = this.getAttribute("data-filter")
        filterCollectionPoints(filter)
      })
    })

    function filterCollectionPoints(filter) {
      const points = mapContainer.querySelectorAll(".collection-point-item")

      points.forEach((point) => {
        const types = point.getAttribute("data-types").split(",")

        if (filter === "all" || types.includes(filter)) {
          point.style.display = ""
        } else {
          point.style.display = "none"
        }
      })
    }
  }

  // Carregar dados do blog
  loadBlogDataScript()
})
