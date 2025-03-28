"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Calendar, Users, Recycle, MessageCircle, Moon, Sun, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const gameInitialized = useRef(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initializeGame = () => {
        const gameContainer = document.getElementById("recycling-game")
        const itemsContainer = document.getElementById("recycling-items")
        const scoreDisplay = document.getElementById("game-score")
        const resetButton = document.getElementById("game-reset")
        const startButton = document.getElementById("game-start")

        if (!gameContainer || !itemsContainer || !scoreDisplay || !resetButton || !startButton) return

        gameInitialized.current = true

        let score = 0
        let gameStarted = false

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

        let currentItems = []

        function createItem(item) {
          const itemElement = document.createElement("div")
          itemElement.className = `item draggable p-2 rounded ${item.color} cursor-move`
          itemElement.setAttribute("data-type", item.type)
          itemElement.textContent = item.name
          itemElement.style.touchAction = "none"

          // Make draggable
          itemElement.setAttribute("draggable", "true")

          itemElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", item.type)
            setTimeout(() => {
              itemElement.classList.add("opacity-50")
            }, 0)
          })

          itemElement.addEventListener("dragend", () => {
            itemElement.classList.remove("opacity-50")
          })

          return itemElement
        }

        function setupBins() {
          const bins = document.querySelectorAll(".bin-container")

          bins.forEach((bin) => {
            bin.addEventListener("dragover", (e) => {
              e.preventDefault()
              bin.classList.add("border-2", "border-white")
            })

            bin.addEventListener("dragleave", () => {
              bin.classList.remove("border-2", "border-white")
            })

            bin.addEventListener("drop", (e) => {
              e.preventDefault()
              bin.classList.remove("border-2", "border-white")

              const itemType = e.dataTransfer.getData("text/plain")
              const binType = bin.getAttribute("data-bin-type")

              if (itemType === binType) {
                score += 10
                scoreDisplay.textContent = score

                // Remove item from display and array
                const draggedItem = document.querySelector(`.item[data-type="${itemType}"].opacity-50`)
                if (draggedItem) {
                  const itemName = draggedItem.textContent
                  currentItems = currentItems.filter((i) => i.name !== itemName)
                  draggedItem.remove()

                  // Show success message
                  showFeedback("Correto! +10 pontos", "bg-green-500")

                  // Check if game is complete
                  if (currentItems.length === 0) {
                    showFeedback("Jogo concluído! Parabéns!", "bg-primary")
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
          currentItems = selected
          selected.forEach((item) => {
            const itemElement = createItem(item)
            itemsContainer.appendChild(itemElement)
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

      // Initialize game when tab is shown
      const checkGameTabVisibility = () => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
              const gameTab = document.getElementById("recycling-game")
              if (gameTab && !gameTab.classList.contains("hidden")) {
                initializeGame()
              }
            }
          })
        })

        const gamificationTab = document.querySelector('[data-state="active"][value="gamificacao"]')
        if (gamificationTab) {
          observer.observe(gamificationTab, { attributes: true })
          initializeGame()
        }
      }

      // Check after a short delay to ensure DOM is fully loaded
      setTimeout(checkGameTabVisibility, 500)
    }
  }, [])

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-background text-foreground">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Recycle className="h-8 w-8" />
              <h1 className="text-2xl font-bold">ASCAMAREA</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#sobre" className="hover:underline">
                Sobre
              </a>
              <a href="#mapa" className="hover:underline">
                Mapa
              </a>
              <a href="#calendario" className="hover:underline">
                Calendário
              </a>
              <a href="#catadores" className="hover:underline">
                Área do Catador
              </a>
              <a href="#comunidade" className="hover:underline">
                Comunidade
              </a>
              <a href="#blog" className="hover:underline">
                Blog
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                <Moon className="h-4 w-4" />
              </div>
              <Button>Entrar</Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-4">Transformando Resíduos em Recursos</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se à ASCAMAREA na missão de promover a reciclagem e apoiar os catadores de materiais recicláveis.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Agendar Coleta
              </Button>
              <Button variant="outline" size="lg" className="bg-white/20 w-full sm:w-auto">
                Saiba Mais
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto py-8 px-4">
          <Tabs defaultValue="informacoes" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
              <TabsTrigger value="informacoes">
                <Info className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Informações</span>
              </TabsTrigger>
              <TabsTrigger value="mapa">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Mapa</span>
              </TabsTrigger>
              <TabsTrigger value="calendario">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Calendário</span>
              </TabsTrigger>
              <TabsTrigger value="catadores">
                <Users className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Catadores</span>
              </TabsTrigger>
              <TabsTrigger value="comunidade">
                <MessageCircle className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Comunidade</span>
              </TabsTrigger>
              <TabsTrigger value="gamificacao">
                <span className="hidden md:inline">Gamificação</span>
              </TabsTrigger>
              <TabsTrigger value="precos">
                <span className="hidden md:inline">Preços</span>
              </TabsTrigger>
            </TabsList>

            {/* Informações Tab */}
            <TabsContent value="informacoes" id="sobre">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Sobre a ASCAMAREA</h2>
                  <p className="mb-4">
                    A ASCAMAREA é uma associação de catadores de materiais recicláveis que trabalha para promover a
                    reciclagem e melhorar as condições de trabalho dos catadores.
                  </p>
                  <p className="mb-4">
                    Nossa missão é transformar resíduos em recursos, contribuindo para um meio ambiente mais limpo e
                    sustentável, enquanto geramos renda e dignidade para os catadores.
                  </p>
                  <h3 className="text-xl font-bold mt-6 mb-2">Nossos Valores</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Sustentabilidade ambiental</li>
                    <li>Inclusão social</li>
                    <li>Economia circular</li>
                    <li>Trabalho digno</li>
                    <li>Educação ambiental</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Impacto da Reciclagem</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xl font-bold">75%</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Redução de Resíduos</h4>
                        <p>Diminuição de materiais enviados para aterros sanitários</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xl font-bold">60%</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Economia de Energia</h4>
                        <p>Comparado à produção com matérias-primas virgens</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-amber-600 text-xl font-bold">100+</span>
                      </div>
                      <div>
                        <h4 className="font-bold">Famílias Beneficiadas</h4>
                        <p>Catadores e suas famílias com renda melhorada</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Mapa Tab */}
            <TabsContent value="mapa" id="mapa">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa Interativo</CardTitle>
                  <CardDescription>Encontre pontos de coleta e centros de reciclagem em Açailândia, MA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] rounded-md overflow-hidden mb-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127231.81439195354!2d-47.43015509553103!3d-4.8969186974885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92d0bd6f85718b55%3A0x8621a6cb7b2de0d2!2sA%C3%A7ail%C3%A2ndia%2C%20MA!5e0!3m2!1spt-BR!2sbr!4v1711469464018!5m2!1spt-BR!2sbr"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mapa de Açailândia, MA"
                    ></iframe>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-bold">Centro de Reciclagem Principal</h4>
                      <p className="text-sm">Av. Bernardo Sayão, 1234 - Centro, Açailândia</p>
                      <p className="text-sm">Segunda a Sexta: 8h às 17h</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-bold">Ponto de Coleta Norte</h4>
                      <p className="text-sm">Rua dos Catadores, 456 - Jardim Glória, Açailândia</p>
                      <p className="text-sm">Terça e Quinta: 9h às 16h</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-bold">Ponto de Coleta Sul</h4>
                      <p className="text-sm">Av. Bom Jesus, 789 - Vila Ildemar, Açailândia</p>
                      <p className="text-sm">Segunda e Quarta: 9h às 16h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calendário Tab */}
            <TabsContent value="calendario" id="calendario">
              <Card>
                <CardHeader>
                  <CardTitle>Calendário de Coletas</CardTitle>
                  <CardDescription>Confira os dias de recolhimento de materiais em sua região</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <div className="grid grid-cols-7 gap-1 text-center font-bold mb-2">
                      <div>Dom</div>
                      <div>Seg</div>
                      <div>Ter</div>
                      <div>Qua</div>
                      <div>Qui</div>
                      <div>Sex</div>
                      <div>Sáb</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: 31 }).map((_, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-md ${
                            [3, 8, 13, 18, 23, 28].includes(i)
                              ? "bg-green-100 dark:bg-green-900"
                              : [5, 10, 15, 20, 25, 30].includes(i)
                                ? "bg-blue-100 dark:bg-blue-900"
                                : "bg-background"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span>Papel e Papelão</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span>Plástico e Metal</span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-2">Selecione sua região:</h4>
                      <select className="w-full p-2 border rounded-md">
                        <option>Centro</option>
                        <option>Zona Norte</option>
                        <option>Zona Sul</option>
                        <option>Zona Leste</option>
                        <option>Zona Oeste</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Receba lembretes:</h4>
                      <div className="flex gap-2">
                        <Input type="email" placeholder="Seu e-mail" />
                        <Button>Cadastrar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Catadores Tab */}
            <TabsContent value="catadores" id="catadores">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Área do Catador</CardTitle>
                    <CardDescription>
                      Cadastre-se para receber informações sobre locais e materiais disponíveis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input id="nome" placeholder="Seu nome completo" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="documento">CPF</Label>
                          <Input id="documento" placeholder="Seu CPF" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" placeholder="(00) 00000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regiao">Região de Atuação</Label>
                        <select id="regiao" className="w-full p-2 border rounded-md">
                          <option>Centro</option>
                          <option>Zona Norte</option>
                          <option>Zona Sul</option>
                          <option>Zona Leste</option>
                          <option>Zona Oeste</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="materiais">Materiais que Coleta</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="papel" />
                            <label htmlFor="papel">Papel/Papelão</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="plastico" />
                            <label htmlFor="plastico">Plástico</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="metal" />
                            <label htmlFor="metal">Metal</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="vidro" />
                            <label htmlFor="vidro">Vidro</label>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">Cadastrar</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rastreamento de Doações</CardTitle>
                    <CardDescription>Acompanhe doações e pedidos de material reciclável</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold">Doação #1234</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-xs">
                            Disponível
                          </span>
                        </div>
                        <p className="text-sm mb-2">Empresa ABC - 50kg de papel</p>
                        <p className="text-sm mb-2">Endereço: Av. Bernardo Sayão, 123 - Centro, Açailândia</p>
                        <p className="text-sm mb-2">Disponível para coleta: 15/06/2023</p>
                        <p className="text-sm mb-2">Horário: 8h às 12h</p>
                        <details className="mb-2 text-sm">
                          <summary className="cursor-pointer font-medium text-primary">Detalhes adicionais</summary>
                          <div className="mt-2 pl-4">
                            <p>Material em bom estado, separado e embalado.</p>
                            <p>Fácil acesso para carga e descarga.</p>
                            <p>Contato: João - (99) 91234-5678</p>
                          </div>
                        </details>
                        <Button variant="outline" className="w-full mt-2">
                          Reservar Coleta
                        </Button>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold">Doação #1235</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-xs">
                            Disponível
                          </span>
                        </div>
                        <p className="text-sm mb-2">Condomínio XYZ - 30kg de plástico</p>
                        <p className="text-sm mb-2">Endereço: Rua Bom Jesus, 456 - Jardim Glória, Açailândia</p>
                        <p className="text-sm mb-2">Disponível para coleta: 16/06/2023</p>
                        <p className="text-sm mb-2">Horário: 13h às 17h</p>
                        <details className="mb-2 text-sm">
                          <summary className="cursor-pointer font-medium text-primary">Detalhes adicionais</summary>
                          <div className="mt-2 pl-4">
                            <p>Material predominantemente PET e PEAD.</p>
                            <p>Necessário trazer sacolas para transporte.</p>
                            <p>Contato: Maria - (99) 98765-4321</p>
                          </div>
                        </details>
                        <Button variant="outline" className="w-full mt-2">
                          Reservar Coleta
                        </Button>
                      </div>
                      <div className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold">Doação #1236</h4>
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full text-xs">
                            Reservada
                          </span>
                        </div>
                        <p className="text-sm mb-2">Escola Municipal - 25kg de papel e plástico</p>
                        <p className="text-sm mb-2">Endereço: Av. Educação, 789 - Vila Ildemar, Açailândia</p>
                        <p className="text-sm mb-2">Reservada por: João Silva</p>
                        <p className="text-sm mb-2">Data de coleta: 17/06/2023</p>
                        <div className="bg-muted p-2 rounded-md mt-2">
                          <p className="text-sm font-medium">Status da coleta:</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <p className="text-sm">Reserva confirmada</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Comunidade Tab */}
            <TabsContent value="comunidade" id="comunidade">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Doação de Materiais</CardTitle>
                    <CardDescription>Doe materiais recicláveis diretamente para a ASCAMAREA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="doador-nome">Nome/Empresa</Label>
                        <Input id="doador-nome" placeholder="Seu nome ou nome da empresa" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doador-contato">E-mail ou Telefone</Label>
                        <Input id="doador-contato" placeholder="Seu contato" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doador-endereco">Endereço para Coleta</Label>
                        <Input id="doador-endereco" placeholder="Endereço completo" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doador-materiais">Materiais para Doação</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="doador-papel" />
                            <label htmlFor="doador-papel">Papel/Papelão</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="doador-plastico" />
                            <label htmlFor="doador-plastico">Plástico</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="doador-metal" />
                            <label htmlFor="doador-metal">Metal</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="doador-vidro" />
                            <label htmlFor="doador-vidro">Vidro</label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doador-quantidade">Quantidade Estimada (kg)</Label>
                        <Input
                          id="doador-quantidade"
                          type="number"
                          min="1"
                          placeholder="Ex: 10"
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e") {
                              e.preventDefault()
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doador-data">Data Preferencial para Coleta</Label>
                        <Input id="doador-data" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doador-observacoes">Observações</Label>
                        <Textarea id="doador-observacoes" placeholder="Informações adicionais" />
                      </div>
                      <Button className="w-full">Agendar Doação</Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Blog Educativo</CardTitle>
                      <CardDescription>Aprenda sobre sustentabilidade e boas práticas de descarte</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-md overflow-hidden">
                          <div className="h-40 bg-muted flex items-center justify-center">
                            <Recycle className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold mb-2">Como separar corretamente os resíduos em casa</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Aprenda a separar os diferentes tipos de materiais recicláveis e organize sua coleta
                              seletiva doméstica.
                            </p>
                            <Button variant="link" className="p-0">
                              Ler mais
                            </Button>
                          </div>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <div className="h-40 bg-muted flex items-center justify-center">
                            <Recycle className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold mb-2">O impacto da reciclagem no meio ambiente</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Descubra como a reciclagem contribui para a redução da poluição e conservação dos recursos
                              naturais.
                            </p>
                            <Button variant="link" className="p-0">
                              Ler mais
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Ver Todos os Artigos
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contato Rápido</CardTitle>
                      <CardDescription>Entre em contato com a ASCAMAREA</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <MessageCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold">WhatsApp</h4>
                            <p className="text-sm">(00) 00000-0000</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold">Endereço</h4>
                            <p className="text-sm">Av. Reciclagem, 123 - Centro</p>
                          </div>
                        </div>
                        <Button className="w-full">Iniciar Chat</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Gamificação Tab */}
            <TabsContent value="gamificacao">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistema de Pontos</CardTitle>
                    <CardDescription>
                      Ganhe pontos ao doar materiais recicláveis e troque-os por recompensas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-6 rounded-lg mb-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">Seus Pontos</h3>
                        <div className="text-5xl font-bold text-primary mb-4">0</div>
                        <p className="text-sm text-muted-foreground mb-4">Faça login para ver seus pontos acumulados</p>
                        <Button>Entrar</Button>
                      </div>
                    </div>
                    <h3 className="font-bold mb-4">Como Funciona</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <span className="font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Doe Materiais</h4>
                          <p className="text-sm">
                            Agende uma coleta ou entregue materiais recicláveis em um ponto de coleta
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <span className="font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Acumule Pontos</h4>
                          <p className="text-sm">Cada kg de material reciclável vale pontos diferentes</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <span className="font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Troque por Recompensas</h4>
                          <p className="text-sm">Use seus pontos para obter descontos e brindes de parceiros</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Jogo de Reciclagem</CardTitle>
                    <CardDescription>Teste seus conhecimentos sobre separação de materiais recicláveis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="mb-4">Arraste os itens para a lixeira correta e ganhe pontos!</p>
                      <div
                        id="recycling-game"
                        className="relative bg-slate-100 dark:bg-slate-800 h-[400px] rounded-lg overflow-hidden"
                      >
                        <div className="absolute bottom-0 w-full flex justify-around pb-4">
                          <div className="bin-container" data-bin-type="paper">
                            <div className="w-20 h-24 bg-blue-500 rounded-md flex items-center justify-center">
                              <span className="text-white font-bold">Papel</span>
                            </div>
                          </div>
                          <div className="bin-container" data-bin-type="plastic">
                            <div className="w-20 h-24 bg-red-500 rounded-md flex items-center justify-center">
                              <span className="text-white font-bold">Plástico</span>
                            </div>
                          </div>
                          <div className="bin-container" data-bin-type="glass">
                            <div className="w-20 h-24 bg-green-500 rounded-md flex items-center justify-center">
                              <span className="text-white font-bold">Vidro</span>
                            </div>
                          </div>
                          <div className="bin-container" data-bin-type="metal">
                            <div className="w-20 h-24 bg-yellow-500 rounded-md flex items-center justify-center">
                              <span className="text-white font-bold">Metal</span>
                            </div>
                          </div>
                        </div>
                        <div
                          id="game-items-container"
                          className="absolute top-4 left-0 right-0 flex flex-wrap justify-center gap-4"
                        >
                          {/* Game items will be rendered here */}
                        </div>
                        <div className="absolute top-4 right-4 bg-white dark:bg-gray-700 px-3 py-1 rounded-full">
                          <span className="font-bold">Pontos: </span>
                          <span id="game-score">0</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" id="game-reset">
                        Reiniciar Jogo
                      </Button>
                      <Button id="game-start">Iniciar Jogo</Button>
                    </div>

                    <script
                      dangerouslySetInnerHTML={{
                        __html: `
    // Game initialization
    document.addEventListener('DOMContentLoaded', function() {
      let score = 0;
      let gameStarted = false;
      let currentItems = [];
      
      const recyclableItems = [
        { type: 'paper', name: 'Jornal', color: 'bg-blue-200' },
        { type: 'paper', name: 'Caderno', color: 'bg-blue-200' },
        { type: 'paper', name: 'Revista', color: 'bg-blue-200' },
        { type: 'plastic', name: 'Garrafa PET', color: 'bg-red-200' },
        { type: 'plastic', name: 'Sacola', color: 'bg-red-200' },
        { type: 'plastic', name: 'Embalagem', color: 'bg-red-200' },
        { type: 'glass', name: 'Garrafa', color: 'bg-green-200' },
        { type: 'glass', name: 'Pote', color: 'bg-green-200' },
        { type: 'glass', name: 'Vidro', color: 'bg-green-200' },
        { type: 'metal', name: 'Lata', color: 'bg-yellow-200' },
        { type: 'metal', name: 'Tampa', color: 'bg-yellow-200' },
        { type: 'metal', name: 'Alumínio', color: 'bg-yellow-200' }
      ];
      
      function setupGame() {
        const gameContainer = document.getElementById('recycling-game');
        const itemsContainer = document.getElementById('game-items-container');
        const scoreDisplay = document.getElementById('game-score');
        const resetButton = document.getElementById('game-reset');
        const startButton = document.getElementById('game-start');
        
        if (!gameContainer || !itemsContainer || !scoreDisplay || !resetButton || !startButton) {
          console.error('Game elements not found');
          return;
        }
        
        // Set up bins for drop events
        const bins = document.querySelectorAll('.bin-container');
        bins.forEach(bin => {
          bin.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('ring-2', 'ring-white');
          });
          
          bin.addEventListener('dragleave', function() {
            this.classList.remove('ring-2', 'ring-white');
          });
          
          bin.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('ring-2', 'ring-white');
            
            const itemType = e.dataTransfer.getData('text/plain');
            const binType = this.getAttribute('data-bin-type');
            
            if (itemType === binType) {
              score += 10;
              scoreDisplay.textContent = score;
              
              // Find and remove the dragged item
              const itemId = e.dataTransfer.getData('item-id');
              const draggedItem = document.getElementById(itemId);
              if (draggedItem) {
                const itemName = draggedItem.textContent;
                currentItems = currentItems.filter(i => i.id !== itemId);
                draggedItem.remove();
                
                // Show success message
                showFeedback('Correto! +10 pontos', 'bg-green-500');
                
                // Check if game is complete
                if (currentItems.length === 0) {
                  showFeedback('Jogo concluído! Parabéns!', 'bg-primary');
                  gameStarted = false;
                  startButton.textContent = 'Jogar Novamente';
                  startButton.disabled = false;
                }
              }
            } else {
              // Show error message
              showFeedback('Incorreto! Tente novamente.', 'bg-red-500');
            }
          });
        });
        
        // Set up start and reset buttons
        startButton.addEventListener('click', function() {
          if (!gameStarted) {
            startGame();
          }
        });
        
        resetButton.addEventListener('click', function() {
          resetGame();
        });
      }
      
      function startGame() {
        const itemsContainer = document.getElementById('game-items-container');
        const scoreDisplay = document.getElementById('game-score');
        const startButton = document.getElementById('game-start');
        
        if (!itemsContainer || !scoreDisplay || !startButton) return;
        
        if (gameStarted) return;
        
        // Clear previous items
        itemsContainer.innerHTML = '';
        currentItems = [];
        score = 0;
        scoreDisplay.textContent = score;
        gameStarted = true;
        
        // Get 5 random items
        const shuffled = [...recyclableItems].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        
        // Create and add items to the container
        selected.forEach((item, index) => {
          const itemId = \`item-\${index}-\${Date.now()}\`;
          const itemElement = document.createElement('div');
          itemElement.id = itemId;
          itemElement.className = \`item p-3 rounded \${item.color} cursor-move shadow-md\`;
          itemElement.setAttribute('data-type', item.type);
          itemElement.setAttribute('draggable', 'true');
          itemElement.textContent = item.name;
          
          // Add drag event listeners
          itemElement.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', item.type);
            e.dataTransfer.setData('item-id', itemId);
            setTimeout(() => {
              this.classList.add('opacity-50');
            }, 0);
          });
          
          itemElement.addEventListener('dragend', function() {
            this.classList.remove('opacity-50');
          });
          
          itemsContainer.appendChild(itemElement);
          currentItems.push({ ...item, id: itemId });
        });
        
        startButton.disabled = true;
      }
      
      function resetGame() {
        const itemsContainer = document.getElementById('game-items-container');
        const scoreDisplay = document.getElementById('game-score');
        const startButton = document.getElementById('game-start');
        
        if (!itemsContainer || !scoreDisplay || !startButton) return;
        
        itemsContainer.innerHTML = '';
        currentItems = [];
        score = 0;
        scoreDisplay.textContent = score;
        gameStarted = false;
        startButton.disabled = false;
        startButton.textContent = 'Iniciar Jogo';
      }
      
      function showFeedback(message, bgClass) {
        const gameContainer = document.getElementById('recycling-game');
        if (!gameContainer) return;
        
        const feedback = document.createElement('div');
        feedback.className = \`absolute top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-white \${bgClass}\`;
        feedback.textContent = message;
        gameContainer.appendChild(feedback);
        
        setTimeout(() => {
          feedback.remove();
        }, 2000);
      }
      
      // Initialize game when tab becomes visible
      function initializeGameWhenVisible() {
        const tabsContent = document.querySelector('[data-state="active"][value="gamificacao"]');
        if (tabsContent) {
          setupGame();
        }
        
        // Watch for tab changes
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-state') {
              const gamificationTab = document.querySelector('[data-state="active"][value="gamificacao"]');
              if (gamificationTab) {
                setupGame();
              }
            }
          });
        });
        
        const tabsList = document.querySelector('[role="tabslist"]');
        if (tabsList) {
          observer.observe(tabsList, { attributes: true, subtree: true });
        }
      }
      
      // Initialize when DOM is ready
      initializeGameWhenVisible();
      
      // Make functions globally available
      window.startGame = startGame;
      window.resetGame = resetGame;
    });
  `,
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preços Tab */}
            <TabsContent value="precos">
              <Card>
                <CardHeader>
                  <CardTitle>Valores dos Materiais Recicláveis</CardTitle>
                  <CardDescription>Confira os preços atuais pagos por kg de material reciclável</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="mb-4">
                        Os valores são atualizados mensalmente e podem variar de acordo com a qualidade do material e
                        condições de mercado. Materiais limpos, secos e separados corretamente têm maior valor.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-bold mb-3 text-primary">Papel e Papelão</h3>
                          <div className="bg-muted rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-primary/10">
                                <tr>
                                  <th className="text-left p-3">Material</th>
                                  <th className="text-right p-3">Valor/kg</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Papel Branco</td>
                                  <td className="text-right p-3">R$ 0,60</td>
                                </tr>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Papelão</td>
                                  <td className="text-right p-3">R$ 0,40</td>
                                </tr>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Jornal</td>
                                  <td className="text-right p-3">R$ 0,30</td>
                                </tr>
                                <tr>
                                  <td className="p-3">Revista</td>
                                  <td className="text-right p-3">R$ 0,35</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold mb-3 text-primary">Plásticos</h3>
                          <div className="bg-muted rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-primary/10">
                                <tr>
                                  <th className="text-left p-3">Material</th>
                                  <th className="text-right p-3">Valor/kg</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">PET (Garrafas)</td>
                                  <td className="text-right p-3">R$ 1,80</td>
                                </tr>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">PEAD (Frascos)</td>
                                  <td className="text-right p-3">R$ 1,50</td>
                                </tr>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">PVC</td>
                                  <td className="text-right p-3">R$ 1,20</td>
                                </tr>
                                <tr>
                                  <td className="p-3">Plástico Filme</td>
                                  <td className="text-right p-3">R$ 1,00</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold mb-3 text-primary">Metais</h3>
                          <div className="bg-muted rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-primary/10">
                                <tr>
                                  <th className="text-left p-3">Material</th>
                                  <th className="text-right p-3">Valor/kg</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Alumínio (Latas)</td>
                                  <td className="text-right p-3">R$ 5,50</td>
                                </tr>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Cobre</td>
                                  <td className="text-right p-3">R$ 28,00</td>
                                </tr>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Ferro</td>
                                  <td className="text-right p-3">R$ 0,40</td>
                                </tr>
                                <tr>
                                  <td className="p-3">Aço Inox</td>
                                  <td className="text-right p-3">R$ 3,80</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold mb-3 text-primary">Vidros e Outros</h3>
                          <div className="bg-muted rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-primary/10">
                                <tr>
                                  <th className="text-left p-3">Material</th>
                                  <th className="text-right p-3">Valor/kg</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Vidro Incolor</td>
                                  <td className="text-right p-3">R$ 0,20</td>
                                </tr>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Vidro Colorido</td>
                                  <td className="text-right p-3">R$ 0,15</td>
                                </tr>
                                <tr className="border-b border-primary/10">
                                  <td className="p-3">Óleo de Cozinha</td>
                                  <td className="text-right p-3">R$ 1,00</td>
                                </tr>
                                <tr>
                                  <td className="p-3">Eletrônicos</td>
                                  <td className="text-right p-3">Variável</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">Informações Importantes</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Os preços são referentes a materiais limpos e separados corretamente.</li>
                        <li>Materiais contaminados podem ter valor reduzido ou serem recusados.</li>
                        <li>Para grandes volumes, entre em contato para negociar valores diferenciados.</li>
                        <li>Última atualização: 01/06/2023</li>
                      </ul>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <Button className="flex-1">Solicitar Coleta</Button>
                      <Button variant="outline" className="flex-1">
                        Baixar Tabela Completa (PDF)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">ASCAMAREA</h3>
                <p className="mb-4">Transformando resíduos em recursos, gerando renda e dignidade para catadores.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-primary-foreground/80">
                    Facebook
                  </a>
                  <a href="#" className="hover:text-primary-foreground/80">
                    Instagram
                  </a>
                  <a href="#" className="hover:text-primary-foreground/80">
                    Twitter
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#sobre" className="hover:text-primary-foreground/80">
                      Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a href="#mapa" className="hover:text-primary-foreground/80">
                      Mapa de Coleta
                    </a>
                  </li>
                  <li>
                    <a href="#calendario" className="hover:text-primary-foreground/80">
                      Calendário
                    </a>
                  </li>
                  <li>
                    <a href="#blog" className="hover:text-primary-foreground/80">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Contato</h3>
                <ul className="space-y-2">
                  <li>Av. Reciclagem, 123 - Centro</li>
                  <li>contato@ascamarea.org</li>
                  <li>(00) 00000-0000</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Newsletter</h3>
                <p className="mb-2">Receba novidades e dicas de reciclagem</p>
                <div className="flex gap-2">
                  <Input placeholder="Seu e-mail" className="bg-primary-foreground/10 border-primary-foreground/20" />
                  <Button variant="secondary">Assinar</Button>
                </div>
              </div>
            </div>
            <div className="border-t border-primary-foreground/20 mt-8 pt-4 text-center">
              <p>&copy; 2023 ASCAMAREA. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

