import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Professor {
  id: number
  name: string
  department: string
  university: string
  rating: number
  reviewCount: number
  difficulty: number
  wouldTakeAgain: number
}

const pilaniProfessors: Professor[] = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    department: "Computer Science",
    university: "BITS Pilani",
    rating: 4.8,
    reviewCount: 156,
    difficulty: 3.5,
    wouldTakeAgain: 87
  },
  {
    id: 2,
    name: "Prof. Anita Sharma",
    department: "Electronics & Communication",
    university: "BITS Pilani",
    rating: 4.6,
    reviewCount: 132,
    difficulty: 3.8,
    wouldTakeAgain: 82
  },
  {
    id: 3,
    name: "Dr. Vikram Singh",
    department: "Mechanical Engineering",
    university: "BITS Pilani",
    rating: 4.4,
    reviewCount: 98,
    difficulty: 3.2,
    wouldTakeAgain: 79
  },
  {
    id: 4,
    name: "Prof. Sunita Agarwal",
    department: "Mathematics",
    university: "BITS Pilani",
    rating: 4.7,
    reviewCount: 124,
    difficulty: 4.1,
    wouldTakeAgain: 85
  },
  {
    id: 5,
    name: "Dr. Amit Verma",
    department: "Physics",
    university: "BITS Pilani",
    rating: 4.5,
    reviewCount: 167,
    difficulty: 3.6,
    wouldTakeAgain: 81
  }
]

const goaProfessors: Professor[] = [
  {
    id: 6,
    name: "Dr. Maria D'Silva",
    department: "Computer Science",
    university: "BITS Goa",
    rating: 4.9,
    reviewCount: 143,
    difficulty: 3.3,
    wouldTakeAgain: 91
  },
  {
    id: 7,
    name: "Prof. Arjun Nair",
    department: "Chemical Engineering",
    university: "BITS Goa",
    rating: 4.6,
    reviewCount: 89,
    difficulty: 3.7,
    wouldTakeAgain: 84
  },
  {
    id: 8,
    name: "Dr. Priya Menon",
    department: "Biotechnology",
    university: "BITS Goa",
    rating: 4.8,
    reviewCount: 156,
    difficulty: 3.1,
    wouldTakeAgain: 88
  },
  {
    id: 9,
    name: "Prof. Rohit Kamat",
    department: "Civil Engineering",
    university: "BITS Goa",
    rating: 4.3,
    reviewCount: 76,
    difficulty: 3.9,
    wouldTakeAgain: 75
  },
  {
    id: 10,
    name: "Dr. Sneha Fernandes",
    department: "Economics",
    university: "BITS Goa",
    rating: 4.7,
    reviewCount: 134,
    difficulty: 3.4,
    wouldTakeAgain: 86
  }
]

const hyderabadProfessors: Professor[] = [
  {
    id: 11,
    name: "Dr. Krishna Reddy",
    department: "Computer Science",
    university: "BITS Hyderabad",
    rating: 4.8,
    reviewCount: 178,
    difficulty: 3.6,
    wouldTakeAgain: 89
  },
  {
    id: 12,
    name: "Prof. Lakshmi Rao",
    department: "Electronics & Instrumentation",
    university: "BITS Hyderabad",
    rating: 4.5,
    reviewCount: 112,
    difficulty: 3.8,
    wouldTakeAgain: 83
  },
  {
    id: 13,
    name: "Dr. Suresh Chandra",
    department: "Pharmaceutical Sciences",
    university: "BITS Hyderabad",
    rating: 4.7,
    reviewCount: 145,
    difficulty: 3.2,
    wouldTakeAgain: 87
  },
  {
    id: 14,
    name: "Prof. Deepika Gupta",
    department: "Management",
    university: "BITS Hyderabad",
    rating: 4.4,
    reviewCount: 93,
    difficulty: 3.0,
    wouldTakeAgain: 78
  },
  {
    id: 15,
    name: "Dr. Ravi Kumar",
    department: "Chemical Engineering",
    university: "BITS Hyderabad",
    rating: 4.6,
    reviewCount: 167,
    difficulty: 3.7,
    wouldTakeAgain: 85
  }
]

function App() {
  const [professors, setProfessors] = useState<Professor[]>(pilaniProfessors)
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [activeCampus, setActiveCampus] = useState<'pilani' | 'goa' | 'hyderabad'>('pilani')

  const showPilaniProfessors = () => {
    setProfessors(pilaniProfessors)
    setActiveCampus('pilani')
    setSelectedProfessor(null)
  }

  const showGoaProfessors = () => {
    setProfessors(goaProfessors)
    setActiveCampus('goa')
    setSelectedProfessor(null)
  }

  const showHyderabadProfessors = () => {
    setProfessors(hyderabadProfessors)
    setActiveCampus('hyderabad')
    setSelectedProfessor(null)
  }

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
        >
          Pilani
        </Button>
        <Button 
          variant={activeCampus === 'goa' ? 'default' : 'secondary'} 
          onClick={showGoaProfessors}
        >
          Goa
        </Button>
        <Button 
          variant={activeCampus === 'hyderabad' ? 'default' : 'secondary'} 
          onClick={showHyderabadProfessors}
        >
          Hyderabad
        </Button>
      </div>
      
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
                      ★ {professor.rating.toFixed(1)}
                    </Badge>
                    <span className="text-gray-400 text-sm">({professor.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Difficulty: {professor.difficulty.toFixed(1)}/5</span>
                  <span>{professor.wouldTakeAgain}% would take again</span>
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
                    ★ {selectedProfessor.rating.toFixed(1)}
                  </Badge>
                  <p className="text-gray-400 text-sm mt-1">Overall Rating</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-lg">
                    {selectedProfessor.difficulty.toFixed(1)}/5
                  </Badge>
                  <p className="text-gray-400 text-sm mt-1">Difficulty</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg text-white">{selectedProfessor.wouldTakeAgain}% would take again</p>
                <p className="text-gray-400 text-sm">Based on {selectedProfessor.reviewCount} reviews</p>
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