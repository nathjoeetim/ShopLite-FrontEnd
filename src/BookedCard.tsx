import { Link } from "react-router-dom";

interface BookCardProps {
  id: number;
  title: string;
  price: number;
  images: string[];
}

const BookCard = ({ id, title, images, price }: BookCardProps) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link to={`/product/${id}`} className="relative block">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 transition-colors hover:text-[#539165]">
            {title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-[#539165]">${price}</span>
          <Link
            to={`/product/${id}`}
            className="px-3 py-1.5 text-sm text-white bg-[#539165] rounded-lg transition-colors hover:bg-[#437a50]"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
