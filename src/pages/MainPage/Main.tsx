import Carousel from "@/components/ReactBits/Carousel";
import Banner from "./components/Banner";
import JobPosting from "./components/JobPosting";
import Footer from "@/components/Footer";

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
        <JobPosting />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
