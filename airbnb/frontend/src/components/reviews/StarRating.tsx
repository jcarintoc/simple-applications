import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
}

export function StarRating({ rating, maxRating = 5, size = 16 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const starSizeClass = size === 16 ? "h-4 w-4" : size === 14 ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className={`${starSizeClass} fill-yellow-400 text-yellow-400`} />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className={`${starSizeClass} text-gray-300`} />
          <Star
            className={`absolute inset-0 ${starSizeClass} fill-yellow-400 text-yellow-400`}
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={i} className={`${starSizeClass} text-gray-300`} />
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

export function StarRatingInput({ value, onChange, size = 24 }: StarRatingInputProps) {
  const starSizeClass = "h-6 w-6";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="cursor-pointer hover:scale-110 transition-transform"
        >
          <Star
            className={`${starSizeClass} ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );
}
