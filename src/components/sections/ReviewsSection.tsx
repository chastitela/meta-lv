import React from "react";

type Review = {
  author: string;
  content: string;
  avatar?: string;
};

interface Props {
  reviews: Review[];
}

const ReviewsSection: React.FC<Props> = ({ reviews }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Отзывы</h2>
        <div className="space-y-6">
          {reviews.map((review, i) => (
            <div key={i} className="p-6 border rounded-xl shadow-sm bg-gray-50">
              <p className="text-lg italic">“{review.content}”</p>
              <p className="text-right mt-4 font-semibold text-gray-700">— {review.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
