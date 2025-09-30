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
    <Card className="w-full bg-gray-800 border-gray-600">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with name, course, and date */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{review.student_name}</span>
                <Badge variant="outline" className="border-gray-500 text-gray-300">{review.course}</Badge>
              </div>
              <p className="text-sm text-gray-400">{formatDate(review.created_at)}</p>
            </div>
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">Quality:</span>
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-400">({review.rating}/5)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">Difficulty:</span>
              <StarRating rating={review.difficulty} size="sm" color="orange" />
              <span className="text-sm text-gray-400">({review.difficulty}/5)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">Would take again:</span>
              <Badge variant={review.would_take_again ? "default" : "secondary"} 
                     className={review.would_take_again ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                {review.would_take_again ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Comment */}
          {review.comment && (
            <div className="pt-2">
              <p className="text-gray-300 leading-relaxed">{review.comment}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}