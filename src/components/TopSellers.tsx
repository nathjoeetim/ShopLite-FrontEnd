import { useEffect, useState } from "react";

interface Author {
  name: string;
  isFollowing: boolean;
  image: string;
}

interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  picture: {
    medium: string;
  };
}

const TopSeller = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/?results=5");
        const data = await response.json();

        const authorsData: Author[] = data.results.map((user: RandomUser) => ({
          name: `${user.name.first} ${user.name.last}`,
          isFollowing: Math.random() < 0.5, // random follow state for demo
          image: user.picture.medium,
        }));

        setAuthors(authorsData);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchAuthors();
  }, []);

  const handleFollowClick = (index: number) => {
    setAuthors(prevAuthors =>
      prevAuthors.map((author, i) =>
        i === index ? { ...author, isFollowing: !author.isFollowing } : author
      )
    );
  };

  return (
    <div className="bg-white p-5 mx-5 mt-[5rem] border w-[23rem] rounded">
      <h2 className="text-xl font-bold mb-5">Top Sellers</h2>
      <ul>
        {authors.map((author, index) => (
          <li key={index} className="flex items-center justify-between mb-4">
            <section className="flex items-center">
              <img
                src={author.image}
                alt={author.name}
                className="w-12 h-12 rounded-full"
              />
              <span className="ml-4 font-medium">{author.name}</span>
            </section>
            <button
              onClick={() => handleFollowClick(index)}
              className={`py-1 px-3 rounded cursor-pointer transition ${
                author.isFollowing
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              {author.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSeller;
