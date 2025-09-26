import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface Professor {
  id: number
  name: string
  department: string
  campus: string
  university: string
  average_rating: number
  review_count: number
  average_difficulty: number
  would_take_again_percent: number
}

// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';

function App() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [activeCampus, setActiveCampus] = useState<'pilani' | 'goa' | 'hyderabad'>('pilani')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch professors from API
  const fetchProfessors = async (campus: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/professors?campus=${campus}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProfessors(data)
    } catch (err) {
      console.error('Failed to fetch professors:', err)
      setError(`Failed to load professors. Make sure your backend is running on port 4000.`)
      setProfessors([])
    } finally {
      setLoading(false)
    }
  }

  // Campus button handlers
  const showPilaniProfessors = async () => {
    await fetchProfessors('pilani')
    setActiveCampus('pilani')
    setSelectedProfessor(null)
  }

  const showGoaProfessors = async () => {
    await fetchProfessors('goa')
    setActiveCampus('goa')
    setSelectedProfessor(null)
  }

  const showHyderabadProfessors = async () => {
    await fetchProfessors('hyderabad')
    setActiveCampus('hyderabad')
    setSelectedProfessor(null)
  }

  // Load initial data when component mounts
  useEffect(() => {
    showPilaniProfessors()
  }, [])

  const handleProfessorClick = (professor: Professor) => {
    setSelectedProfessor(professor)
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Title */}
      <div className="flex justify-center pt-8">
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Doto, monospace' }}>GradeYourProfessor</h1>
      </div>
      
      {/* Three Campus Buttons */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button 
          variant={activeCampus === 'pilani' ? 'default' : 'secondary'} 
          onClick={showPilaniProfessors}
          disabled={loading}
        >
          {loading && activeCampus === 'pilani' ? 'Loading...' : 'Pilani'}
        </Button>
        <Button 
          variant={activeCampus === 'goa' ? 'default' : 'secondary'} 
          onClick={showGoaProfessors}
          disabled={loading}
        >
          {loading && activeCampus === 'goa' ? 'Loading...' : 'Goa'}
        </Button>
        <Button 
          variant={activeCampus === 'hyderabad' ? 'default' : 'secondary'} 
          onClick={showHyderabadProfessors}
          disabled={loading}
        >
          {loading && activeCampus === 'hyderabad' ? 'Loading...' : 'Hyderabad'}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-8 mt-8">
          <Card className="bg-red-900 border-red-700">
            <CardContent className="pt-6">
              <div className="text-center text-red-100">
                <p className="font-semibold mb-2">Connection Error</p>
                <p className="text-sm">{error}</p>
                <p className="text-xs mt-2 opacity-75">
                  Make sure your Go backend is running: <code>cd /Users/kaifkhan/GradeMyProf && go run main.go</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Centered Search Bar */}
      <div className="flex justify-center px-8 mt-8">
        <div className="w-full max-w-md">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              className="pl-10 pr-4"
              placeholder="Search anything..."
              type="search"
            />
            <Button
              className="absolute right-1 top-1/2 h-8 -translate-y-1/2"
              size="sm"
              type="submit"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Professor Reviews List */}
      <div className="max-w-4xl mx-auto px-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'Doto, monospace' }}>
          BITS {activeCampus.charAt(0).toUpperCase() + activeCampus.slice(1)} Professors
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {professors.map((professor) => (
            <Card 
              key={professor.id} 
              className="bg-gray-900 border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => handleProfessorClick(professor)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">{professor.name}</CardTitle>
                <p className="text-gray-400 text-sm">{professor.department}</p>
                <p className="text-gray-500 text-xs">{professor.university}</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      ★ {professor.average_rating.toFixed(1)}
                    </Badge>
                    <span className="text-gray-400 text-sm">({professor.review_count} reviews)</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Difficulty: {professor.average_difficulty.toFixed(1)}/5</span>
                  <span>{professor.would_take_again_percent}% would take again</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Professor Details */}
      {selectedProfessor && (
        <div className="max-w-2xl mx-auto px-8 mt-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">{selectedProfessor.name}</CardTitle>
              <p className="text-gray-400">{selectedProfessor.department} - {selectedProfessor.university}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <Badge variant="secondary" className="bg-blue-600 text-white text-lg">
                    ★ {selectedProfessor.average_rating.toFixed(1)}
                  </Badge>
                  <p className="text-gray-400 text-sm mt-1">Overall Rating</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-lg">
                    {selectedProfessor.average_difficulty.toFixed(1)}/5
                  </Badge>
                  <p className="text-gray-400 text-sm mt-1">Difficulty</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg text-white">{selectedProfessor.would_take_again_percent}% would take again</p>
                <p className="text-gray-400 text-sm">Based on {selectedProfessor.review_count} reviews</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setSelectedProfessor(null)}
              >
                Close Details
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default App