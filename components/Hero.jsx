import Link from "next/link";
import HeroImage from "./HeroImage";

const Hero = () => {
  const handleScroll = (e) => {
    // first prevent the default behavior
    e.preventDefault();
    // get the href and remove everything before the hash (#)
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*\#/, "");
    // get the element by id and use scrollIntoView
    const elem = document.getElementById(targetId);
    window.scrollTo({
      top: elem?.getBoundingClientRect().top,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex  mb-[250px] xl:flex-row flex-col gap-5 relative z-0 max-w-[1440px] mx-auto items-center">
      <div className="flex-1 max-xl:pt-36 padding-x">
        <h1 className="2xl:text-[72px] sm:text-[64px] text-[50px] max-sm:text-[48px] font-extrabold">
          Find the perfect restaurant for a great night out.
        </h1>

        <p className="text-[27px] max-sm:text-[24px] font-light mt-5">
          Discover new flavors catered to your tastes.
        </p>

        <button type="button" className="custom-btn hero-btn mt-10">
          <Link href="#scrollTarget" onClick={handleScroll}>
            Explore
          </Link>
        </button>
      </div>

      <div className="flex mt-36 items-center max-xl:justify-center max-xl:mt-20">
        <div className="max-xl:flex-row">
          <HeroImage foodImg="1" styles="ml-2 mb-4" />
          <HeroImage foodImg="2" styles="ml-2 mb-4" />
        </div>
        <div className="mx-4">
          <HeroImage foodImg="3" styles="mr-1" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
