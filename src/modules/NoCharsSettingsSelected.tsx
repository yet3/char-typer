export const NoCharsSettingsSelected = () => {
  return (
    <div className="animate-fade-in duration-200 fill-mode-forwards opacity-0 absolute w-full h-full backdrop-blur-lg z-10 grid place-items-center text-lg md:text-xl px-10 font-medium text-content-accent text-center">
      You must select at least 1 char option from the top bar
    </div>
  );
};
