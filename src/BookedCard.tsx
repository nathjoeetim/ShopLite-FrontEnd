import { Link } from "react-router-dom";

interface BookedCardProps {
  id: number;
  title: string;
  price: number;
  images: string[];
}

const BookCard = ({ id, title, images, price }: BookedCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <Link to={`/product/${id}`} className="block relative">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 hover:text-[#539165] transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex justify-between items-center mt-3">
          <span className="text-[#539165] font-bold text-xl">${price}</span>
          <Link
            to={`/product/${id}`}
            className="text-sm bg-[#539165] text-white px-3 py-1.5 rounded-lg hover:bg-[#437a50] transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
