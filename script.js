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

  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((btn) => {
        btn.classList.remove("bg-green-100", "dark:bg-green-800", "text-green-800", "dark:text-white", "font-bold")
        btn.classList.add("bg-gray-100", "dark:bg-gray-800")
      })

      this.classList.remove("bg-gray-100", "dark:bg-gray-800")
      this.classList.add("bg-green-100", "dark:bg-green-800", "text-green-800", "dark:text-white", "font-bold")

      // Show selected tab content
      tabContents.forEach((content) => {
        content.classList.add("hidden")
      })

      document.getElementById(`${tabName}-tab`).classList.remove("hidden")

      // Initialize game if gamificacao tab is selected
      if (tabName === "gamificacao") {
        initializeGame()
      }
    })
  })

  // Calendar generation
  function generateCalendarDays() {
    const calendarDays = document.getElementById("calendar-days")
    if (!calendarDays) return

    calendarDays.innerHTML = ""
    for (let i = 1; i <= 31; i++) {
      const dayElement = document.createElement("div")
      dayElement.className = `p-2 rounded-md ${
        [3, 8, 13, 18, 23, 28].includes(i)
          ? "bg-green-100 dark:bg-green-800"
          : [5, 10, 15, 20, 25, 30].includes(i)
            ? "bg-blue-100 dark:bg-blue-800"
            : "bg-white dark:bg-gray-800"
      }`
      dayElement.textContent = i
      calendarDays.appendChild(dayElement)
    }
  }

  // Recycling Game
  function initializeGame() {
    const gameContainer = document.getElementById("recycling-game")
    const itemsContainer = document.getElementById("recycling-items")
    const scoreDisplay = document.getElementById("game-score")
    const resetButton = document.getElementById("game-reset")
    const startButton = document.getElementById("game-start")

    if (!gameContainer || !itemsContainer || !scoreDisplay || !resetButton || !startButton) return

    let score = 0
    let gameStarted = false
    let currentItems = []

    const recyclableItems = [
      { type: "paper", name: "Jornal", color: "bg-blue-200" },
      { type: "paper", name: "Caderno", color: "bg-blue-200" },
      { type: "paper", name: "Revista", color: "bg-blue-200" },
      { type: "plastic", name: "Garrafa PET", color: "bg-red-200" },
      { type: "plastic", name: "Sacola", color: "bg-red-200" },
      { type: "plastic", name: "Embalagem", color: "bg-red-200" },
      { type: "glass", name: "Garrafa", color: "bg-green-200" },
      { type: "glass", name: "Pote", color: "bg-green-200" },
      { type: "glass", name: "Vidro", color: "bg-green-200" },
      { type: "metal", name: "Lata", color: "bg-yellow-200" },
      { type: "metal", name: "Tampa", color: "bg-yellow-200" },
      { type: "metal", name: "Alumínio", color: "bg-yellow-200" },
    ]

    function createItem(item) {
      const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      const itemElement = document.createElement("div")
      itemElement.id = itemId
      itemElement.className = `item p-3 rounded ${item.color} cursor-move shadow-md`
      itemElement.setAttribute("data-type", item.type)
      itemElement.setAttribute("draggable", "true")
      itemElement.textContent = item.name

      // Add drag event listeners
      itemElement.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", item.type)
        e.dataTransfer.setData("item-id", itemId)
        setTimeout(() => {
          this.classList.add("opacity-50")
        }, 0)
      })

      itemElement.addEventListener("dragend", function () {
        this.classList.remove("opacity-50")
      })

      return itemElement
    }

    function setupBins() {
      const bins = document.querySelectorAll(".bin-container")

      bins.forEach((bin) => {
        bin.addEventListener("dragover", function (e) {
          e.preventDefault()
          this.classList.add("ring-2", "ring-white")
        })

        bin.addEventListener("dragleave", function () {
          this.classList.remove("ring-2", "ring-white")
        })

        bin.addEventListener("drop", function (e) {
          e.preventDefault()
          this.classList.remove("ring-2", "ring-white")

          const itemType = e.dataTransfer.getData("text/plain")
          const binType = this.getAttribute("data-bin-type")

          if (itemType === binType) {
            score += 10
            scoreDisplay.textContent = score

            // Find and remove the dragged item
            const itemId = e.dataTransfer.getData("item-id")
            const draggedItem = document.getElementById(itemId)
            if (draggedItem) {
              const itemName = draggedItem.textContent
              currentItems = currentItems.filter((i) => i.id !== itemId)
              draggedItem.remove()

              // Show success message
              showFeedback("Correto! +10 pontos", "bg-green-500")

              // Check if game is complete
              if (currentItems.length === 0) {
                showFeedback("Jogo concluído! Parabéns!", "bg-green-600")
                gameStarted = false
                startButton.textContent = "Jogar Novamente"
                startButton.disabled = false
              }
            }
          } else {
            // Show error message
            showFeedback("Incorreto! Tente novamente.", "bg-red-500")
          }
        })
      })
    }

    function showFeedback(message, bgClass) {
      const feedback = document.createElement("div")
      feedback.className = `absolute top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-white ${bgClass}`
      feedback.textContent = message
      gameContainer.appendChild(feedback)

      setTimeout(() => {
        feedback.remove()
      }, 2000)
    }

    function startGame() {
      if (gameStarted) return

      // Clear previous items
      itemsContainer.innerHTML = ""
      currentItems = []
      score = 0
      scoreDisplay.textContent = score
      gameStarted = true

      // Get 5 random items
      const shuffled = [...recyclableItems].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 5)

      // Add to current items and display
      selected.forEach((item) => {
        const itemElement = createItem(item)
        itemsContainer.appendChild(itemElement)
        currentItems.push({ ...item, id: itemElement.id })
      })

      startButton.disabled = true
    }

    function resetGame() {
      itemsContainer.innerHTML = ""
      currentItems = []
      score = 0
      scoreDisplay.textContent = score
      gameStarted = false
      startButton.disabled = false
      startButton.textContent = "Iniciar Jogo"
    }

    // Set up event listeners
    setupBins()
    startButton.addEventListener("click", startGame)
    resetButton.addEventListener("click", resetGame)
  }

  // Initialize the game if the gamificacao tab is active on page load
  if (!document.getElementById("gamificacao-tab").classList.contains("hidden")) {
    initializeGame()
  }
})

