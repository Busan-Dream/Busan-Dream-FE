import Banner from "./components/Banner";
import Filter from "./components/Filter";
import JobPosting from "./components/JobPosting";
import Carousel from "@/components/ReactBits/Carousel";

const Main = () => {
  return (
    <div className="main">
      {/* 배너 */}
      <section role="banner" className="mt-[30px] mb-[50px] h-[250px]">
        <Banner />
        <div style={{ height: "600px", position: "relative" }}>
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
        <div>
          <Filter />
        </div>
        {/* 채용 공고 */}
        <section>
          <JobPosting />
        </section>
      </main>
    </div>
  );
};

export default Main;
