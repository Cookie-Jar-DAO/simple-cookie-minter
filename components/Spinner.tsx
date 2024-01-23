export const Spinner = ({ size = "1rem" }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-gray-900 dark:border-white-900`}
      />
    </div>
  );
};
