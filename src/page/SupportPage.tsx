function SupportPage() {
  return (
    <div>
      <section className="bg-white flex  justify-center flex-col h-screen ">
        <div className="py-8  lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-primary ">
            Contact Us
          </h2>
          <p className="mb-8 lg:mb-16 font-base font-medium text-center text-black  sm:text-xl">
            Got a technical issue? Want to send feedback about our feature? Need
            details about our Business plan?
          </p>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500  sm:text-xl">
            Let us know. You can email us at{" "}
            <span className="text-primary font-semibold">
              contact@nalnda.com
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}

export default SupportPage;
