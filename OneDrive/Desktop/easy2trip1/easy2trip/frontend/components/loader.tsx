// Add this Loader component to your project

const Loader = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader-container">
          <div className="loader-plane">
            <div className="plane"></div>
          </div>
          <p className="text-xl font-semibold text-gray-700 mt-4">Booking your Ticket...</p>
        </div>
      </div>
    );
  };
  
  export default Loader;
  