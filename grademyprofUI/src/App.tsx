import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { ReviewForm } from "./components/reviews/review-form";
import { ReviewCard } from "./components/reviews/review-card";
import { useState, useEffect } from "react";
import { validateUniversityEmail } from "./lib/auth";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase/config"; // Make sure this path matches your Firebase config file

interface Professor {
  id: number;
  name: string;
  department: string;
  campus: string;
  university: string;
  average_rating: number;
  review_count: number;
  average_difficulty: number;
  would_take_again_percent: number;
}

interface Review {
  id: number;
  professor_id: number;
  student_name: string;
  rating: number;
  difficulty: number;
  would_take_again: boolean;
  course: string;
  comment: string;
  created_at: string;
}

// API Configuration
const API_BASE_URL = "http://localhost:4000/api";

function App() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [activeCampus, setActiveCampus] = useState<
    "pilani" | "goa" | "hyderabad"
  >("pilani");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [user, setUser] = useState<{
    email: string;
    name: string | null;
    campus: string;
  } | null>(null);

  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userExistingReview, setUserExistingReview] = useState<Review | null>(
    null
  );
  const [checkingReview, setCheckingReview] = useState(false);

  //BackendCalls

  const checkUserExistingReview = async (professorId: number) => {
    if (!user) {
      setHasUserReviewed(false);
      setUserExistingReview(null);
      return;
    }

    setCheckingReview(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/professors/${professorId}/user-review?user_email=${encodeURIComponent(
          user.email
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Backend response:", data);
        setHasUserReviewed(data.hasReviewed);
        setUserExistingReview(data.existingReview || null);
      } else {
        console.error("Failed to check existing review:", response.statusText);
        setHasUserReviewed(false);
        setUserExistingReview(null);
      }
    } catch (err) {
      console.error("Error checking existing review:", err);
      setHasUserReviewed(false);
      setUserExistingReview(null);
    } finally {
      setCheckingReview(false);
    }
  };
  //Add authentication logic here

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      if (userEmail) {
        const val = validateUniversityEmail(userEmail);

        if (val.isValid) {
          setUser({
            email: userEmail,
            name: result.user.displayName,
            campus: val.campus ?? "",
          });
        } else {
          alert("Please use your university email to login");
          await signOut(auth);
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  //handle logout

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setHasUserReviewed(false);
      setUserExistingReview(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fetch professors from API
  const fetchProfessors = async (campus: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/professors?campus=${campus}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfessors(data);
    } catch (err) {
      console.error("Failed to fetch professors:", err);
      setError(
        `Failed to load professors. Make sure your backend is running on port 4000.`
      );
      setProfessors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for a specific professor
  const fetchReviews = async (professorId: number) => {
    setLoadingReviews(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/professors/${professorId}/reviews`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Campus button handlers
  const showPilaniProfessors = async () => {
    setActiveCampus("pilani");
    setSelectedProfessor(null);
    setShowReviewForm(false);
    await fetchProfessors("pilani");
  };

  const showGoaProfessors = async () => {
    setActiveCampus("goa");
    setSelectedProfessor(null);
    setShowReviewForm(false);
    await fetchProfessors("goa");
  };

  const showHyderabadProfessors = async () => {
    setActiveCampus("hyderabad");
    setSelectedProfessor(null);
    setShowReviewForm(false);
    await fetchProfessors("hyderabad");
  };

  const handleProfessorClick = (professor: Professor) => {
    setSelectedProfessor(professor);
    setShowReviewForm(false);
    fetchReviews(professor.id);

    checkUserExistingReview(professor.id);
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    if (selectedProfessor) {
      // Wait a moment for backend to update professor stats
      setTimeout(async () => {
        await fetchReviews(selectedProfessor.id);
        await fetchProfessors(activeCampus); // Refresh professor list with updated stats
        checkUserExistingReview(selectedProfessor.id); // Re-check if user has reviewed
      }, 1000);
    }
  };

  // Load professors on component mount
  useEffect(() => {
    fetchProfessors(activeCampus);
  }, []);

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ fontFamily: "Doto, monospace" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex-1"></div>
        <div className="text-center flex-1">
          <h1
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "Doto, monospace", fontWeight: 900 }}
          >
            Grade My Prof
          </h1>
          <p className="text-lg text-gray-300">
            Find the best professors at BITS
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          {user ? (
            <div className="flex items-center gap-2">
              <span>Welcome, {user.name}!</span>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={handleGoogleLogin}>Login with Google</Button>
          )}
        </div>
      </div>

      {/* Campus Selection */}
      <div className="flex justify-center gap-4 py-4 px-8">
        <Button
          variant={activeCampus === "pilani" ? "default" : "secondary"}
          onClick={showPilaniProfessors}
          disabled={loading}
          className={
            activeCampus === "pilani"
              ? ""
              : "bg-gray-700 text-white hover:bg-gray-600"
          }
        >
          {loading && activeCampus === "pilani" ? "Loading..." : "Pilani"}
        </Button>
        <Button
          variant={activeCampus === "goa" ? "default" : "secondary"}
          onClick={showGoaProfessors}
          disabled={loading}
          className={
            activeCampus === "goa"
              ? ""
              : "bg-gray-700 text-white hover:bg-gray-600"
          }
        >
          {loading && activeCampus === "goa" ? "Loading..." : "Goa"}
        </Button>
        <Button
          variant={activeCampus === "hyderabad" ? "default" : "secondary"}
          onClick={showHyderabadProfessors}
          disabled={loading}
          className={
            activeCampus === "hyderabad"
              ? ""
              : "bg-gray-700 text-white hover:bg-gray-600"
          }
        >
          {loading && activeCampus === "hyderabad" ? "Loading..." : "Hyderabad"}
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
                  Make sure your Go backend is running:{" "}
                  <code>cd /Users/kaifkhan/GradeMyProf && go run main.go</code>
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
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ fontFamily: "Doto, monospace" }}
        >
          BITS {activeCampus.charAt(0).toUpperCase() + activeCampus.slice(1)}{" "}
          Professors
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {professors.map((professor) => (
            <Card
              key={professor.id}
              className="bg-gray-800 border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => handleProfessorClick(professor)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg font-bold">
                  {professor.name}
                </CardTitle>
                <p className="text-gray-300 text-sm">{professor.department}</p>
                <p className="text-gray-400 text-xs">{professor.university}</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-600 text-white"
                    >
                      ★ {professor.average_rating.toFixed(1)}
                    </Badge>
                    <span className="text-gray-300 text-sm">
                      ({professor.review_count} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>
                    Difficulty: {professor.average_difficulty.toFixed(1)}/5
                  </span>
                  <span className="text-green-400">
                    {professor.would_take_again_percent}% would take again
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Professor Details */}
      {selectedProfessor && !showReviewForm && (
        <div className="max-w-4xl mx-auto px-8 mt-8">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-xl font-bold">
                {selectedProfessor.name}
              </CardTitle>
              <p className="text-gray-300">
                {selectedProfessor.department} - {selectedProfessor.university}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="bg-blue-600 text-white text-lg"
                  >
                    ★ {selectedProfessor.average_rating.toFixed(1)}
                  </Badge>
                  <p className="text-gray-300 text-sm mt-1">Overall Rating</p>
                </div>
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="text-lg border-gray-500 text-white"
                  >
                    {selectedProfessor.average_difficulty.toFixed(1)}/5
                  </Badge>
                  <p className="text-gray-300 text-sm mt-1">Difficulty</p>
                </div>
              </div>
              <div className="text-center mb-4">
                <p className="text-lg text-green-400 font-semibold">
                  {selectedProfessor.would_take_again_percent}% would take again
                </p>
                <p className="text-gray-300 text-sm">
                  Based on {selectedProfessor.review_count} reviews
                </p>
              </div>
              <div className="flex gap-2">
                {user ? (
                  checkingReview ? (
                    // Still checking if user has reviewed
                    <Button variant="secondary" disabled className="flex-1">
                      Checking review status...
                    </Button>
                  ) : hasUserReviewed ? (
                    // User has already reviewed - show different UI
                    <div className="flex-1 space-y-2">
                      <Button variant="secondary" disabled className="w-full">
                        ✅ You've already reviewed this professor
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (userExistingReview) {
                            alert(
                              `Your review (${userExistingReview.rating}⭐): "${
                                userExistingReview.comment || "No comment"
                              }"`
                            );
                          }
                        }}
                      >
                        View Your Review
                      </Button>
                    </div>
                  ) : (
                    // User hasn't reviewed - show write review button
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Write a Review
                    </Button>
                  )
                ) : (
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() =>
                      alert("Please log in with your BITS email to review")
                    }
                  >
                    Login to Write a Review
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedProfessor(null)}
                >
                  Close Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Reviews ({reviews.length})
            </h3>
            {loadingReviews ? (
              <div className="text-center text-gray-300 py-8">
                Loading reviews...
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-300 py-8">
                <p>No reviews yet. Be the first to review this professor!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Form */}
      {selectedProfessor && showReviewForm && user && (
        <div className="max-w-4xl mx-auto px-8 mt-8">
          <ReviewForm
            professorId={selectedProfessor.id}
            professorName={selectedProfessor.name}
            user={user}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
