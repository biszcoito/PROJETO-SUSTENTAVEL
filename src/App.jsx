"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRecycle,
  faInfoCircle,
  faMapMarkerAlt,
  faCalendarAlt,
  faUsers,
  faComment,
  faTrophy,
  faTag,
  faSun,
  faMoon,
  faBars,
} from "@fortawesome/free-solid-svg-icons"

function App() {
  const [activeTab, setActiveTab] = useState("informacoes")
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Generate calendar days
    generateCalendarDays()
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const generateCalendarDays = () => {
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

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Header */}
        <header className="bg-green-600 dark:bg-green-800 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faRecycle} className="h-8 w-8" />
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
                <FontAwesomeIcon icon={faSun} className="h-4 w-4" />
                <label className="switch">
                  <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                  <span className="slider round"></span>
                </label>
                <FontAwesomeIcon icon={faMoon} className="h-4 w-4" />
              </div>
              <button className="bg-white text-green-600 dark:bg-green-700 dark:text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition">
                Entrar
              </button>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 bg-green-700 rounded-md p-4">
              <nav className="flex flex-col gap-4">
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
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-4">Transformando Resíduos em Recursos</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se à ASCAMAREA na missão de promover a reciclagem e apoiar os catadores de materiais recicláveis.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-green-600 px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition">
                Agendar Coleta
              </button>
              <button className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-bold hover:bg-white/10 transition">
                Saiba Mais
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto py-8 px-4">
          <div className="tabs">
            <div className="tabs-list grid grid-cols-3 md:grid-cols-7 gap-2 mb-8">
              <button
                className={`tab-btn flex items-center justify-center md:justify-start gap-2 p-3 rounded-md ${activeTab === "informacoes" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-white font-bold" : "bg-gray-100 dark:bg-gray-800"}`}
                onClick={() => setActiveTab("informacoes")}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="hidden md:inline">Informações</span>
              </button>
              <button
                className={`tab-btn flex items-center justify-center md:justify-start gap-2 p-3 rounded-md ${activeTab === "mapa" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-white font-bold" : "bg-gray-100 dark:bg-gray-800"}`}
                onClick={() => setActiveTab("mapa")}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span className="hidden md:inline">Mapa</span>
              </button>
              <button
                className={`tab-btn flex items-center justify-center md:justify-start gap-2 p-3 rounded-md ${activeTab === "calendario" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-white font-bold" : "bg-gray-100 dark:bg-gray-800"}`}
                onClick={() => setActiveTab("calendario")}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span className="hidden md:inline">Calendário</span>
              </button>
              <button
                className={`tab-btn flex items-center justify-center md:justify-start gap-2 p-3 rounded-md ${activeTab === "catadores" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-white font-bold" : "bg-gray-100 dark:bg-gray-800"}`}
                onClick={() => setActiveTab("catadores")}
              >
                <FontAwesomeIcon icon={faUsers} />
                <span className="hidden md:inline">Catadores</span>
              </button>
              <button
                className={`tab-btn flex items-center justify-center md:justify-start gap-2 p-3 rounded-md ${activeTab === "comunidade" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-white font-bold" : "bg-gray-100 dark:bg-gray-800"}`}
                onClick={() => setActiveTab("comunidade")}
              >
                <FontAwesomeIcon icon={faComment} />
                <span className="hidden md:inline">Comunidade</span>
              </button>
              <button
                className={`tab-btn flex items-center justify-center md:justify-start gap-2 p-3 rounded-md ${activeTab === "gamificacao" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-white font-bold" : "bg-gray-100 dark:bg-gray-800"}`}
                onClick={() => setActiveTab("gamificacao")}
              >
                <FontAwesomeIcon icon={faTrophy} />
                <span className="hidden md:inline">Gamificação</span>
              </button>
              <button
                className={`tab-btn flex items-center justify-center md:justify-start gap-2 p-3 rounded-md ${activeTab === "precos" ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-white font-bold" : "bg-gray-100 dark:bg-gray-800"}`}
                onClick={() => setActiveTab("precos")}
              >
                <FontAwesomeIcon icon={faTag} />
                <span className="hidden md:inline">Preços</span>
              </button>
            </div>

            {/* Informações Tab */}
            {activeTab === "informacoes" && (
              <div className="tab-content">
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
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Impacto da Reciclagem</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-200 text-xl font-bold">75%</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Redução de Resíduos</h4>
                          <p>Diminuição de materiais enviados para aterros sanitários</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-200 text-xl font-bold">60%</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Economia de Energia</h4>
                          <p>Comparado à produção com matérias-primas virgens</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                          <span className="text-amber-600 dark:text-amber-200 text-xl font-bold">100+</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Famílias Beneficiadas</h4>
                          <p>Catadores e suas famílias com renda melhorada</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preços Tab */}
            {activeTab === "precos" && (
              <div className="tab-content">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold">Valores dos Materiais Recicláveis</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Confira os preços atuais pagos por kg de material reciclável
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="mb-6 text-gray-700 dark:text-gray-300">
                      Os valores são atualizados mensalmente e podem variar de acordo com a qualidade do material e
                      condições de mercado. Materiais limpos, secos e separados corretamente têm maior valor.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-3 text-green-600 dark:text-green-400">Papel e Papelão</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-green-50 dark:bg-green-900">
                              <tr>
                                <th className="text-left p-3">Material</th>
                                <th className="text-right p-3">Valor/kg</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
                                <td className="p-3">Papel Branco</td>
                                <td className="text-right p-3">R$ 0,60</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
                                <td className="p-3">Papelão</td>
                                <td className="text-right p-3">R$ 0,40</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
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
                        <h3 className="text-lg font-bold mb-3 text-green-600 dark:text-green-400">Plásticos</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-green-50 dark:bg-green-900">
                              <tr>
                                <th className="text-left p-3">Material</th>
                                <th className="text-right p-3">Valor/kg</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
                                <td className="p-3">PET (Garrafas)</td>
                                <td className="text-right p-3">R$ 1,80</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
                                <td className="p-3">PEAD (Frascos)</td>
                                <td className="text-right p-3">R$ 1,50</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
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
                        <h3 className="text-lg font-bold mb-3 text-green-600 dark:text-green-400">Metais</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-green-50 dark:bg-green-900">
                              <tr>
                                <th className="text-left p-3">Material</th>
                                <th className="text-right p-3">Valor/kg</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
                                <td className="p-3">Alumínio (Latas)</td>
                                <td className="text-right p-3">R$ 5,50</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
                                <td className="p-3">Cobre</td>
                                <td className="text-right p-3">R$ 28,00</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
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
                        <h3 className="text-lg font-bold mb-3 text-green-600 dark:text-green-400">Vidros e Outros</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-green-50 dark:bg-green-900">
                              <tr>
                                <th className="text-left p-3">Material</th>
                                <th className="text-right p-3">Valor/kg</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
                                <td className="p-3">Vidro Incolor</td>
                                <td className="text-right p-3">R$ 0,20</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
                                <td className="p-3">Vidro Colorido</td>
                                <td className="text-right p-3">R$ 0,15</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-600">
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

                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mt-6">
                      <h3 className="font-bold mb-2">Informações Importantes</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Os preços são referentes a materiais limpos e separados corretamente.</li>
                        <li>Materiais contaminados podem ter valor reduzido ou serem recusados.</li>
                        <li>Para grandes volumes, entre em contato para negociar valores diferenciados.</li>
                        <li>Última atualização: 01/06/2023</li>
                      </ul>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-6">
                      <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition flex-1">
                        Solicitar Coleta
                      </button>
                      <button className="border border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 py-2 px-4 rounded-md transition flex-1">
                        Baixar Tabela Completa (PDF)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder para outras abas */}
            {activeTab !== "informacoes" && activeTab !== "precos" && (
              <div className="tab-content">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Conteúdo da aba {activeTab}</h3>
                  <p>Esta aba está em desenvolvimento. Por favor, verifique novamente mais tarde.</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-green-600 dark:bg-green-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">ASCAMAREA</h3>
                <p className="mb-4">Transformando resíduos em recursos, gerando renda e dignidade para catadores.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white/80">
                    Facebook
                  </a>
                  <a href="#" className="hover:text-white/80">
                    Instagram
                  </a>
                  <a href="#" className="hover:text-white/80">
                    Twitter
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#sobre" className="hover:text-white/80">
                      Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a href="#mapa" className="hover:text-white/80">
                      Mapa de Coleta
                    </a>
                  </li>
                  <li>
                    <a href="#calendario" className="hover:text-white/80">
                      Calendário
                    </a>
                  </li>
                  <li>
                    <a href="#blog" className="hover:text-white/80">
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
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/70 flex-1"
                  />
                  <button className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition">
                    Assinar
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-white/20 mt-8 pt-4 text-center">
              <p>&copy; 2023 ASCAMAREA. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App

