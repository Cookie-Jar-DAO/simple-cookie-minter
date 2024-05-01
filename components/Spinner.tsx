export const Spinner = ({ size = "1rem" }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} dark:border-white-900 border-b-2 border-gray-900`}
      />
    </div>
  );
};
