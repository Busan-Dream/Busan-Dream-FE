import Footer from "@/components/Footer";
import Banner from "./components/Banner";
import Filter from "./components/Filter";
import JobPosting from "./components/JobPosting";

const Main = () => {
  return (
    <div className="main">
      {/* 배너 */}
      <section role="banner" className="mt-[30px] mb-[50px] h-[250px]">
        <Banner />
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
      <Footer />
    </div>
  );
};

export default Main;
