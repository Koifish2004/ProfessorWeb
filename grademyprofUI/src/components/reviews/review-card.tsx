import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { StarRating } from "../ui/star-rating"

interface Review {
  id: number
  student_name: string
  rating: number
  difficulty: number
  would_take_again: boolean
  course: string
  comment: string
  created_at: string
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with name, course, and date */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{review.student_name}</span>
                <Badge variant="outline">{review.course}</Badge>
              </div>
              <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
            </div>
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Quality:</span>
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-600">({review.rating}/5)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Difficulty:</span>
              <StarRating rating={review.difficulty} size="sm" color="orange" />
              <span className="text-sm text-gray-600">({review.difficulty}/5)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Would take again:</span>
              <Badge variant={review.would_take_again ? "default" : "secondary"}>
                {review.would_take_again ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Comment */}
          {review.comment && (
            <div className="pt-2">
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}