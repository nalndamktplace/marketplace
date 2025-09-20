const StatusMarquee = () => {
  return (
    <>
      <div className="relative z-10 flex items-center p-3 mt-10 overflow-hidden bg-primary ">
        {new Array(10).fill(0).map((_, index: number) => (
          <p className="font-semibold stats-marquee" key={index}>
            Titles Listed: 6 <span className="stats-marquee__item">•</span>{" "}
            Copies Sold: 923 <span className="stats-marquee__item">•</span>{" "}
            Hours Read: 63 <span className="stats-marquee__item">•</span> Active
            Users: 3,313 <span className="stats-marquee__item">•</span>
          </p>
        ))}
      </div>
    </>
  );
};

export default StatusMarquee;
