function MainContent({ children }) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="bg-gray-50 rounded-tl-2xl h-full p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default MainContent;
