// app/(main)/components/PageContainer.js
export default function PageContainer({ children }) {
    return (
      <div className="w-full h-full pt-4 flex-1 md:mx-4 md:ml-[16.66%] md:mr-[16.66%] overflow-y-auto md:max-h-[calc(100vh-75px)]">
        {children}
      </div>
    );
  }