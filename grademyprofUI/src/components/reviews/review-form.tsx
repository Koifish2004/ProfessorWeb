import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { StarRating } from "../ui/star-rating";

interface ReviewFormProps {
  professorId: number;
  professorName: string;
  user: {
    email: string;
    name: string | null;
    campus: string;
  };
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

interface ReviewData {
  student_name: string;
  rating: number;
  difficulty: number;
  would_take_again: boolean;
  course: string;
  comment: string;
}

const API_BASE_URL = "http://localhost:4000/api";

export function ReviewForm({
  professorId,
  professorName,
  user,
  onReviewSubmitted,
  onCancel,
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewData>({
    student_name: "",
    rating: 5,
    difficulty: 3,
    would_take_again: true,
    course: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create reviewData that includes user_email
      const reviewData = {
        user_email: user.email,
        student_name: formData.student_name,
        rating: formData.rating,
        difficulty: formData.difficulty,
        would_take_again: formData.would_take_again,
        course: formData.course,
        comment: formData.comment,
      };

      console.log("Sending review data:", reviewData);

      const response = await fetch(
        `${API_BASE_URL}/professors/${professorId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.status}`);
      }

      const result = await response.json();
      console.log("Review submitted:", result);
      onReviewSubmitted();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Write a Review for {professorName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="student_name">Your Name</Label>
            <Input
              id="student_name"
              type="text"
              value={formData.student_name}
              onChange={(e) =>
                setFormData({ ...formData, student_name: e.target.value })
              }
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              type="text"
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              required
              placeholder="e.g., CS101, MATH201"
            />
          </div>

          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating: number) =>
                  setFormData({ ...formData, rating })
                }
                interactive={true}
              />
              <span className="text-sm text-gray-600">
                ({formData.rating}/5)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={formData.difficulty}
                onRatingChange={(difficulty: number) =>
                  setFormData({ ...formData, difficulty })
                }
                interactive={true}
                color="orange"
              />
              <span className="text-sm text-gray-600">
                ({formData.difficulty}/5)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="would_take_again"
              checked={formData.would_take_again}
              onCheckedChange={(would_take_again: boolean) =>
                setFormData({ ...formData, would_take_again })
              }
            />
            <Label htmlFor="would_take_again">Would take again</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Review Comments</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="Share your experience with this professor..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
