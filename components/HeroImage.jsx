import Image from "next/image";

const HeroImage = ({ foodImg, styles }) => {
  const foods = {
    1: "/images/food1.jpg",
    2: "/images/food2.jpg",
    3: "/images/food3.jpg",
  };

  return (
    <Image
      className={styles}
      width={330}
      height={300}
      src={foods[foodImg]}
      alt="hero-food"
    />
  );
};

export default HeroImage;
