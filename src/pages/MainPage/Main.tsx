import Banner from "./components/Banner";
import JobPosting from "./components/JobPosting";
import Carousel from "@/components/ReactBits/Carousel";

const Main = () => {
  return (
    <div className="main">
      {/* 배너 */}
      <section
        role="banner"
        className="mt-[30px] mb-[50px] h-[250px] flex gap-6"
      >
        <Banner />
        <div className="h-full relative">
          <Carousel
            baseWidth={300}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </div>
      </section>
      <main className="flex flex-col gap-[50px] px-5 2xl:px-0">
        <JobPosting />
      </main>
    </div>
  );
};

export default Main;
